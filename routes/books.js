//? Importing our authorSchema to be able to create a NEW author and add it to out table
const Author = require("../models/author");
const Book = require("../models/book");
const express = require("express");
const bookRouter = express.Router();

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

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

//* CREATING Book Route
//? Here is all the logic for creating our new book When we get a POST req to the index page we take all the data in the req.body that we got from filling out the form and create a new book with that data and add it to the book schema
bookRouter.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });

  //* Taking the data from req.body.cover and saving the img and img type to our book object
  saveCover(book, req.body.cover);

  //? Once we have created our new book instance we can now try and save it
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect(`books`);
  } catch (error) {
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

//? When we upload a cover img in our form we DONT send the actual file we send a JSON with the file/photo data and the the file encoded along with it. To actually save the file/phot we first pass in the book object and the encoded data which is saved in req.body.cover. IF there is no uploaded img we do nothing ELSE we use JSON.parse() to convert the JSON to a JS object. The ONLY if the uploaded file is the correct img type and there is a valid JS object created from the JSON.parse(coverEncoded) We SAVE the decoded img as the book.coverImg and SAVE the type to book.coverImgType
function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImg = new Buffer.from(cover.data, "base64");
    book.coverImgType = cover.type;
  }
}

module.exports = bookRouter;
