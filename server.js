/*
    User story: I can register a new account
    User story: I can log in
    User story: I can log in or register with at least one of the following services: Google, Facebook, Twitter or Github
    User story: I can sign out
    User story: I can see my profile details
    User story: I can edit my details including: photo, name, bio, phone, email and password
    User story: I can upload a new photo or provide an image URL
    
    */
"use strict";

// Twitter API keys as environment variables
require("dotenv").config();

const passport = require("passport");
const { Strategy } = require("passport-twitter");
const express = require("express");

const path = require("path");

const User = require("./model/user");
const mongoose = require("mongoose");

const database = "mongodb://127.0.0.1:27017/Authentication-app";

mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// mongo-connect
const MongoStore = require("connect-mongo");

const app = express();
const port = process.env.PORT || 3000;
const staticFiles = path.join(__dirname, "./public");
app.use(express.static(staticFiles));

//
passport.use(
  new Strategy(
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

      return cb(null, user._id);
    }
  )
);

// Serialize
passport.serializeUser(function (user, cb) {
  // access to user info
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  console.log(obj);
  // obj is user passed in cb, retrived from serializeUser
  cb(null, obj);
});

// app.use(require("morgan")("combined"));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: "auto", maxAge: 1000 * 60 * 60 * 24 }, //need to be a https to be true, else throws an error
    store: MongoStore.create({
      mongoUrl: database,
      collection: "sessions",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  console.log("esta a sair ", req.user);
  res.send("<h1>Logged in</h1>");
});

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get("/login", (req, res) => {
  res.send("<h1>Login</h1>");
});

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) console.log("FODEU GERAU");
    req.logout();
    res.clearCookie("connect.sid", { path: "/" });
    res.redirect("/");
  });
});

app.listen(port, () => console.log("Server running on port %s", port));
