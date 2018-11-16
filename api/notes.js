const express = require('express');
const Joi = require('joi');

const db = require('../db/connection');
const notes = db.get('notes');

// Validation Schema
const schema = Joi.object().keys({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),
  body: Joi.string()
    .trim()
    .required()
});

const router = express.Router();

// GET api/v1/notes
router.get('/', (req, res) => {
  notes.find({
    user_id: req.user._id
  }).then(notes => {
    res.json(notes)
  })
});
// POST api/v1/notes
router.post('/', (req, res, next) => {
  // validate note
  const result = Joi.validate(req.body, schema)
  if(result.error === null){
    // insert note into DB
    const note = {
      ...req.body,
      user_id: req.user._id
    }
    notes.insert(note).then(insertedNote => {
      res.json(insertedNote)
    })
  } else {
    const error = new Error(result.error)
    res.status(422)
    next(error)
  }
});

module.exports = {
  router
};
