const express = require("express");
const router = express.Router({ mergeParams: true }); // { mergeParams : true } To access :id from parent route
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/review.js");

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
  wrapAsync(reviewController.createReview)
);
// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
