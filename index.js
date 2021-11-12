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
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("review");
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
    app.get("/bikes/:orderId", async (req, res) => {
      const id = req.params.orderId;
      const cursor = { _id: ObjectId(id) };
      const result = await bikesCollection.findOne(cursor);
      res.send(result);
    });
    // get user data
    app.get("/users/:userDataId", async (req, res) => {
      const id = req.params.userDataId;
      const cursor = { _id: ObjectId(id) };
      const result = await userCollection.findOne(cursor);
      res.send(result);
    });

    // get order data
    app.get("/orderBike", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = userOrderCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });
    // get review data
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });

    // post users data
    app.post("/users", async (req, res) => {
      const result = await userCollection.insertOne(req.body);
    });

    // post order  data
    app.post("/orderBikes", async (req, res) => {
      userOrderCollection.insertOne(req.body).then((result) => {
        res.send(result.insertedId);
      });
    });

    // post review data
    app.post("/review", async (req, res) => {
      reviewCollection.insertOne(req.body).then((result) => {
        res.send(result.insertedId);
      });
    });
    app.delete("/orderBikes/:id", async (req, res) => {
      const id = req.params.id;

      const cursor = { _id: ObjectId(id) };
      const result = await userOrderCollection.deleteOne(cursor);
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
