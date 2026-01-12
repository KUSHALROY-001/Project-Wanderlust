const Listing = require("../models/listing.js");

module.exports.homePage = async (req, res) => {
  Listing.find()
    .then((allListing) => {
      res.render("listing.ejs", { allListing });
    })
    .catch((err) => {
      res.send("Error in Showing All Listings: ", err);
      console.log(err);
    });
};

module.exports.getNewListing = (req, res) => {
  res.render("new.ejs");
};

module.exports.postNewListing = async (req, res, next) => {
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
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      //This proccess is for nested populate
      path: "reviews",
      populate: {
        path: "owner",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  Listing.findById(id).then((listing) => {
    res.render("edit.ejs", { listing });
  });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Successfully Updated the Listing!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
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
};
