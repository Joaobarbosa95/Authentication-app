require("dotenv").config();
const { Strategy } = require("passport-twitter");
const User = require("../model/user");

const twitterStrategy = new Strategy(
  {
    consumerKey: process.env["TWITTER_CONSUMER_KEY"],
    consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
  },
  async function (token, secretToken, profile, cb) {
    let user = await User.findOne({
      OAuth: { id: profile.id, provider: "Twitter" },
    });
    if (!user) {
      user = await new User({
        name: profile.displayName,
        photo: { URL: profile.photos[0].value, local: false },
        OAuth: { id: profile.id, provider: "Twitter" },
      }).save();
    }

    return cb(null, user);
  }
);

module.exports = twitterStrategy;
