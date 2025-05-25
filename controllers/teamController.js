// matchController.js
const Team = require("../models/team");

//Add Team
const createTeam = (req, res, next) => {
  const name = req.body.name;
  Team.findOne({ name: name }).then((result) => {
    if (result) {
      console.log(result);
      res.status(200).json({ result, message: "Team Already Exists" });
    } else {
      const team = new Team({
        name,
      });
      team
        .save()
        .then((result) => {
          console.log("Team added Successfully");
          res.status(200).json({ message: "Team added successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err.message });
        });
    }
  });
};

//Get All Teams
const getAllTeams = (req, res, next) => {
  Team.find()
    .then((teams) => {
      console.log(teams);
      res.status(200).json(teams);
    })
    .catch((err) => {
      console.log("Couldn't get teams");
      console.log(err);
      res.status(500).json({ err, message: "Error Loading Matches" });
    });
};

//gets a user based on a username
const getTeam = (req, res, next) => {
  name = req.params.name;
  Team.findOne({ name: name })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeam,
};
