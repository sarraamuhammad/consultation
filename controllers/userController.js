const User = require("../models/user");

const jwt = require("jsonwebtoken");
require("dotenv").config();
///////////////////////////

const authenticateToken = (req, res, next) => {
  // authorization: bearer <TOKEN>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.sendStatus(401);
  }
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: "Token has been logged out" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.PRIVILEGE = user.role;
    req.USER = user;
    next();
  });
};

/////////////////////////////
//returns all users
const getUsers = (req, res, next) => {
  if (req.PRIVILEGE !== "admin") {
    res.status(403).json({ error: "not authorized" });
  }
  User.find()
    .then((users) => {
      console.log(users);
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("Couldn't get users");
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

//gets a user based on a username
const getUser = (req, res, next) => {
  console.log(req.USER.result.userName);
  User.findOne({ userName: req.USER.result.userName })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

//creates a user
const createUser = (req, res, next) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthDate = req.body.birthDate;
  const gender = req.body.gender;
  const city = req.body.city;
  const address = req.body.address;
  const emailAddress = req.body.emailAddress;
  const role = req.body.role;
  User.findOne({ userName: userName }).then((result) => {
    if (result) {
      console.log(result);
      res.status(200).json({ result, message: "User Already Exists" });
    } else {
      const user = new User({
        userName,
        password,
        firstName,
        lastName,
        birthDate,
        gender,
        city,
        address,
        emailAddress,
        role,
        isConfirmed: 1,
      });
      user
        .save()
        .then((result) => {
          console.log("User added Successfully");
          res.status(200).json({ message: "User added successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err.message });
        });
    }
  });
};

const updateUser = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthDate = req.body.birthDate;
  const gender = req.body.gender;
  const city = req.body.city;
  const address = req.body.address;
  const role = req.body.role;
  const filter = { userName: req.USER.result.userName };
  const update = {
    firstName: firstName,
    lastName: lastName,
    birthDate: birthDate,
    gender: gender,
    city: city,
    address: address,
    role: role,
  };
  User.findOneAndUpdate(filter, update)
    .then((result) => {
      if (result.role === req.USER.result.userName) {
        console.log("User Info Updated Successfully");
        res.status(200).json({ message: "User Info Updated successfully" });
      } else {
        console.log("User Info & Role Updated Successfully");
        res
          .status(200)
          .json({ message: "User Info & Role Updated successfully" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};
//promote user to admin
const promoteUser = (req, res, next) => {
  const filter = { userName: req.body.userName };
  const update = { role: "manager" };
  if (req.PRIVILEGE !== "admin") {
    res.status(403).json({ error: "not authorized" });
  }
  User.findOneAndUpdate(filter, update)
    .then((result) => {
      console.log("User promoted Successfully");
      res.status(200).json({ message: "User promoted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//demote user to user
const demoteUser = (req, res, next) => {
  const filter = { userName: req.body.userName };
  const update = { role: "user" };
  if (req.PRIVILEGE !== "admin") {
    res.status(403).json({ error: "not authorized" });
  }
  User.findOneAndUpdate(filter, update)
    .then((result) => {
      console.log("User demoted Successfully");
      res.status(200).json({ message: "User demoted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//promote user to admin
const promoteToAdmin = (req, res, next) => {
  const filter = { userName: req.body.userName };
  const update = { role: "admin" };

  if (req.PRIVILEGE !== "admin") {
    res.status(403).json({ error: "not authorized" });
  }
  User.findOneAndUpdate(filter, update)
    .then((result) => {
      console.log("User promoted to admin Successfully");
      res.status(200).json({ message: "User promoted to admin successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//delete a user
const deleteUser = (req, res, next) => {
  if (req.PRIVILEGE !== "admin") {
    res.status(403).json({ error: "not authorized" });
  }
  User.findOneAndDelete({ userName: req.body.userName })
    .then((result) => {
      console.log("User deleted Successfully");
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

//login a user
const login = (req, res, next) => {
  //Get username and password
  const userName = req.body.userName;
  const password = req.body.password;
  // Check if user is correct
  User.findOne({ userName: userName, password: password })
    .then((result) => {
      console.log(result);
      if (result == null) {
        res.status(404).json({
          message: "User Not Found",
        });
      } else if (result.isConfirmed == 1) {
        console.log("Your SignUp Request Hasn't Been Reviewed Yet");
        res.status(200).json({
          message: "Your SignUp Request Hasn't Been Reviewed Yet",
        });
      } else if (result.isConfirmed == -1) {
        User.deleteOne({ userName: userName })
          .then(() => {
            console.log("Your SignUp Request Has Been Declined");
            res.status(200).json({
              message: "Your SignUp Request Has Been Declined",
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ err, message: "Error Declining Request" });
          });
      } else {
        //Give the user the token
        console.log(result);
        const user = { result };
        console.log(user);
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        //return user data and access token
        res.status(200).json({
          message: "Login Successful",
          result,
          accessToken: accessToken,
        });
      }
    })
    .catch((err) => console.log(err));
};
const forgotPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const confrimPassword = req.body.confirmPassword;
  if (newPassword === confrimPassword) {
    const filter = { userName: req.body.userName };
    const update = { password: newPassword };
    User.findOneAndUpdate(filter, update)
      .then((result) => {
        if (result.password === newPassword) {
          console.log("You Should Write a New Password");
          res.status(500).json({ message: "You Should Write a New Password" });
        } else {
          console.log("User Password Updated Successfully");
          res
            .status(200)
            .json({ message: "User Password Updated Successfully" });
        }
      })
      .catch((err) => {
        console.log("Password Update Unsuccessful!!");
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  } else {
    console.log("Password Mismatch");
    res.status(500).json({ message: "Password Mismatch" });
  }
};

//Change Password from Profile Page
const changePassword = (req, res, next) => {
  const oldPassword = req.body.password;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  if (newPassword === confirmPassword) {
    console.log(req.USER.result.userName);
    const filter = { userName: req.USER.result.userName };
    const update = { password: newPassword };
    User.findOneAndUpdate(filter, update)
      .then((result) => {
        if (oldPassword === newPassword) {
          console.log("You Should Write a New Password");
          res.status(500).json({ message: "You Should Write a New Password" });
        } else {
          console.log("User Password Changed Successfully");
          res
            .status(200)
            .json({ message: "User Password Changed Successfully" });
        }
      })
      .catch((err) => {
        console.log("Password Update Unsuccessful!!");
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  } else {
    console.log("Password Mismatch");
    res.status(500).json({ message: "Password Mismatch" });
  }
};
//Checking All SignUp requests
const getAllRequests = (req, res, next) => {
  if (req.USER.result.role !== "Admin") {
    return res.status(403).json({ error: "not authorized" });
  }
  // Query for users who are managers
  const managersPromise = User.find({ role: "Manager", isConfirmed: 0 });
  // Query for users who have isConfirmed = 1 (Just Signed Up)
  const confirmedUsersPromise = User.find({ isConfirmed: 1 });
  Promise.all([managersPromise, confirmedUsersPromise])
    .then(([managers, nonConfirmedUsers]) => {
      res.status(200).json({
        managers,
        nonConfirmedUsers,
      });
    })
    .catch((err) => {
      console.log("Couldn't get users");
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

//Logout Functionality
const tokenBlacklist = new Set();
const logout = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  console.log(token);
  // Ideally, you would store this in a persistent datastore.
  tokenBlacklist.add(token);

  res.status(200).json({ message: "Logged out successfully" });
};

//Handle Request
const handleRequest = (req, res, next) => {
  const message = req.body.message;
  const username = req.body.userName;
  console.log(req.body.message);
  if (message === "accept") {
    const filter = { userName: username };
    const update = { isConfirmed: 0 };
    User.findOneAndUpdate(filter, update)
      .then((user) => {
        console.log(user.isConfirmed);
        console.log("SignUp Request Accepted Successfully");
        res
          .status(200)
          .json({ message: "SignUp Request Accepted Successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err, message: "Error Accepting Request" });
      });
  } else if (message === "decline") {
    const filter = { userName: username };
    const update = { isConfirmed: -1 };
    User.findOneAndUpdate(filter, update)
      .then((user) => {
        console.log(user.isConfirmed);
        console.log("SignUp Request Declined Successfully");
        res
          .status(200)
          .json({ message: "SignUp Request Declined Successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err, message: "Error Declining Request" });
      });
  } else {
    const filter = { userName: username };
    User.deleteOne(filter)
      .then((result) => {
        if (result.deletedCount === 0) {
          console.log("No manager account found with the given username.");
          res.status(404).json({ message: "Manager Account Not Found" });
        } else {
          console.log("Manager Account Removed Successfully");
          res
            .status(200)
            .json({ message: "Manager Account Removed Successfully" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err, message: "Error Removing Manager" });
      });
  }
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  promoteUser,
  demoteUser,
  promoteToAdmin,
  updateUser,
  deleteUser,
  login,
  logout,
  authenticateToken,
  forgotPassword,
  changePassword,
  getAllRequests,
  handleRequest,
};
