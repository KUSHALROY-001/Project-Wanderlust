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
  if (req.session.redirectUrl) 
    res.locals.redirectUrl = req.session.redirectUrl;
  next();
};

module.exports = { isLoggedIn, redirectUrl };
