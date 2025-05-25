// matchRoutes.js
const express = require("express");
const router = express.Router();
const stadiumController = require("../controllers/stadiumController");
const bodyParser = require("body-parser");

router.get("/getAllStadiums", bodyParser.json(), stadiumController.getStadiums); // Get all matches
// router.get("/getMatch", bodyParser.json(), matchController.getMatch); //Get a Match based on ID
router.post(
  "/createStadium",
  bodyParser.json(),
  stadiumController.createStadium
); // Create a new Stadium
router.put(
  "/updateStadium",
  bodyParser.json(),
  stadiumController.updateStadium
); // Update a Stadium data
router.delete(
  "/deleteStadium",
  bodyParser.json(),
  stadiumController.deleteStadium
); // Delete a stadium data

module.exports = router;
