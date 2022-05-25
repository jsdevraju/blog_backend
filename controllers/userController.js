// import all lib
const User = require("../models/userSchema");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { nanoid } = require("nanoid");
const Code = require("../models/resetSchema");

//Register
exports.register = catchAsyncError(async (req, res, next) => {
  const salt = bcrypt.genSaltSync(Number(process.env.SALT));
  const hashingPassword = bcrypt.hashSync(req.body.password, salt);

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashingPassword,
  });

  res.status(201).json({
    success: true,
    user,
  });
});

// Login
exports.login = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // Checking User Exits OR Not
  if (!user) return next(new ErrorHandler("Invalid Credential", 400));

  const isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);
  // Checking Password Match OR Not
  if (!isPasswordMatch)
    return next(new ErrorHandler("Invalid Credential", 400));
  // Generate a token
  const token = jwt.sign({ id: user._id }, process.env.PRIVET_KEY, {
    expiresIn: "1d",
  });

  const { password, ...userInfo } = user._doc;

  res
    .cookie("token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      userInfo,
      token,
    });
});

//Logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      token: null,
      userInfo: null,
      message: "Logged Our Successfully",
    });
});

// Update Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const isPasswordMatch = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  // Checking Password Match Or not
  if (!isPasswordMatch)
    return next(new ErrorHandler("Old Password is incorrect", 400));
  // Check Password And Old Password match or not
  if (req.body.oldPassword === req.body.newPassword)
    return next(
      new ErrorHandler("Old Password can't match with new password", 400)
    );
  const salt = bcrypt.genSaltSync(Number(process.env.SALT));
  const hashingPassword = bcrypt.hashSync(req.body.newPassword, salt);

  user.password = hashingPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated",
  });
});

// Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  const { password, ...userInfo } = user._doc;

  res.status(200).json({
    success: true,
    userInfo,
    message: "Profile Updated",
  });
});

//Send a reset code when user click forgot password
exports.sendResetCode = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  //Generate a Random Code
  const resetCode = nanoid(6).toUpperCase();

  const user = await User.findOne({ email });
  // Check user exits or not
  if (!user) {
    return next(new ErrorHandler("Credentials does not exist.", 404));
  } else {
    //send email
    sgMail.setApiKey(process.env.SENDGRID_SECRET_KEY);
    const msg = {
      to: email, // Change to your recipient
      from: process.env.GMAIL_ID, // Change to your verified sender
      subject: "Password reset code",
      text: "Do not share your password reset code with anyone.",
      html: `<h1> Do not share your password reset code with anyone.</h1>
          <br>
          <center> <strong>${resetCode}</strong> </center/>
          `,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    const existingCode = await Code.findOne({ email }).select(
      "-__v -createdAt -updatedAt"
    );
    if (existingCode) {
      await Code.deleteOne({ email });
      const saveCode = await new Code({ resetCode, email });
      await saveCode.save();
    } else {
      const saveCode = await new Code({ resetCode, email });
      await saveCode.save();
    }
    res.json("Email sent!");
  }
});

//Verify Code
exports.verifyCode = catchAsyncError(async (req, res, next) => {
  const { email, resetCode } = req.body;

  const code = await Code.findOne({ email });

  if (!code && code?.length === 0) {
    return next(
      new ErrorHandler("Invalid or expired reset code, Please try again.", 400)
    );
  } else if (await code.comparetoken(resetCode, code.resetCode)) {
    code.isVerified = true;
    await code.save();
    res.json({ message: "Change the password now." });
  } else {
    return next(
      new ErrorHandler("Invalid or expired reset code, Please try again.", 400)
    );
  }
});

//Change Password
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const verifyCode = await Code.findOne({ email });

  if (!verifyCode || !verifyCode.isVerified) {
    return next(
      new ErrorHandler("Invalid or expired reset code, Please try again.", 400)
    );
  } else {
    const updatePass = await User.findOne({ email });

    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    const hashingPassword = bcrypt.hashSync(password, salt);

    updatePass.password = hashingPassword;

    await updatePass.save();

    await Code.deleteOne({ id: verifyCode._id });
    res.json({
      message: "Password Change Success. Please return and login again",
    });
  }
});

//Single User
exports.singleUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  if(!user) return next(new ErrorHandler("Bad Request", 400));

  res.status(200).json({
    success: true,
    user,
  });
});
