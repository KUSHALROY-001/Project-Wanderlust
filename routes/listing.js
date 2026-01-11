const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// All Listing Route
router.get(
  "/",
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

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

router.post(
  "/new",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    console.log(req.body.listing);
    const newListing = req.body.listing;
    newListing.owner = req.user._id;
    Listing.create(newListing)
      .then((result) => {
        console.log(result);
        req.flash("success", "Successfully Created a new Listing!");
        res.redirect("/listings");
      })
      .catch((err) => {
        next(new CustomError(400, "Invalid Listing Data"));
      });
  })
);

// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("show.ejs", { listing });
  })
);

// Edit Route
router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    Listing.findById(id).then((listing) => {
      res.render("edit.ejs", { listing });
    });
  })
);

router.put(
  "/edit/:id",
  isLoggedIn, //Checking for logged in this route(similiar) to avoid third party request as like from "hoppscotch"
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Successfully Updated the Listing!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/delete/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    Listing.findByIdAndDelete(id)
      .then((result) => {
        console.log(result);
        req.flash("success", "Successfully Deleted the Listing!");
        res.redirect("/listings");
      })
      .catch((err) => {
        res.send("Error in Deletion");
        console.log(err);
      });
  })
);

module.exports = router;
