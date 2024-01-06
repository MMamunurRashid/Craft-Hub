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
            { "products.sellerEmail": sellerEmail }, // For object scenario
            { products: { $elemMatch: { sellerEmail: sellerEmail } } }, // For array scenario
          ],
        };

        const orders = await ordersCollection.find(query).toArray();

        const sellerOrders = orders.map((order) => {
          let filteredProducts = [];

          // Check if products is an array or an object
          if (Array.isArray(order.products)) {
            // If products is an array, filter products by sellerEmail
            filteredProducts = order.products.filter(
              (product) => product.sellerEmail === sellerEmail
            );
          } else if (
            order.products &&
            order.products.sellerEmail === sellerEmail
          ) {
            // If products is an object, check if it matches the sellerEmail
            filteredProducts = [order.products];
          }

          return { ...order, products: filteredProducts };
        });

        res.send(sellerOrders);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });

    // seller report
    function getDateRange(option) {
      const currentDate = new Date();
      const timezone = { timeZone: "Asia/Dhaka" };

      let startOfDate, endOfDate;

      switch (option) {
        case "Today":
          startOfDate = new Date(currentDate.toLocaleString("en-US", timezone));
          startOfDate.setHours(0, 0, 0, 0);
          endOfDate = new Date(currentDate.toLocaleString("en-US", timezone));
          endOfDate.setHours(23, 59, 59, 999);
          break;

        case "Yesterday":
          startOfDate = new Date(currentDate.toLocaleString("en-US", timezone));
          startOfDate.setDate(startOfDate.getDate() - 1);
          startOfDate.setHours(0, 0, 0, 0);
          endOfDate = new Date(currentDate.toLocaleString("en-US", timezone));
          endOfDate.setDate(endOfDate.getDate() - 1);
          endOfDate.setHours(23, 59, 59, 999);
          break;

        case "This Month":
          startOfDate = new Date(currentDate.toLocaleString("en-US", timezone));
          startOfDate.setDate(1);
          startOfDate.setHours(0, 0, 0, 0);
          endOfDate = new Date(currentDate.toLocaleString("en-US", timezone));
          endOfDate.setMonth(endOfDate.getMonth() + 1, 0);
          endOfDate.setHours(23, 59, 59, 999);
          break;

        case "Last Month":
          startOfDate = new Date(currentDate.toLocaleString("en-US", timezone));
          startOfDate.setDate(1);
          startOfDate.setMonth(startOfDate.getMonth() - 1);
          startOfDate.setHours(0, 0, 0, 0);
          endOfDate = new Date(currentDate.toLocaleString("en-US", timezone));
          endOfDate.setDate(0);
          endOfDate.setHours(23, 59, 59, 999);
          break;

        default:
          startOfDate = new Date();
          endOfDate = new Date();
      }

      return { startOfDate, endOfDate };
    }

    app.get("/sales-report", verifyJWT, verifySeller, async (req, res) => {
      const sellerEmail = req.query.email;
      const decodedEmail = req.decoded.email;

      if (sellerEmail !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }

      const option = req.query.option;
      const { startOfDate, endOfDate } = getDateRange(option);

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
        const dateComponents = order.orderDate.split(/\/|, |:| /);
        const orderDate = new Date(
          dateComponents[2],
          parseInt(dateComponents[0]) - 1,
          dateComponents[1],
          dateComponents[3],
          dateComponents[4],
          dateComponents[5]
        );
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
    app.post("/orders", async (req, res) => {
      const query = req.body;
      const result = await ordersCollection.insertOne(query);
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
        cus_email: order.orderEmail,
        cus_add1: order.location,
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
          paymentStatus: false,
        });
        res.send([ url= GatewayPageURL ]);
        console.log(" : ", apiResponse);
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
        { $set: { paymentStatus:true, paidAt: new Date() } }
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

    // update delivery status by seller
    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateData = { $set: { deliveryStatus: req.body.deliveryStatus } };
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
      // console.log(req.query);
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }
      const query = { userEmail: email };
      const product = await ordersCollection.find(query).toArray();
      res.send(product);
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
    app.get("/sales-report-admin", verifyJWT, verifyAdmin, async (req, res) => {
      const sellerEmail = req.query.email;
      const decodedEmail = req.decoded.email;

      if (sellerEmail !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }

      const option = req.query.option;
      const { startOfDate, endOfDate } = getDateRange(option);

      const orders = await ordersCollection
        .find({
          deliveryStatus: "complete",
          paymentStatus: true,
        })
        .toArray();

      const filteredOrders = orders.filter((order) => {
        const dateComponents = order.orderDate.split(/\/|, |:| /);
        const orderDate = new Date(
          dateComponents[2],
          parseInt(dateComponents[0]) - 1,
          dateComponents[1],
          dateComponents[3],
          dateComponents[4],
          dateComponents[5]
        );
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
    
      try {
        const userReviews = await reviewCollection.find({ userEmail: email }).toArray();
    
        const reviewDetails = await Promise.all(userReviews.map(async (review) => {
          const productInfo = await productsCollection.findOne({ _id: new ObjectId(review.productId) });
          return { review, productInfo };
        }));
    
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
