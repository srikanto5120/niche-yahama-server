const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(
  cors()
);

app.get("/", (req, res) => {
  res.json("Hello World");
});
// DB connected
const uri =
  "mongodb+srv://task:BpWQHWEVALv1lgIZ@cluster0.s33grhs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("task");
    const sectorsCollection = database.collection("sectors");

    // get full data
    app.get("/sectors", async (req, res) => {
      const result = await sectorsCollection.find({}).toArray();
      res.send(result);
    });
    app.post("/sectors", async (req, res) => {
      sectorsCollection.insertOne(req.body).then((result) => {
        res.send(result.insertedId);
      });
    }); 
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("running on port", port);
});
