const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // photo, name, bio, phone, email and password
  name: String,
  bio: String,
  phone: Number,
  email: { type: String, unique: true },
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

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.password || user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
