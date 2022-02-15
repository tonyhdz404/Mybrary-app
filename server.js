//* First we check if we are in our DEVELOPMENT ENVIRONMENT or PRODUCTION ENVIRONMENT
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

//?We use these built in express middlewares in order for us to be able to read the “body” of an incoming JSON object allow us to get access to the req body and all the data/variables in the request body
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: false }));

//? We import the file here and set it to be the indexRouter because this router deals ONLY with requests to the main page '/'
const indexRouter = require("./routes/index");

//? Creating a router for the author views
const authorRouter = require("./routes/author");

//? Here we specify what view engine we are using. A view engine allows us to insert javascript from our server INTO an HTML file. AKA The view engine is responsible for creating HTML from your views by replaces variables in a template file with actual values
app.set("view engine", "ejs");

//? Here we specify WHERE we want are views to come from. Which will be in a Views folder
app.set("views", __dirname + "/views");

//? Here we specify WHERE we have out layouts. The layouts will be everything that DOES not change
app.set("layout", "layouts/layout");

//? expressLayouts Are just some basic default things we can insert to the front end thing like bootstrap
app.use(expressLayouts);

//? Here we specify WHERE are publice file are things that we dont dynamically change like the stylesheet images and client side JS
app.use(express.static("public"));

//* Importing Mongoose
const mongoose = require("mongoose");
//* 1) Setting up our connenction to our database
//? Because we dont want to HARD code the URL we use an environment variable. Here thanks to the npm package dotenv we have access to out environment variables

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});
//* 2) Checking if we are logged into our database
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

//? Here we specify that all requests to the '/' endpoint will be handled by the indexRouter
app.use("/", indexRouter);

app.use("/authors", authorRouter);

//? Here we set up out server to listen for any request at PORT 3000
app.listen(3000, () => {
  console.log("Server Running on PORT: 3000");
});
