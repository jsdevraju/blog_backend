// import all lib
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// Define Our Schema
const resetCodeSchema = new mongoose.Schema({
  resetCode: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: { expires: 5000 } },
});
// when user click forgot or resetPassword hashing resetCode
resetCodeSchema.pre("save", async function (next) {
  this.resetCode = await bcrypt.hash(this.resetCode, 12);
  next();
});
//When user put requested new password verify the token
resetCodeSchema.methods.comparetoken = async function (plainCode, bcryptCode) {
  return await bcrypt.compare(plainCode, bcryptCode);
};
// Export Schema
module.exports = mongoose.model("Code", resetCodeSchema);
