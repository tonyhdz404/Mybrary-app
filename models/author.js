const mongoose = require("mongoose");

//* 1) Creating a table to store all the data / A Schema
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Author", authorSchema);
