require("dotenv").config();
const { Strategy } = require("passport-facebook");
const User = require("../model/user");

const facebookStrategy = new Strategy(
  {
    clientID: process.env["FACEBOOK_CONSUMER_KEY"],
    clientSecret: process.env["FACEBOOK_CONSUMER_SECRET"],
    callbackURL: "http://127.0.0.1:3000/auth/facebook/callback",
  },
  async function (token, secretToken, profile, cb) {
    let user = await User.findOne({
      OAuth: { id: profile.id, provider: "Facebook" },
    });
    if (!user) {
      user = await new User({
        name: profile.displayName,
        photo: { URL: profile.photos[0].value, local: false },
        OAuth: { id: profile.id, provider: "Facebook" },
      }).save();
    }

    return cb(null, user);
  }
);

module.exports = facebookStrategy;
