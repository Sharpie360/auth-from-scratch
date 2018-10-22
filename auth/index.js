const express = require('express')
const router = express.Router()
const Joi = require('joi')


const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});



// any route in here is pre-pended with /auth

router.get('/', (req, res) => {
  res.json({
    message: 'lock with a key emoji'
  })
})

// POST/auth/signup

router.post('/signup', (req, res) => {
  console.log('body', req.body)
  const result = Joi.validate(req.body, schema)
  res.json(result)
})


module.exports = router