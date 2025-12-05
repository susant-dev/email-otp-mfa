const mongoose = require("mongoose");
const { encodePassword } = require("../../shared/password-utils");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    address: String,
    roles: { type: String, enum: ["customer", "admin"], default: "customer" },
    createdAt: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = encodePassword(this.password);
  next();
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
