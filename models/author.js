const mongoose = require("mongoose");

//* 1) Creating a table to store all the data / A Schema
//? Here we create a schema/ a table to store our data. In this case we only want ONE column the name of the author
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//? Here we are EXPORTING the model with the table's name being "Author" and then pass in the authorSchema which defines the table. Since we are exporting this schema we can use it to CREATE new author through out our app
module.exports = mongoose.model("Author", authorSchema);
