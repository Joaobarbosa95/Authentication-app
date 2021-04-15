const passport = require("../passport-strategies/passport");

const express = require("express");
const auth = express.Router();
// Facebook
auth.get("/facebook", passport.authenticate("facebook"));
auth.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);

// Twitter
auth.get("/twitter", passport.authenticate("twitter"));
auth.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);

// Google
auth.get("/google", passport.authenticate("google", { scope: ["profile"] }));
auth.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);

// Github
auth.get("/github", passport.authenticate("github"));
auth.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);

// Local
auth.post(
  "/local",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);


module.exports = auth;
