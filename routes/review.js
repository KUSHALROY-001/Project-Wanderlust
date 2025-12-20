const express = require('express');
const router = express.Router({ mergeParams : true }); // { mergeParams : true } To access :id from parent route
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const CustomError = require("../utils/CustomError.js");
const { ReviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => {
  let { error } = ReviewSchema.validate(req.body.review);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new CustomError(400, msg);
  } else {
    next();
  }
};
// ========== Review Route =========
// Create Review
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    console.log(req.body.review);
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);

    listing.reviews.push(review);

    await review.save();
    await listing.save();

    console.log("Review Saved & Listing Updated");
    res.redirect(`/listings/${req.params.id}`);
  })
);
// Delete Review
router.delete(
  "/:reviewId", 
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log("Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;