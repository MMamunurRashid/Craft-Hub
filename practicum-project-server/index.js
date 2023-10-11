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
  }
});


async function run() {
    try {  
      // collections 
      const usersCollection = client.db("CreativeHub").collection("users");


          // User add, delete, make change of users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
      
          }
    
    finally {
    }
}
  run().catch((err) => console.error(err));

app.get("/", async (req, res) => {
    res.send("First Office app!!! running");
  });
  app.listen(port, () => {
    console.log(`First Office app!! running on port: ${port}`);
  });