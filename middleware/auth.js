// import all lib
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Always is user authentication
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  //Checking user token
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  //Checking User Already Login or not
  if (!token) return next(new ErrorHandler("Please Login to access", 401));
  // verify token
  const decodedData = jwt.verify(token, process.env.PRIVET_KEY);
  // Find User
  req.user = await User.findById(decodedData.id);

  next();
});
