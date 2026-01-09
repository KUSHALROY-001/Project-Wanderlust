const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");

// Signup Route
router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.logIn(registeredUser, (err) => {
        //req.logIn is a passport method
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

// Login Route
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Please enter a valid email");
      res.redirect("/login");
    } else {
      req.flash("success", "Welcome back to Wanderlust!");
      res.locals.redirectUrl = res.locals.redirectUrl || "/listings"
      res.redirect(res.locals.redirectUrl);
    }
  })
);

// Logout Route
router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Succussfully logout");
    res.redirect("/listings");
  });
});
module.exports = router;
