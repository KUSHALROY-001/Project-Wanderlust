const Listing = require("./models/listing")

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

module.exports = { isLoggedIn, isOwner, redirectUrl };
