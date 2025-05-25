// matchController.js
const Ticket = require("../models/tickets");
const Match = require("../models/match");

//creates a Ticket
const createTicket = async (req, res, next) => {
  try {
    console.log(req.USER.result.userName);
    const ticketHolder = req.USER.result.userName;
    const matchId = req.body.matchId;
    const seats = req.body.seats;

    const ticketPromises = seats.map(async (seat) => {
      console.log("These Are The Seats");
      console.log(seat[0]);
      console.log(seat[1]);
      const row = seat[0];
      const column = seat[1];
      const ticketId = ticketHolder + row + column + matchId;
      console.log(ticketId);

      const existingTicket = await Ticket.findOne({ ticketId: ticketId });
      if (existingTicket) {
        console.log(existingTicket);
        throw new Error("Ticket Already Exists");
      } else {
        const ticket = new Ticket({
          ticketId,
          ticketHolder,
          matchId,
          seats: seat,
        });
        await ticket.save();
        console.log("Ticket added Successfully");

        const resultMatch = await Match.findOne({ _id: matchId });
        console.log("GEBT EL MATCH");
        resultMatch.reservedSeats.push(seat);
        console.log(resultMatch.reservedSeats);
        await resultMatch.save();
        return ticket; // Return the ticket to be used in Promise.all()
      }
    });

    const createdTickets = await Promise.all(ticketPromises);
    res.status(200).json({
      tickets: createdTickets,
      message: "All tickets added successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

//Get User Tickets
const getUserTickets = (req, res, next) => {
  const userName = req.USER.result.userName;
  console.log(req.USER.result.userName);
  Ticket.find({ ticketHolder: userName })
    .then((tickets) => {
      console.log(tickets);
      res
        .status(200)
        .json({ tickets, message: "Ticket Retrieved Successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ err, message: "This User Has No Tickets" });
    });
};

//Cancel Ticket
const cancelTicket = (req, res, next) => {
  const ticketId = req.params.ticketId;
  Ticket.findOneAndDelete({ ticketId: ticketId })
    .then((ticket) => {
      if (ticket) {
        console.log(ticket);
        console.log(ticket.matchId);
        Match.findOne({ _id: ticket.matchId }).then((match) => {
          let indexToRemove = match.reservedSeats.findIndex(
            (subArray) =>
              subArray.length === 2 &&
              subArray.includes(ticket.seats[0]) &&
              subArray.includes(ticket.seats[0])
          );
          if (indexToRemove !== -1) {
            match.reservedSeats.splice(indexToRemove, 1);
          }
          console.log("SHELT EL SEATS");
          console.log(match);
          match.save();
        });
        res
          .status(200)
          .json({ ticket, message: "Ticket Cancelled Successfully" });
      } else {
        res.status(404).json({ message: "This Ticket Wasn't Found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err, message: "Error Cancelling Ticket" });
    });
};
module.exports = {
  createTicket,
  getUserTickets,
  cancelTicket,
};
