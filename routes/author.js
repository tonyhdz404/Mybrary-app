const express = require("express");
const authorRouter = express.Router();
//* ALL Authors Route
authorRouter.get("/", (req, res) => {
  res.render("authors/index");
});

//* NEW Author Route
authorRouter.get("/new", (req, res) => {
  res.render("authors/new");
});

//* CREATING Author Route
authorRouter.post("/", (req, res) => {
  res.send("Create!!");
});
module.exports = authorRouter;
