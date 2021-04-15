const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: "auto", maxAge: 1000 * 60 * 60 * 24 },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_DATABASE,
    collection: "sessions",
  }),
});
