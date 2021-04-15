const { Strategy } = require("passport-local");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

const local = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  function (email, password, done) {
    User.findOne({ email: email }, async function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        done(null, false);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }
);

module.exports = local;
