//? Importing our authorSchema to be able to create a NEW author and add it to out table
const Author = require("../models/author");
const Book = require("../models/book");
const express = require("express");
const bookRouter = express.Router();
const fs = require("fs");
//? By importing multer we can work with files UPLOADED to our form aka. We use multer to get the files name
const multer = require("multer");
const path = require("path");
const req = require("express/lib/request");
const uploadPath = path.join("public", Book.coverImgBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

//* ALL Books Route

bookRouter.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/index", { books: books, searchOptions: req.query });
  } catch (error) {
    res.redirect("/");
  }
});

//* NEW Book Route
//? This endpoint displays a form where we get all the new book data. We First await all the Author data to be loaded then create a new Book Schema instance that we will modify with all the new data from our user when they fill out the from. We then render the books/new page which has the from on it. We pass in the variables of allAuthors and the book instance. IF there is an error we just redirect them to the main book page
bookRouter.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

//* CREATING Author Route
//? Here is all the logic for creating our new book When we get a POST req to the index page we take all the data in the req.body that we got from filling out the form and create a new book with that data and add it to the book schema
bookRouter.post("/", upload.single("cover"), async (req, res) => {
  //? We DONT want to store the img file in our database we JUST want to the corresponding file name that we will use to serve the img
  const fileName = req.file != null ? req.file.filename : null;

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImgName: fileName,
    description: req.body.description,
  });
  //? Once we have created our new book instance we can now try and save it
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect(`books`);
  } catch (error) {
    if (book.coverImgName != null) {
      removeBookCover(book.coverImgName);
    }
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const allAuthors = await Author.find({});
    const params = { allAuthors: allAuthors, book: book };
    if (hasError) params.errorMessage = "Error Creating Book";
    res.render("books/new", params);
  } catch (error) {
    res.redirect("/books");
  }
}
function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (error) => {
    if (error) {
      console.error(error);
    }
  });
}

module.exports = bookRouter;
