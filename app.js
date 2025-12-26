const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const flash = require("connect-flash");
const session = require("express-session");
const CustomError = require("./utils/CustomError.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(session({
  secret : "wanderlustsecret",
  resave : false,
  saveUninitialized : true,
  cookieOptions : {
    httpOnly : true,
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000
  }
}))

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
.then(() => {
  console.log("Connected to MongoDb");
})
.catch((err) => {
  console.log("Unable to connect to Mongodb : ", err);
});

app.get("/", (req, res) => {
  res.send("It is the index Route");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Catch-all for unmatched routes. Use `app.use` instead of `app.all("*", ...)`
// to avoid path-to-regexp parsing errors for bare `*` patterns.
app.use((req, res, next) => {
  next(new CustomError(404, "Page Not Found"));
});
// ========== MiddleWare =========
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  console.log(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is activate on port 8080");
});
