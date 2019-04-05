const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const Model = require("./user");
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

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, error => {
  if (!error)
    app.listen(4000, err => {
      if (!err) {
        redisClient.FLUSHALL();
        console.log("Server started!");
      }
    });
});
