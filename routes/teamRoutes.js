// matchRoutes.js
const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const bodyParser = require("body-parser");

router.post("/createTeam", bodyParser.json(), teamController.createTeam); // Create a new Team
router.get("/getAllTeams", bodyParser.json(), teamController.getAllTeams); // Get All Teams
router.get("/getTeam/:name", bodyParser.json(), teamController.getTeam); // Get All Teams

module.exports = router;
