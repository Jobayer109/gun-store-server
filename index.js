const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

//mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jhedavh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  const gunCollection = client.db("Gun-store").collection("guns");
  const orderCollection = client.db("Gun-store").collection("orders");
  try {
    app.get("/guns", async (req, res) => {
      const query = {};
      const cursor = gunCollection.find(query);
      const guns = await cursor.toArray();
      res.send(guns);
    });

    app.get("/guns/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await gunCollection.findOne(query);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const deleteOrder = await orderCollection.deleteOne(query);
      res.send(deleteOrder);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result);
    });
  } finally {
  }
};
dbConnect().catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.send("Gun store server is running, Trust me.!!");
});

app.listen(port, () => {
  console.log(`Gun store server running on ${port}`);
});
