//? To Keep everything neat we split up EACH route to a different file
const express = require("express");

//? After requireing express we create the router variable this is almost the same as the app vaibale we made in our server.js but this one will only handle request at a specific route. So like all user request or all book requests
const router = express.Router();

router.get("/", (req, res) => {
  //? This how we render or ejs files this will render the index.ejs file
  res.render("index");
});

//? Exporting our router to be used by the server.js
module.exports = router;
