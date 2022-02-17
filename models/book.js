const mongoose = require("mongoose");

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
  coverImg: {
    type: Buffer,
    required: true,
  },
  coverImgType: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

//? Here we take the decoded coverImg data and make it a useable path to ACTUALLY display the cover. First we make sure that the coverImg/coverImgType are valid properties. Then we set it after the data: tag.Since the coverImg property stores the img as a string. This makes it possible to embed the image directly in the HTML document. We frist specify the type then the format that the data is encoded in to. This makes it so that the browser wont have to actually send a requiest to the server and fetch the mg file like normal it can actually decode the string to the img in the actual HTML file itself
bookSchema.virtual("coverImgPath").get(function () {
  if (this.coverImg != null && this.coverImgType != null) {
    return `data:${
      this.coverImgType
    };charset=utf-8;base64,${this.coverImg.toString("base64")}`;
  }
});

//? Here we are EXPORTING the model with the table's name being "Author" and then pass in the authorSchema which defines the table. Since we are exporting this schema we can use it to CREATE new author through out our app
module.exports = mongoose.model("Book", bookSchema);
