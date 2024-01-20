const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.Store_ID;
const store_passwd = process.env.Store_Password;
// console.log(store_id, store_passwd);
const is_live = false; //true for live, false for sandbox

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Password}@cluster0.w7jtt1b.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// verify jwt
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send("Unauthorized Access");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access Request" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    // collections
    const usersCollection = client.db("CreativeHub").collection("users");
    const categoriesCollection = client
      .db("CreativeHub")
      .collection("categories");
    const productsCollection = client.db("CreativeHub").collection("products");
    const ordersCollection = client.db("CreativeHub").collection("orders");
    const reviewCollection = client.db("CreativeHub").collection("reviews");

    // Verify Admin
    const verifyAdmin = async (req, res, next) => {
      const decodedEmail = req.decoded.email;
      const query = { email: decodedEmail };
      const user = await usersCollection.findOne(query);

      if (user?.role !== "Admin") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };
    // Verify Seller
    const verifySeller = async (req, res, next) => {
      const decodedEmail = req.decoded.email;
      const query = { email: decodedEmail };
      const user = await usersCollection.findOne(query);

      if (user?.role !== "Seller") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    //jwt
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      // console.log(user);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "60d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "Forbidden Access" });
    });

    // get all  admin
    app.get("/admin", verifyJWT, verifyAdmin, async (req, res) => {
      const role = "Admin";
      const query = { role: role };
      const admin = await usersCollection.find(query).toArray();
      res.send(admin);
    });
    // Get, add, delete Admin. All kind of Admin role
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "Admin" });
    });

    // all kind of a seller role
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email };
      const user = await usersCollection.findOne(query);
      // console.log(user.role);
      res.send({ isSeller: user?.role === "Seller" });
    });

    // all kind of a delivery man role
    app.get("/users/delivery-man/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email };
      const user = await usersCollection.findOne(query);
      // console.log(user.role);
      res.send({ isDeliveryMan: user?.role === "Delivery Man" });
    });

    //get seller and buyer from admin panel
    app.get("/seller", verifyJWT, verifyAdmin, async (req, res) => {
      const role = "Seller";
      const query = { role: role };
      const Buyer = await usersCollection.find(query).toArray();
      res.send(Buyer);
    });

    app.get("/buyer", verifyJWT, verifyAdmin, async (req, res) => {
      const role = "Buyer";
      const query = { role: role };
      const seller = await usersCollection.find(query).toArray();
      res.send(seller);
    });
    // User add, delete, make change of users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const user = {};
      const result = await usersCollection.find(user).toArray();
      res.send(result);
    });

    // delivery man 
    app.get("/delivery-man", async (req, res) => {
      const user = {role: 'Delivery Man'};
      const result = await usersCollection.find(user).toArray();
      res.send(result);
    });

    // delivery man orders 
    app.get("/delivery-man-orders/:email", async (req, res) => {
      const deliveryManEmail = req.params.email;
  
      // Find orders with matching deliveryManEmail and sort by deliveryStatus
      const query = { deliveryManEmail: deliveryManEmail };
      const orders = await ordersCollection.find(query).sort({ deliveryStatus: 1 }).toArray();
  
      // Move orders with deliveryStatus 'complete' to the end
      const sortedOrders = orders.sort((a, b) => {
          if (a.deliveryStatus === 'complete' && b.deliveryStatus !== 'complete') {
              return 1;
          } else if (a.deliveryStatus !== 'complete' && b.deliveryStatus === 'complete') {
              return -1;
          } else {
              return 0;
          }
      });
  
      res.send(sortedOrders);
  });
  

    // update delivery status by delivery man
    app.patch("/update-delivery-status/:id", async (req, res) => {
      const id = req.params.id;
      const deliveryStatus = req.body.deliveryStatus;

      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateData = { $set: { deliveryStatus: deliveryStatus } };
  
      const result = await ordersCollection.updateOne(query, updateData);
      res.send(result);
    });

    // cash recived by delivery man
    app.patch("/update-payment-status/:id", async (req, res) => {
      const id = req.params.id;
      const paymentStatus = req.body.paymentStatus;

      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateData = { $set: { paymentStatus: paymentStatus } };
  
      const result = await ordersCollection.updateOne(query, updateData);
      res.send(result);
    });

    // delivery notes by delivery man
    app.patch("/delivery-notes/:id", async (req, res) => {
      const id = req.params.id;
      const deliveryNotes = req.body.deliveryNotes;

      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateData = { $set: { deliveryNotes: deliveryNotes } };
  
      const result = await ordersCollection.updateOne(query, updateData);
      res.send(result);
    });

    // product return by customer
    app.patch("/product-return/:id", async (req, res) => {
      const id = req.params.id;
      const returnNotes = req.body.returnNotes;

      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateData = { $set: { returnNotes: returnNotes } };
  
      const result = await ordersCollection.updateOne(query, updateData);
      res.send(result);
    });


    // user by email
    app.get("/user-profile", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const result = await usersCollection.findOne({email: email});
      res.send(result);
    });
    // Assuming usersCollection is your MongoDB collection

    app.patch("/users/:id", async (req, res) => {
      const userId = req.params.id;
      // const updatedUserData = req.body;
      const query = { _id: new ObjectId(userId) };
      const updateData = { $set: { address: req.body.address } };

      try {
        // Find the user by userId and update their address
        const result = await usersCollection.updateOne(query, updateData);

        res.send(result)
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Categories
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoriesCollection.find(query).toArray();
      res.send(result);
    });

    //products
    app.get("/products", async (req, res) => {
      const query = { invisible: { $ne: "invisible" } };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    // products fro product slider
    app.get("/product-slider", async (req, res) => {
      const query = { invisible: { $ne: "invisible" } };
      const result = await productsCollection
        .find(query)
        .sort({ saleQuantity: -1 }) // Sort by saleQuantity in descending order
        .limit(9) // Limit the result to the top 8 products
        .toArray();

      res.send(result);
    });

    //products
    app.get("/products-home", async (req, res) => {
      const query = { invisible: { $ne: "invisible" } };
      const result = await productsCollection.find(query).limit(8).toArray();
      res.send(result);
    });

    // product page with limits
    app.get("/products-page", async (req, res) => {
      const limit = parseInt(req.query.limit) || 6;
      const query = { invisible: { $ne: "invisible" } };

      try {
        const result = await productsCollection
          .find(query)
          .limit(limit)
          .toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // products by category
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      // const query = { productCategory: id };
      const query = { productCategory: id, invisible: { $ne: "invisible" } };
      const products = await productsCollection.find(query).toArray();
      const product = products.filter((p) => {
        if (p.status !== "sold") {
          return p;
        }
      });
      // console.log(product);
      // const filter = { status: product };
      res.send(product);
    });

    // product by id
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // update product by id
    app.patch("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateData = { $set: { invisible: req.body.invisible } };
      const result = await productsCollection.updateOne(query, updateData);
      res.send(result);
    });

    // update product by id
    app.patch("/quantity-update-product/:id", async (req, res) => {
      const id = req.params.id;
      const quantityToAdd = parseInt(req.body.quantity, 10) || 0;
      console.log(id, quantityToAdd);

      const query = { _id: new ObjectId(id) };

      // Assuming availableQuantity is a field in your document
      const updateData = { $inc: { availableQuantity: quantityToAdd } };

      try {
        const result = await productsCollection.updateOne(query, updateData);
        res.send(result);
      } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // search product
    app.get("/search-products", async (req, res) => {
      const search = req.query.search;

      let query = {
        invisible: { $ne: "invisible" },
      };

      if (search && search.length) {
        query.$or = [
          { productName: { $regex: search, $options: "i" } },
          { productCategory: { $regex: search, $options: "i" } },
        ];
      }

      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();

      res.send(products);
    });

    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    // sellers my product
    // sellers my product
    app.get("/my-product", verifyJWT, verifySeller, async (req, res) => {
      const email = req.query.email;

      // console.log(email);
      const query = { sellerEmail: email };
      const product = await productsCollection.find(query).toArray();
      res.send(product);
    });

    // sellers product order
    app.get("/product-order", verifyJWT, verifySeller, async (req, res) => {
      const sellerEmail = req.query.email;
      const decodedEmail = req.decoded.email;

      if (sellerEmail !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }

      try {
        const query = {
          $or: [
            { "products.sellerEmail": sellerEmail },
            { products: { $elemMatch: { sellerEmail: sellerEmail } } },
          ],
        };
        const sortOrder = { orderDate: -1 };
        const orders = await ordersCollection
          .find(query)
          .sort(sortOrder)
          .toArray();

        const sellerOrders = orders.map((order) => {
          let filteredProducts = [];

          if (Array.isArray(order.products)) {
            filteredProducts = order.products.filter(
              (product) => product.sellerEmail === sellerEmail
            );
          } else if (
            order.products &&
            order.products.sellerEmail === sellerEmail
          ) {
            filteredProducts = [order.products];
          }

          return { ...order, products: filteredProducts };
        });

        // Sort the sellerOrders array by orderDate in descending order
        sellerOrders.sort((a, b) => b.orderDate - a.orderDate);

        res.send(sellerOrders);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });

    // seller sales report
    app.get("/sales-report", verifyJWT, verifySeller, async (req, res) => {
      const sellerEmail = req.query.email;
      const decodedEmail = req.decoded.email;

      if (sellerEmail !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }

      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;

      // Validate fromDate and toDate here if needed...

      const startOfDate = new Date(fromDate);
      const endOfDate = new Date(toDate);

      const orders = await ordersCollection
        .find({
          deliveryStatus: "complete",
          paymentStatus: true,
          $or: [
            { "products.sellerEmail": sellerEmail },
            { products: { $elemMatch: { sellerEmail: sellerEmail } } },
          ],
        })
        .toArray();

      const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startOfDate && orderDate <= endOfDate;
      });

      const sellerOrders = filteredOrders.map((order) => {
        let filteredProducts = [];
        if (Array.isArray(order.products)) {
          filteredProducts = order.products.filter(
            (product) => product.sellerEmail === sellerEmail
          );
        } else if (
          order.products &&
          order.products.sellerEmail === sellerEmail
        ) {
          filteredProducts = [order.products];
        }
        return { ...order, products: filteredProducts };
      });

      res.send(sellerOrders);
    });

    // buyer order
    // Orders
    // app.post("/orders", async (req, res) => {
    //   const query = req.body;
    //   const result = await ordersCollection.insertOne(query);
    //   res.send(result);
    // });

    app.post("/orders", async (req, res) => {
      const query = req.body;

      try {
        // Check if products is an array
        if (Array.isArray(query.products)) {
          // Update products in productsCollection for each product in the array
          for (const product of query.products) {
            const productId = new ObjectId(product._id);

            // Increase sale quantity and decrease available quantity
            const result = await productsCollection.updateOne(
              { _id: productId },
              {
                $inc: {
                  // saleQuantity: 1,
                  // availableQuantity: -1,
                  saleQuantity: product.quantity,
                  availableQuantity: -product.quantity,
                },
              }
            );

            console.log(
              `Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`
            );
          }
        } else if (typeof query.products === "object") {
          // Update products in productsCollection for a single product
          const productId = new ObjectId(query.products._id);

          // Increase sale quantity and decrease available quantity
          const result = await productsCollection.updateOne(
            { _id: productId },
            {
              $inc: {
                // saleQuantity: 1,
                // availableQuantity: -1,
                saleQuantity: query.products.quantity,
                availableQuantity: -query.products.quantity,
              },
            }
          );

          console.log(
            `Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`
          );
        } else {
          throw new Error("Products should be an array or a single object.");
        }

        const result = await ordersCollection.insertOne(query);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
        return;
      } finally {
      }
    });
    // get order by id
    // product by id
    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ordersCollection.findOne(query);
      res.send(result);
    });
    // online payment order
    // Orders with payment
    app.post("/orders-payment", async (req, res) => {
      const order = req.body;

      let productNames = "";
      if (Array.isArray(order.products)) {
        // If `order.products` is an array, join the product names
        productNames = order.products
          .map((product) => product.productName)
          .join(", ");
      } else if (order.products && order.products.productName) {
        // If `order.products` is an object, it's a single product
        productNames = order.products.productName;
      }

      const transactionId = new ObjectId().toString();
      const data = {
        total_amount: order.totalPrice,
        currency: "BDT",
        tran_id: transactionId, // use unique tran_id for each api call
        success_url: `http://localhost:5000/payment/success?transactionId=${transactionId}`,
        fail_url: `http://localhost:5000/payment/fail?transactionId=${transactionId}`,
        cancel_url: `http://localhost:5000/payment/cancel`,
        ipn_url: "http://localhost:5000/ipn",
        product_name: productNames,
        product_category: "craft",
        product_profile: "general",
        cus_name: order.userName,
        cus_email: order.userEmail,
        cus_add1: order.location.district,
        shipping_method: "No",
        cus_country: "Bangladesh",
        cus_phone: order.phoneNumber,
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        ordersCollection.insertOne({
          ...order,
          transactionId,
          paymentdata: data,
          paymentStatus: false,
        });
        res.send([(url = GatewayPageURL)]);
        // console.log(" : ", apiResponse);
      });

      // const result = await orderCollection.insertOne(query);
      // res.send(result);
    });

    app.post("/payment/success", async (req, res) => {
      const { transactionId } = req.query;

      if (!transactionId) {
        return res.redirect(`http://localhost:3000/dashboard/my-order`);
      }

      const result = await ordersCollection.updateOne(
        { transactionId },
        { $set: { paymentStatus: true, paidAt: new Date() } }
      );

      if (result.modifiedCount > 0) {
        res.redirect(`http://localhost:3000/dashboard/my-order`);
      }
    });

    app.post("/payment/fail", async (req, res) => {
      const { transactionId } = req.query;
      if (!transactionId) {
        return res.redirect(`http://localhost:3000/dashboard/my-order`);
      }
      const result = await ordersCollection.deleteOne({ transactionId });
      if (result.deletedCount) {
        res.redirect(`http://localhost:3000/dashboard/my-order`);
      }
    });

    // assign delivery man by seller
    app.patch("/assign-delivery-man/:id", async (req, res) => {
      const id = req.params.id;
      const deliveryManEmail = req.body.deliveryManEmail;
      const deliveryStatus = req.body.deliveryStatus;

      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateData = { $set: { deliveryStatus: deliveryStatus, deliveryManEmail } };
  
      const result = await ordersCollection.updateOne(query, updateData);
      res.send(result);
    });

    // for update payment by seller
    app.patch("/order-payment/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateData = { $set: { paymentStatus: req.body.paymentStatus } };
      const result = await ordersCollection.updateOne(query, updateData);
      res.send(result);
    });

    // my order
    app.get("/my-order", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;

      if (email !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }

      const query = { userEmail: email };

      // Sort the results based on orderDate in descending order
      const sortOrder = { orderDate: -1 };

      const products = await ordersCollection
        .find(query)
        .sort(sortOrder)
        .toArray();

      res.send(products);
    });

    // // orders for seller
    // app.get("/ordered-product", async (req, res) => {
    //   const email = req.query.email;
    //   // const decodedEmail = req.decoded.email;

    //   // if (email !== decodedEmail) {
    //   //   return res.status(403).send("Forbidden Access Request");
    //   // }

    //   try {

    //     const orders = await ordersCollection.find({
    //       $or: [
    //         { 'products.sellerEmail': email },
    //         { 'products': { $elemMatch: { sellerEmail: email } } }
    //       ]
    //     }).toArray();

    //     res.send(orders);
    //   } catch (error) {
    //     res.status(500).send("Internal Server Error");
    //   }
    // });

    // sales report for admin
    // sales report for admin
    app.get("/sales-report-admin", verifyJWT, verifyAdmin, async (req, res) => {
      const sellerEmail = req.query.email;
      const decodedEmail = req.decoded.email;

      if (sellerEmail !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }

      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;

      // Validate fromDate and toDate here if needed...

      const startOfDate = new Date(fromDate);
      const endOfDate = new Date(toDate);

      const orders = await ordersCollection
        .find({
          deliveryStatus: "complete",
          paymentStatus: true,
        })
        .toArray();

      const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startOfDate && orderDate <= endOfDate;
      });

      res.send(filteredOrders);
    });

    // review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // review by product id
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { productId: id };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/my-reviews", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;

      if (email !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }
      const sortReview = { reviewTime: -1 };
      try {
        const userReviews = await reviewCollection
          .find({ userEmail: email })
          .sort(sortReview)
          .toArray();

        const reviewDetails = await Promise.all(
          userReviews.map(async (review) => {
            const productInfo = await productsCollection.findOne({
              _id: new ObjectId(review.productId),
            });
            return { review, productInfo };
          })
        );

        res.json(reviewDetails);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", async (req, res) => {
  res.send("Craft Hub running");
});
app.listen(port, () => {
  console.log(`Craft Hub running on port: ${port}`);
});
