const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
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
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  console.log("Review Deleted");
  req.flash("success", "Successfully Deleted the Review!");
  res.redirect(`/listings/${id}`);
};
