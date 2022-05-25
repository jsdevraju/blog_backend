// import all lib
const mongoose = require("mongoose");

//Define COmment Schema
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    default:''
  },
  author:{
    type:mongoose.Types.ObjectId,
    ref:'Users'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export Schema
module.exports = mongoose.model("Comment", commentSchema);
