const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const CustomError = require("./utils/CustomError.js");
const { wrap } = require("module");
const {ListingSchema, ReviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const { link } = require("fs");

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

const validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body.listing);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new CustomError(400, msg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  let { error } = ReviewSchema.validate(req.body.review);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new CustomError(400, msg);
  } else {
    next();
  }
};
// All Listing Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    Listing.find()
      .then((allListing) => {
        res.render("listing.ejs", { allListing });
      })
      .catch((err) => {
        res.send("Error in Showing All Listings: ", err);
        console.log(err);
      });
  })
);

// Show route
app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    Listing.findById(id)
      .then((listing) => {
        res.render("show.ejs", { listing });
      })
      .catch((err) => {
        res.send("Error in Show Individual Listing : ", err);
      });
  })
);

// New Route
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});

app.post(
  "/listing/new",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    // let data = {
    //   title: title,
    //   description: description,
    //   image: image,
    //   price: price,
    //   location: location,
    //   country: country,
    // };
    console.log(req.body.listing);

    Listing.create(req.body.listing)
      .then((result) => {
        console.log(result);
        res.redirect("/listings");
      })
      .catch((err) => {
        next(new CustomError(400, "Invalid Listing Data"));
      });
  })
);

// Edit Route
app.get(
  "/listing/edit/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    Listing.findById(id).then((listing) => {
      res.render("edit.ejs", { listing });
    });
  })
);

app.put(
  "/listing/edit/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    Listing.findByIdAndUpdate(
      id,
      { $set: req.body.listing },
      { new: true, runValidators: true }
    )
      .then((result) => {
        res.redirect(`/listing/${id}`);
      })
      .catch((err) => {
        console.log("error find in updation", err);
      });
  })
);

// Delete Route
app.delete(
  "/listing/delete/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    Listing.findByIdAndDelete(id)
      .then((result) => {
        console.log(result);
        res.redirect("/listings");
      })
      .catch((err) => {
        res.send("Error in Deletion");
        console.log(err);
      });
  })
);

app.post(
  "/listing/:id/review", validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    await review
      .save()
      .then((result) => {
        console.log("Review Saved: ", result);
        listing
          .save()
          .then((result) => {
            console.log("Listing Updated with Review: ", result);
          })
          .catch((err) => {
            console.log("Error in Updating Listing with Review: ", err);
          });
      })
      .catch((err) => {
        console.log("Error in Saving Review: ", err);
      });

    res.redirect(`/listing/${req.params.id}`);
  })
);

// Catch-all for unmatched routes. Use `app.use` instead of `app.all("*", ...)`
// to avoid path-to-regexp parsing errors for bare `*` patterns.
// app.use((req, res, next) => {
//   next(new CustomError(404, "Page Not Found"));
// });
// ========== MiddleWare =========
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  console.log(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is activate on port 8080");
});
