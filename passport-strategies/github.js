require("dotenv").config();
const { Strategy } = require("passport-github2");
const User = require("../model/user");

const githubStrategy = new Strategy(
  {
    clientID: process.env["GITHUB_CONSUMER_KEY"],
    clientSecret: process.env["GITHUB_CONSUMER_SECRET"],
    callbackURL: "http://127.0.0.1:3000/auth/github/callback",
  },
  async function (token, secretToken, profile, cb) {
    let user = await User.findOne({
      OAuth: { id: profile.id, provider: "Github" },
    });
    if (!user) {
      user = await new User({
        name: profile.displayName,
        photo: { URL: profile.photos[0].value, local: false },
        OAuth: { id: profile.id, provider: "Github" },
      }).save();
    }

    return cb(null, user);
  }
);

module.exports = githubStrategy;