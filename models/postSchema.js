// import all lib
const mongoose = require("mongoose");
// Define Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `title can't be blank`],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, `blog description can't be blank`],
    trim: true,
  },
  category:{
    type: String,
    required: [true, `title can't be blank`],
    trim: true,
  },
  img: {
    type:String,
    default:'https://cdn.pixabay.com/photo/2022/05/18/17/22/leaves-7205773_960_720.jpg'
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  reactBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  ],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
   }],
   createAt:{
       type:Date,
       default:Date.now
   }
});
// export schema
module.exports = mongoose.model("Blog", blogSchema);
