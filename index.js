// @Coding Garden Express App Boilerplate
// Auth from Scratch -> https://www.youtube.com/watch?v=JNAjjHwPFIw
// -----------------------------------------
// RabbitWerks Javascript

const express = require('express')
const volleyball = require('volleyball')
const cors = require('cors')

require('dotenv').config()

const app = express()

const middlewares = require('./auth/middlewares')
const auth = require('./auth/index')
const notes = require('./api/notes')


app.use(volleyball)
app.use(cors({
  origin: ['http://localhost:8080', 'http://192.168.5.135:8080']
}))
app.use(express.json())
app.use(middlewares.checkTokenSetUser)

app.get('/', (req, res) => {
  res.json({
    message: "Hello world from port 7777!",
    user: req.user
  })
})

app.use('/auth', auth)
// app.use('/api/v1/notes', middlewares.isLoggedIn, notes)

function notFound(req, res, next) {
  res.status(404)
  const error = new Error('Not Found - ' + req.originalUrl)
  next(error)
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500)
  res.json({
    message: err.message,
    stack: err.stack
  })
}

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 7777
app.listen(port, () => {
  console.log(`Now listening on port ${port}`)
})