const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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

// All Listing Route
app.get("/listings", (req, res) => {
  Listing.find()
    .then((allListing) => {
      res.render("listing.ejs", { allListing });
    })
    .catch((err) => {
      res.send("Error in Showing All Listings: ", err);
      console.log(err);
    });
});

// Show route
app.get("/listing/:id", (req, res) => {
  let { id } = req.params;
  Listing.findById(id)
    .then((listing) => {
      res.render("show.ejs", { listing });
    })
    .catch((err) => {
      res.send("Error in Show Individual Listing : ", err);
    });
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/listing/new", (req, res) => {
  // let { title, description, image, price, location, country } = req.body;
  // let data = {
  //   title: title,
  //   description: description,
  //   image: image,
  //   price: price,
  //   location: location,
  //   country: country,
  // };

  Listing.insertOne(req.body.listing)
    .then((result) => {
      console.log(result);
      res.redirect("/listings");
    })
    .catch((err) => {
      res.send(
        "Please fill the blanks otherwise no data will be inserted",
        err
      );
      console.log(err);
    });
});

// Edit Route
app.get("/listing/edit/:id", (req, res) => {
  let { id } = req.params;
  Listing.findById(id).then((listing) => {
    res.render("edit.ejs", { listing });
  });
});

app.put("/listing/edit/:id", (req, res) => {
  let { id } = req.params;
  Listing.findByIdAndUpdate(
    id,
    { $set: req.body.listing },
    { runValidators: true },
    { new: true }
  )
    .then((result) => {
      res.redirect(`/listing/${id}`);
    })
    .catch((err) => {
      console.log("error find in updation", err);
    });
});

// Delete Route
app.delete("/listing/delete/:id", (req, res) => {
  let { id } = req.params;
  Listing.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/listings");
    })
    .catch((err) => {
      res.send("Error in Deletion");
      console.log(err);
    });
});

app.listen(8080, () => {
  console.log("server is activate on port 8080");
});
