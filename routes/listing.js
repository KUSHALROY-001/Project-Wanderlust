const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// All Listing Route
router.get("/", wrapAsync(listingController.homePage));

// New Route
router.get("/new", isLoggedIn, listingController.getNewListing);

router.post(
  "/new",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.postNewListing)
);

// Show route
router.get("/:id", wrapAsync(listingController.showListing));

// Edit Route
router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

router.put(
  "/edit/:id",
  isLoggedIn, //Checking for logged in this route(similiar) to avoid third party request as like from "hoppscotch"
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete(
  "/delete/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
