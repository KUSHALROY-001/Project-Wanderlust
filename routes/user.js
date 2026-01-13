const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Signup Route
router.get("/signup", userController.getSignUpForm);

router.post("/signup", wrapAsync(userController.signUp));

// Login Route
router.get("/login", userController.getLogInForm);

router.post(
  "/login",
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
