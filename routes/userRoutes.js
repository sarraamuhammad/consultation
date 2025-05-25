const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bodyParser = require("body-parser");

// Get all users
router.get("/getUsers", bodyParser.json(), userController.getUsers);
//Get a user based on userName
router.get(
  "/getUser",
  bodyParser.json(),
  userController.authenticateToken,
  userController.getUser
);
// Create a new user
router.post("/createUser", bodyParser.json(), userController.createUser);
// Update user's details
router.put(
  "/updateUser",
  bodyParser.json(),
  userController.authenticateToken,
  userController.updateUser
);
router.post("/promoteUser", bodyParser.json(), userController.promoteUser); // promote a user to admin
router.post("/demoteUser", bodyParser.json(), userController.demoteUser); // demote a user to user
router.post(
  "/promoteToAdmin",
  bodyParser.json(),
  userController.authenticateToken,
  userController.promoteToAdmin
); // promote a user to admin
router.delete("/deleteUser", bodyParser.json(), userController.deleteUser); // delete a user
router.post("/login", bodyParser.json(), userController.login); // login a user
router.put("/forgotPassword", bodyParser.json(), userController.forgotPassword);
router.put(
  "/changePassword",
  bodyParser.json(),
  userController.authenticateToken,
  userController.changePassword
);
//Get All SignUp Requests
router.get(
  "/getSignUpRequests",
  bodyParser.json(),
  userController.authenticateToken,
  userController.getAllRequests
);
//Logout User
router.post(
  "/logout",
  bodyParser.json(),
  userController.authenticateToken,
  userController.logout
);
//Handle Requests
router.post(
  "/handleRequest",
  bodyParser.json(),
  userController.handleRequest
);
module.exports = router;
