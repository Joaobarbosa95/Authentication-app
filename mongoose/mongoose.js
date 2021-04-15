require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
