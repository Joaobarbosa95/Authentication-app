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

const path = require("path");

// database
require("./mongoose/mongoose");

// passport
const passport = require("./passport-strategies/passport");
// express
const express = require("express");
const expressSession = require("./express-session");

// authentication middleware
const authRoutes = require("./routes/auth");
const { authentication, hasOpenSession } = require("./auth/auth");

const port = process.env.PORT || 3000;

// express config
const app = express();
const staticFiles = path.join(__dirname, "./public");
app.use(express.static(staticFiles));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("morgan")("combined"));

app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

// user model
const User = require("./model/user");

// Views engine
const hbs = require("express-hbs");
const auth = require("./auth/auth");
app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views/partials",
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//---------------------------------------------
app.get("/", hasOpenSession, (req, res) => {
  res.render("main");
});

app.use("/auth", authRoutes);

app.get("/dashboard", authentication, (req, res) => {
  User.findOne({});
  console.log(req.user);
  res.render("dashboard", {
    name: req.user.name,
    photo: req.user.photo,
    bio: req.user.bio,
    phone: req.user.phone,
    email: req.user.email,
  });
});

app.get("/login", hasOpenSession, (req, res) => {
  res.render("login");
});

app.get("/logout", authentication, function (req, res) {
  console.log(req.session);
  req.session.destroy(function (err) {
    if (err) console.log("FODEU GERAU");
    req.logout();
    res.clearCookie("connect.sid", { path: "/" });
    res.redirect("/login");
  });
});

app.post(
  "/register",
  function (req, res, next) {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        next();
      } else {
        res.redirect("/login");
      }
    });
  },
  async (req, res) => {
    let user = new User({ email: req.body.email, password: req.body.password });
    await user.save();
  }
);

app.get("register", (req, res) => {});
app.listen(port, () => console.log("Server running on port %s", port));
