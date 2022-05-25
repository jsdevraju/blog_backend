// import all lib
const {
  register,
  login,
  logout,
  updateProfile,
  updatePassword,
  sendResetCode,
  verifyCode,
  changePassword,
  singleUser,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

// import all lib
const router = require("express").Router();

// Api End Point
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update/profile", isAuthenticatedUser, updateProfile);
router.get("/user/details", isAuthenticatedUser, singleUser);
router.put("/update/password", isAuthenticatedUser, updatePassword);
router.post('/reset-password', sendResetCode);
router.post('/verify-code', verifyCode);
router.patch('/change-password', changePassword)

// exports router
module.exports = router;
