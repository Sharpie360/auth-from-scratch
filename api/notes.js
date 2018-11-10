const express = require("express");

const router = express.Router();

// GET api/v1/notes
router.get('/', (req, res) => {
  res.json([])
})



module.exports = {
  router
}