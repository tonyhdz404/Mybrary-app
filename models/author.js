const mongoose = require("mongoose");
const Book = require(`./book`);
//* 1) Creating a table to store all the data / A Schema
//? Here we create a schema/ a table to store our data. In this case we only want ONE column the name of the author
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//? We don't want to DELETE an author that has books linked to them. To check and prevent this from happening we call the .pre() which will run a callback fucntion before what ever action we specify in this case the callback will FIND any books with the matching author id and IF there are books linked to that author.id we send an error and stop the DELETE process
authorSchema.pre("remove", function (next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error("This author has books still!"));
    } else {
      next();
    }
  });
});

//? Here we are EXPORTING the model with the table's name being "Author" and then pass in the authorSchema which defines the table. Since we are exporting this schema we can use it to CREATE new author through out our app
module.exports = mongoose.model("Author", authorSchema);
