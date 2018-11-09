// critical requires
const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const webToken = require("jsonwebtoken");
require("dotenv").config();

// db
const db = require("../db/connection");
const users = db.get("users");
users.createIndex("username", { unique: true });

// init Express Router
const router = express.Router();

// Validation Schema
const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9!#$%^&*_-]+$)/)
    .min(3)
    .max(20)
    .required(),
  password: Joi.string()
    .trim()
    .min(6)
    .required()
});

function createTokenSendResponse(user, res, next) {
  // generate JSON webtoken
  const payload = {
    _id: user._id,
    username: user.username
  };
  webToken.sign(
    payload,
    process.env.TOKEN_SECRET,
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        responseError422(res, next);
      } else {
        res.json({
          token
        });
      }
    }
  );
}

// any route in here is pre-pended with /auth

router.get("/", (req, res) => {
  res.json({
    message: "lock with a key emoji"
  });
});

// SIGNUP ROUTE
// POST /auth/signup
router.post("/signup", (req, res, next) => {
  // validate the request body
  const result = Joi.validate(req.body, schema);
  // if NO error, search for existing credentials : user
  if (result.error === null) {
    // monk findOne
    users
      .findOne({
        username: req.body.username
      })
      .then(user => {
        // if user returns null, user does not exist
        // otherwise throw error for duplicate
        if (user) {
          // this user name already exists in db
          const error = new Error(
            "That username is already claimed. Please choose another one."
          );
          res.status(409);
          next(error);
        } else {
          // hash the password
          // insert the user with the hashed password
          bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
            const newUser = {
              username: req.body.username,
              password: hashedPassword
            };
            users.insert(newUser).then(insertedUser => {
              // delete insertedUser.password
              // res.json(insertedUser)
              createTokenSendResponse(insertedUser, res, next);
            });
          });
        }
      });
  } else {
    // throw error from express
    res.status(422);
    next(result.error);
  }
});

function responseError422(res, next) {
  res.status(422);
  const error = new Error("Your entries are not valid!");
  next(error);
}

// LOGIN ROUTE
// POST /auth/login
router.post("/login", (req, res, next) => {
  // validate request body
  const result = Joi.validate(req.body, schema);

  // if no error in validation
  if (result.error === null) {
    users
      .findOne({
        username: req.body.username
      })
      .then(user => {
        if (user) {
          //found the username in the db : user exists
          bcrypt.compare(req.body.password, user.password).then(isCorrect => {
            if (isCorrect) {
              createTokenSendResponse(user, res, next);
            } else {
              responseError422(res, next);
            }
          });
        } else {
          responseError422(res, next);
        }
      });

    // error in validation
  } else {
    responseError422(res, next);
  }
});

module.exports = router;
