const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello World");
});
// DB connected
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efvjx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("yamaha");
    const bikesCollection = database.collection("bikes");
    const userOrderCollection = database.collection("orderBikes");
    // get limit  data
    app.get("/bikes", async (req, res) => {
      const result = await bikesCollection.find({}).limit(6).toArray();
      res.send(result);
    });
    // get full data
    app.get("/moreBikes", async (req, res) => {
      const result = await bikesCollection.find({}).toArray();
      res.send(result);
    });

    // order get data
    app.use("/bikes/:orderId", async (req, res) => {
      const id = req.params.orderId;
      const cursor = { _id: ObjectId(id) };
      const result = await bikesCollection.findOne(cursor);
      res.send(result);
    });
    // post data
    app.post("/orderBikes", async (req, res) => {
      userOrderCollection.insertOne(req.body).then((result) => {
        res.send(result.insertedId);
        console.log(result);
      });
    });

    console.log("bikes");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("running on port", port);
});
