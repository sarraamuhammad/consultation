const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const stadiumSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Stadium", stadiumSchema, "stadiums");
