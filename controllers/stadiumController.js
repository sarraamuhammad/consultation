// stadiumController.js
const Stadium = require("../models/stadium");
//Creating a Stadium
const createStadium = (req, res, next) => {
  const name = req.body.name;
  const rows = req.body.rows;
  const columns = req.body.columns;
  const city = req.body.city;
  const address = req.body.address;
  const stadium = new Stadium({
    name,
    rows,
    columns,
    city,
    address,
  });
  stadium
    .save()
    .then((result) => {
      res.status(201).json({ message: "Stadium added successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};
//Get All Stadiums
const getStadiums = (req, res, next) => {
  Stadium.find()
    .then((stadiums) => {
      console.log(stadiums);
      res
        .status(200)
        .json({ stadiums, message: "Fetched All Stadiums Successfully" });
    })
    .catch((err) => {
      console.log("Couldn't Get Stadiums");
      console.log(err);
      res.status(500).json({ err, message: "Error while retrieving Stadiums" });
    });
};
//Update Stadium Info
const updateStadium = (req, res, next) => {
  const name = req.body.name;
  const rows = req.body.rows;
  const columns = req.body.columns;
  Stadium.findOne({ name: name }).then((stadium) => {
    stadium.rows = rows;
    stadium.columns = columns;
    return stadium
      .save()
      .then((result) => {
        console.log("Stadium Details Updated Successfully");
        console.log(result);
        res.status(200).json(result);
      })
      .catch((err) => console.log(err));
  });
};

//Deleting a Stadium
const deleteStadium = (req, res, next) => {
  Stadium.findOneAndDelete({ _id: req.body.id })
    .then((result) => {
      console.log("Stadium deleted Successfully");
      res.status(200).json({ message: "Stadium deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

module.exports = {
  createStadium,
  getStadiums,
  updateStadium,
  deleteStadium,
};
