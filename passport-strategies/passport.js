const passport = require("passport");

const facebookStrategy = require("./facebook");
const twitterStrategy = require("./twitter");
const googleStrategy = require("./google");
const githubStrategy = require("./github");
const localStrategy = require("./local");

// Strategies
passport.use(facebookStrategy);
passport.use(twitterStrategy);
passport.use(googleStrategy);
passport.use(githubStrategy);
passport.use(localStrategy);

// Serialize
passport.serializeUser(function (user, cb) {
  // access to user info
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  // obj is user passed in cb, retrived from serializeUser
  cb(null, obj);
});

module.exports = passport;
