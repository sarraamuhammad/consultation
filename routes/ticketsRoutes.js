// matchRoutes.js
const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketsController");
const userController = require("../controllers/userController");
const bodyParser = require("body-parser");
// Create a new Ticket
router.post(
  "/createTicket",
  bodyParser.json(),
  userController.authenticateToken,
  ticketController.createTicket
);
//Get Users Requests
router.get(
  "/getUsersTickets",
  bodyParser.json(),
  userController.authenticateToken,
  ticketController.getUserTickets
);
//Cancel Ticket
router.get(
  "/cancelTicket/:ticketId",
  bodyParser.json(),
  ticketController.cancelTicket
);

module.exports = router;
