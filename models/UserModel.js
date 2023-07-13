const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  friends: {
    type: Array,
    required: true,
  },
  requests: {
    type: Array,
    required: true,
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
