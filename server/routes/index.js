// const express = require('')
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const models = require('../models');

// const router = express.Router();

const express = require("express");
const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.render("error", {
    title: "Home",
    message: "Welcome to Warranty Tracker ✅",
  });
});



module.exports = router;
