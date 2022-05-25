// import all lib
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Blog = require("../models/postSchema");
const User = require("../models/userSchema");
const Comment = require("../models/commentSchema");

// When User Create Any Post Request Call This Function
exports.createBlog = catchAsyncError(async (req, res, next) => {
  // Create Blog
  const blog = await Blog.create(req.body);
  // Response User
  res.status(201).json({
    success: true,
    blog,
  });
});

// When User Request All Blogs Call This Function
exports.getAllBlogs = catchAsyncError(async (req, res, next) => {
  // Query Page And Limit
  const page = parseFloat(req.query.page);
  const limit = parseFloat(req.query.limit);
  const blogCount = await Blog.countDocuments();

  //Checking our start index
  const startIndex = (page - 1) * limit;
  let result;
  //assing value on result variable
  result = await Blog.find().limit(limit).skip(startIndex).exec();
  // Response User
  res.status(200).json({
    result,
    blogCount,
  });
});

// When User Update to Post Request Call This Function
exports.updateBlog = catchAsyncError(async (req, res, next) => {
  //Checking is blog is exits
  let blog = await Blog.findById(req.params.id);
  // Checking user is already logged in
  const userId = req.user.id;
  //checking blog id exits or not
  if (!userId) return next(new ErrorHandler("Please Login to acces", 404));
  if (!blog) return next(new ErrorHandler("Blog Not Found", 404));
  //Checking author of the blog if he posted or others author posted
  const authorBlog = await Blog.findOne({author: userId});
  // if he try to update another person blog return this error
  if(!authorBlog) return next(new ErrorHandler("Your are not author this blog", 404));
  //Update Particular Post
  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useUpdateAndModify: true,
  });
  // Response User
  res.status(200).json({
    success: true,
    blog,
  });
});

// When User Delete Any Post Request Call This Function
exports.deleteBlog = catchAsyncError(async (req, res, next) => {
 //Checking is blog is exits
  const blog = await Blog.findById(req.params.id);
  // Checking user is already logged in
  const userId = req.user.id;
  //checking blog id exits or not
  if (!userId) return next(new ErrorHandler("Please Login to access", 404));
  if (!blog) return next(new ErrorHandler("Blog Not Found", 404));
  //Checking author of the blog if he posted or others author posted
  const authorBlog = await Blog.findOne({author: userId});
  // if he try to delete another person blog return this error
  if(!authorBlog) return next(new ErrorHandler("Your are not author this blog", 404));
//Delete Particular Post
  await blog.remove();
// Response User
  res.status(200).json({
    success: true,
    message: "Blog Delete Successfully",
  });
});

// Adding Like Features
exports.addReact = catchAsyncError(async (req, res, next) => {
  const { postId, userId } = req.params;
  const post = await Blog.findById(postId);
  const user = await User.findById(userId);

  //check if post or user exist. If any of these is undefined throw an error.
  if (!post || !user) return next(new ErrorHandler("Bad request", 404));
  //else push the userid to the post reactedBy user array.
  post?.reactBy?.push(user._id);
  // save document
  await post.save();
  res.status(200).json({
    success: true,
    post,
  });
});

// Delete Like
exports.deleteReact = catchAsyncError(async (req, res, next) => {
  const { postId, userId } = req.params;
  const post = await Blog.findById(postId);
  const user = await User.findById(userId);

 //check if post or user exist. If any of these is undefined throw an error.
 if (!post || !user) return next(new ErrorHandler("Bad request", 404));
 //else push the userid to the post reactedBy user array.
 post?.reactBy?.remove(user._id);
 // save document
 await post.save();
 res.status(200).json({
   success: true,
 });
});

// Add Comment Features
exports.addComment = catchAsyncError(async (req, res, next) => {
  const { postId, userId } = req.params;
  const text = req.body.text;
  let post = await Blog.findById(postId);
  const user = await User.findById(userId);

  //check if post or user exist. If any of these is undefined throw an error.
  if (!post || !user) return next(new ErrorHandler("Bad request", 404));

  const newComment = new Comment({ text: text, author: userId });

  await newComment.save();
  //else push the userid to the post reactedBy user array.
  post?.comments?.push(newComment._id);
  await post.save();

  post = await Blog.findById(postId).populate({
    path: "comments author",
    options: { populate: { path: "author" } },
  });
  // console.log(comment)

  res.status(200).json({
    success: true,
    post,
  });
});

// Delete Comment Features
exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const { postId, userId, commentId } = req.params;
  let post = await Blog.findById(postId);

  //check if post or user exist. If any of these is undefined throw an error.
  if (!post || !userId) return next(new ErrorHandler("Bad request", 404));

  const removeComment = await Comment.findById(commentId);
  //check if post or user exist. If any of these is undefined throw an error.
  if (!removeComment) return next(new ErrorHandler("Bad request", 404));
  //else push the userid to the post reactedBy user array.
  post?.comments?.remove(removeComment);
  await post.save();

  res.status(200).json({
    success: true,
  });
});

// user send blog
exports.userBaseBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.find({ author: req.user.id }).populate(
    "comments author"
  );

  res.status(200).json({
    success: true,
    blog,
  });
});

//Single Details Page
exports.getSingleBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new ErrorHandler("Not Found Blog", 404));

  const blog = await Blog.findById(id).populate({
    path: "comments author",
    options: { populate: { path: "author" } },
  });

  res.status(200).json({
    success: true,
    blog,
  });
});
