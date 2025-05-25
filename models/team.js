const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const teamSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Team", teamSchema, "teams");
