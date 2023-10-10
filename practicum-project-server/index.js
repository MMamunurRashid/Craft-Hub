const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());




async function run() {
    try {  

      
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