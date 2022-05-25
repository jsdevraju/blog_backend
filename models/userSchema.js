// import all lib
const mongoose = require("mongoose");
// Define Our Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, `Username can't be blank`],
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, `Email can't be blank`],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, `Email can't be blank`],
  },
  avatar: {
      type:String,
      default:'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  },
  about: {
    type: String,
    trim: true,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
// Export Schema
module.exports = mongoose.model("Users", userSchema);
