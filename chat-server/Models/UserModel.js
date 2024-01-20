const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  profilePicture: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  modifiedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("user", userSchema);
