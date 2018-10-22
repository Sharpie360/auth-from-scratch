const express = require('express')

const router = express.Router()

// any route in here is pre-pended with /auth

router.get('/', (req, res) => {
  res.json({
    message: 'lock with a key emoji'
  })
})

// POST/auth/signup

router.post('/signup', (req, res) => {
  console.log('body', req.body)

  res.json({
    message: 'You have signed up'
  })
})


module.exports = router