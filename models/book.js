const mongoose = require("mongoose");
const path = require("path");
//? This is the path WHERE all our coverImgs will bestored
const coverImgBasePath = "uploads/bookCovers";
//* 1) Creating a table to store all the data / A Schema
//? Here we create a schema/ a table to store our data. In this case we only want ONE column the name of the author
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImgName: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});
//? This creates a virtual property which is just like a normal property BUT it derives its value form the properties above
bookSchema.virtual("coverImgPath").get(function () {
  if (this.coverImgName != null) {
    return path.join("/", coverImgBasePath, this.coverImgName);
  }
});

//? Here we are EXPORTING the model with the table's name being "Author" and then pass in the authorSchema which defines the table. Since we are exporting this schema we can use it to CREATE new author through out our app
module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImgBasePath = coverImgBasePath;
