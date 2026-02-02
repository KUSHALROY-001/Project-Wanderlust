const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer"); /* We can't directly extract the file from the "multipart/form-data" enctype so we use multer package for that*/
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// All Listing Route
router.get("/", wrapAsync(listingController.homePage));

// New Route
router //Use router.route() to avoid duplicate route naming and thus typing errors.
  .route("/new")
  .get(isLoggedIn, listingController.getNewListing)
  .post(
    isLoggedIn,
    upload.single("listing[image]"), //Middleware to handle the file upload from the form. "listing[image]" is the name attribute in the form input field.
    validateListing,
    wrapAsync(listingController.postNewListing),
  );

// Show route
router.get("/:id", wrapAsync(listingController.showListing));

// Edit Route
router
  .route("/edit/:id")
  .get(isLoggedIn, isOwner, wrapAsync(listingController.editListing))
  .put(
    isLoggedIn, //Checking for logged in this route(similiar) to avoid third party request as like from "hoppscotch"
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing),
  );

// Delete Route
router.delete(
  "/delete/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing),
);

module.exports = router;
