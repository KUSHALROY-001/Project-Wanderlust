const Listing = require("./models/listing");
const CustomError = require("./utils/CustomError.js");
const { ListingSchema } = require("./schema.js");
const { ReviewSchema } = require("./schema.js");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //isAuthenticated() is a passport method
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please log in to create listing");
    return res.redirect("/login");
  }
  next();
};

const redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) res.locals.redirectUrl = req.session.redirectUrl;
  next();
};

const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permision to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

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

module.exports = { isLoggedIn, redirectUrl, isOwner, validateListing, validateReview, };
