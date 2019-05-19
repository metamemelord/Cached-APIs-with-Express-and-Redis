const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const Model = require("./model");
const { redisClient } = require("./caching");

const app = express();

app.use(bodyParser.json());
app.get("*", async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const data = await Model.find({})
    .skip(skip)
    .limit(limit)
    .cache({ skip, limit });
  res.json(data);
});

app.post("*", async (req, res) => {
  const model = new Model(req.body);
  await model.save();
  res.send({
    id: model._id
  });
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo/test";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(4000, err => {
      if (!err) {
        redisClient.FLUSHALL();
        console.log("Server started!");
      }
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  });
