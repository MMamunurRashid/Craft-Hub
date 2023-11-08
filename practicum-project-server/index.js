const express = require("express");
const cors = require("cors");

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

async function run() {
  try {
    // collections
    const usersCollection = client.db("CreativeHub").collection("users");
    const categoriesCollection = client
      .db("CreativeHub")
      .collection("categories");
    const productsCollection = client.db("CreativeHub").collection("products");

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
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/search-products", async (req, res) => {
      // const query = { price: { $gt: 100, $lt: 300 } }
      // const query = { price: { $eq: 200 } }
      // const query = { price: { $lte: 200 } }
      // const query = { price: { $ne: 150 } }
      // const query = { price: { $in: [20, 40, 150] } }
      // const query = { price: { $nin: [20, 40, 150] } }
      // const query = { $and: [{price: {$gt: 20}}, {price: {$gt: 100}}] }
      // const query = { price: { $gt: 100, $lt: 300 } };
      const search = req.query.search;
      // console.log('search :', req.query);
      let query = {};
      if (search.length) {
        query = {
          productName: { $regex: search, $options: "i" },
        };
      }
      const cursor = productsCollection.find(query);
      // console.log(cursor);
      const products = await cursor.toArray();

      res.send(products);
    });

   
    

    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", async (req, res) => {
  res.send("First Office app!!! running");
});
app.listen(port, () => {
  console.log(`First Office app!! running on port: ${port}`);
});
