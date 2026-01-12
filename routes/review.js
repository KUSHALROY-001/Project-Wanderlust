const express = require("express");
const router = express.Router({ mergeParams: true }); // { mergeParams : true } To access :id from parent route
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewOwner,
} = require("../middleware.js");

// ========== Review Route =========
// Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    listing.reviews.push(review);
    console.log(review);

    await review.save();
    await listing.save();

    console.log("Review Saved & Listing Updated");
    req.flash("success", "Successfully Created a new Review!");
    res.redirect(`/listings/${req.params.id}`);
  })
);
// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log("Review Deleted");
    req.flash("success", "Successfully Deleted the Review!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
