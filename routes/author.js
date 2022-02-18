const express = require("express");
const author = require("../models/author");
const authorRouter = express.Router();
const Book = require("../models/book");

//? Importing our authorSchema to be able to create a NEW author and add it to out table
const Author = require("../models/author");
//* ALL Authors Route
authorRouter.get("/", async (req, res) => {
  let searchOptions = {};
  //? Since a GET req sends info through the query string NOT the body so what ever we passed into the form we get access to in the req.query. IF there is a name property we then create a regex that will try and find the name in our data regardless of caps
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  //? To Display ALL the authors we create a variable that awaits the result of calling an empty find() on the Author model where all our author data is stored.This will create an object of all the Authors in our database/AuthorSchema. IF we do have something in our search options we only search for that
  try {
    const allAuthors = await Author.find(searchOptions);
    res.render("authors/index", {
      allAuthors: allAuthors,
      searchOptions: req.query,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//* NEW Author Route
//? At this route we GET all the info
authorRouter.get("/new", (req, res) => {
  //? Here we pass in the variables that will be accessable in our authors/new.ejs file
  res.render("authors/new", { author: new author() });
});

//* CREATING Author Route
//? At this POST route we actually create the new author. And thanks to the express.urlencoded() we can easily read the req.body
authorRouter.post("/", async (req, res) => {
  //* Creating a New Author with the name we recived
  const author = new Author({
    name: req.body.name,
  });
  //? Here we SAVE the new author object. Inside the save() we have access to an err and the actual newAuthor
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (error) {
    //? IF we get an ERROR we pass back the author and the erroMessage which will be inserted in to the authors/new page
    res.render("authors/new", {
      author: author,
      errorMessage: `Error creating Author: ${author.name}`,
    });
  }
});

//* Showing a Single Author
authorRouter.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const authorsBooks = await Book.find({ author: author.id }).limit(6).exec();

    res.render(`authors/show`, { author: author, books: authorsBooks });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//* EDITING an Author
//? Here we GET the new info for our author. To EDIT and author it is almost the same as creating a new author. First we start by taking the id from the req and finding that author in our database and then pass in that found author object to our edit page to edit
authorRouter.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch (error) {
    res.redirect("/authors");
  }
});

//* UPDATING Author
//? Here we actually save the changes we made to the author to our database. We find that specific author in our database using the id in our URL and .findById(). Then by accessing the edited name property form the req.body we got from the edit form we set the authors name to be that new name and save
authorRouter.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: `Error updating Author: ${author.name}`,
      });
    }
  }
});

//* DELETING Author
authorRouter.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect(`/authors`);
  } catch (error) {
    console.log(error.message);
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});
module.exports = authorRouter;
