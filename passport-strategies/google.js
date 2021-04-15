require("dotenv").config();
const { Strategy } = require("passport-google-oauth20");
const User = require("../model/user");

const googleStrategy = new Strategy(
  {
    clientID: process.env["GOOGLE_CONSUMER_KEY"],
    clientSecret: process.env["GOOGLE_CONSUMER_SECRET"],
    callbackURL: "http://127.0.0.1:3000/auth/google/callback",
  },
  async function (token, secretToken, profile, cb) {
    let user = await User.findOne({
      OAuth: { id: profile.id, provider: "Google" },
    });
    if (!user) {
      user = await new User({
        name: profile.displayName,
        photo: { URL: profile.photos[0].value, local: false },
        OAuth: { id: profile.id, provider: "Google" },
      }).save();
    }

    return cb(null, user);
  }
);

module.exports = googleStrategy;
