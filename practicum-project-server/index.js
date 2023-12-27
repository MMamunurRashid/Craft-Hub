const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

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
          expiresIn: "1d",
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
    app.get("/product-order", verifyJWT,verifySeller, async (req, res) => {
      const sellerEmail = req.query.email;
      // console.log(req.query);
      const decodedEmail = req.decoded.email;
      
      
      if (sellerEmail !== decodedEmail) {
        return res.status(403).send("Forbidden Access Request");
      }
    
      try {
        // Query the orders collection to find orders with products related to the seller
        const query = { "products.sellerEmail": sellerEmail }; 
        const orders = await ordersCollection.find(query).toArray();
        
        // Filter orders to retrieve only products relevant to the seller
        const sellerOrders = orders.map(order => {
          const filteredProducts = order.products.filter(product => product.sellerEmail === sellerEmail);
          return { ...order, products: filteredProducts };
        });
    
        res.send(sellerOrders);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });
    // buyer order
    // Orders
    app.post("/orders", async (req, res) => {
      const query = req.body;
      const result = await ordersCollection.insertOne(query);
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
