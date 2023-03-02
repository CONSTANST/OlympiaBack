const mongoose = require("mongoose");
const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  account: {
    username: {required: true, type: String},
    avatar: Object,
  },
  token: String,
  hash: String,
  salt: String,
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "master"],
  },
});
module.exports = User;
