// critical requires
const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcryptjs')

// db
const db = require('../db/connection')
const users = db.get('users')
users.createIndex('username', { unique: true })

// init Express Router
const router = express.Router()

// Validation Schema
const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(3).max(30).required(),
  password: Joi.string().min(10).required()
});



// any route in here is pre-pended with /auth

router.get('/', (req, res) => {
  res.json({
    message: 'lock with a key emoji'
  })
})

// POST/auth/signup

router.post('/signup', (req, res, next) => {
  console.log('body', req.body)
  // validate the request body
  const result = Joi.validate(req.body, schema)
  // if NO error, search for existing credentials : user
  if(result.error === null){
    // monk findOne
    users.findOne({
      username: req.body.username
    }).then(user => {
      // if user returns null, user does not exist
      // otherwise throw error for duplicate
      if(user){
        // this user name already exists in db
        const error = new Error('That username is already claimed. Please choose another one.')
        next(error)
      } else {
        // hash the password
        // insert the user witht he hashed password

      }
      res.json({ user })
    })
  } else {
    // throw error from express
    next(result.error)
  }
})


module.exports = router