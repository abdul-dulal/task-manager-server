const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors({ origin: "*" }));
app.use(express.json());
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://task-manager:uzAjbtPc0LsPaZsT@cluster0.aglb2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("taskManager").collection("task");
    const completeCollection = client.db("taskManager").collection("complete");

    app.post("/addTask", async (req, res) => {
      const task = req.body;

      const addTask = await taskCollection.insertOne(task);
      res.send(addTask);
    });

    app.get("/getTask", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const getTask = await taskCollection.find(query).toArray();
      res.send(getTask);
    });

    app.get("/newtask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    // PUT
    app.put("/updateTask/:id", async (req, res) => {
      const id = req.params.id;
      const updateTask = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          task: updateTask.task,
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);

      res.send(result);
    });

    app.post("/postTask/:id", async (req, res) => {
      const body = req.body;
      const result = await completeCollection.insertOne(body);
      res.send(result);
    });
    app.get("/completeData", async (req, res) => {
      const result = await completeCollection.find().toArray();
      res.send(result);
    });

    // delete task
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Manager!");
});

app.listen(port, () => {
  console.log("inside ", port);
});
