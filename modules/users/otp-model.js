const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  otp: { type: mongoose.Schema.Types.Number, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 60 * 5 },
});

const OTPModel = mongoose.model("OTPModel", OTPSchema);

module.exports = OTPModel;
