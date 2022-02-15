const express = require("express");
const author = require("../models/author");
const authorRouter = express.Router();

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
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect(`authors`);
  } catch (error) {
    //? IF we get an ERROR we pass back the author and the erroMessage which will be inserted in to the authors/new page
    res.render("authors/new", {
      author: author,
      errorMessage: `Error creating Author: ${author.name}`,
    });
  }
});
module.exports = authorRouter;
