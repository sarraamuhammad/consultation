const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ticketsSchema = new Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true,
  },
  ticketHolder: {
    type: String,
    required: true,
  },
  matchId: {
    type: String,
    required: true,
  },
  seats: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model("Ticket", ticketsSchema, "tickets");
