const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Signup Route
router
  .route("/signup")
  .get(userController.getSignUpForm)
  .post(wrapAsync(userController.signUp));

// Login Route
router
  .route("/login")
  .get(userController.getLogInForm)
  .post(
    redirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    wrapAsync(userController.logIn)
  );

// Logout Route
router.get("/logout", userController.logOut);
module.exports = router;
