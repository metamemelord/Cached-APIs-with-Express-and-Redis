const mongoose = require("./caching").mongoose;
const Schema = mongoose.Schema;

const randomSchema = new Schema({
  field_1: String,
  field_2: String,
  array_1: Array
});

module.exports = mongoose.model("random-doc", randomSchema);
