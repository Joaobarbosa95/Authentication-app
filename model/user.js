const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // photo, name, bio, phone, email and password
  name: String,
  bio: String,
  phone: Number,
  email: String,
  password: String,
  photo: {
    URL: String,
    local: Boolean,
  },
  OAuth: {
    id: String,
    provider: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
