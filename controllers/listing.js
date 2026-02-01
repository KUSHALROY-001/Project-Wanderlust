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
  const url = req.file.url; // Cloudinary returns the full URL in 'url'
  const filename = req.file.public_id; // Cloudinary returns the public ID in 'filename'
  req.body.listing.image = { url, filename };
  const newListing = req.body.listing;
  newListing.owner = req.user._id;

  const location = req.body.listing.location;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`,
  );

  const data = await response.json();

  if (!data.length) {
    return res.send("Location not found");
  }

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);

  newListing.geometry = {
    type: "Point",
    coordinates: [lng, lat],
  };
  const listing = new Listing(newListing);

  let theListing = await listing.save();
  console.log(theListing);
  req.flash("success", "Successfully Created a New Listing!");
  res.redirect(`/listings/${listing._id}`);
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
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    const url = req.file.url;
    const filename = req.file.public_id;
    const image = { url, filename };
    listing.image = image;
    await listing.save();
  }
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
