const { Router } = require("express");
const registerRules = require("./middlewares/register-rules");
const loginRules = require("./middlewares/login-rules");

const UserModel = require("./users-model");
const { matchPassword } = require("../../shared/password-utils");
const { encodeToken } = require("../../shared/jwt-utils");
const authorize = require("../../shared/middlewares/authorize");
const verifyLoginRules = require("./middlewares/verify-login-rules");
const OTPModel = require("./otp-model");
const { randomNumberOfNDigits } = require("../../shared/compute-utils");
const sendEmail = require("../../shared/email-utils");

const usersRoute = Router();

/**
 * Login Route
 */
usersRoute.post("/users/login", loginRules, async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (!foundUser) {
    return res.status(404).send({
      errorMessage: `User with ${email} doesn't exist`,
    });
  }
  const passwordMatched = matchPassword(password, foundUser.password);
  if (!passwordMatched) {
    return res.status(401).send({
      errorMessage: `Email and password didn't matched`,
    });
  }
  // generate random 6 digit otp
  const otp = randomNumberOfNDigits(6);
  await OTPModel.create({ account: foundUser._id, otp });
  await sendEmail(email, `OTP to login`, `You otp is ${otp}`);
  res.json({ message: `OTP sent in your email` });
});

/**
 * Verify Login Route
 */
usersRoute.post("/users/verify-login", verifyLoginRules, async (req, res) => {
  const { email, otp } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (!foundUser) {
    return res.status(404).send({
      errorMessage: `User with ${email} doesn't exist`,
    });
  }
  const foundOTP = await OTPModel.findOne({ account: foundUser._id, otp });
  if (!foundOTP)
    res.status(401).send({ errorMessage: "OTP code didn't matched" });
  const user = { ...foundUser.toJSON(), password: undefined };
  // generate access token
  const token = encodeToken(user);
  res.json({ user, token });
});

/**
 * Register Route
 */
usersRoute.post("/users/register", registerRules, async (req, res) => {
  const newUser = req.body;
  const existingUser = await UserModel.findOne({
    email: newUser.email,
  });
  if (existingUser) {
    return res.status(500).json({
      errorMessage: `User with ${newUser.email} already exist`,
    });
  }
  const addedUser = await UserModel.create(newUser);
  if (!addedUser) {
    return res.status(500).send({
      errorMessage: `Oops! User couldn't be added!`,
    });
  }
  const user = { ...addedUser.toJSON(), password: undefined };
  res.json(user);
});

/**
 * Get all users Route
 */
usersRoute.get("/users", authorize(["admin"]), async (req, res) => {
  const allUsers = await UserModel.find().select("-password");
  if (!allUsers) res.send([]);
  res.json(allUsers);
});

/**
 * Get user by id Route
 */
usersRoute.get(
  "/users/:id",
  authorize(["admin", "customer"]),
  async (req, res) => {
    const userID = req.params.id;
    const isAdmin = req.account.roles.includes("admin");
    // If not admin, don't allow to access others account
    if (!isAdmin && userID !== req.account._id) {
      return res.status(401).json({
        errorMessage: "You don't have permission to access this account",
      });
    }
    const foundUser = await UserModel.findById(userID);
    if (!foundUser) {
      return res
        .status(404)
        .send({ errorMessage: `User with ${userID} doesn't exist` });
    }
    res.json(foundUser);
  }
);

/**
 * Update user Route
 */
usersRoute.put("/users/:id", async (req, res) => {
  const userID = req.params.id;
  // If not admin, don't allow to update others account
  if (!isAdmin && userID !== req.account._id) {
    return res.status(401).json({
      errorMessage: "You don't have permission to update this account",
    });
  }
  const newUser = req.body;
  if (!newUser) {
    return res.status(421).json({ errorMessage: "Nothing to update" });
  }
  // Only allow admin to change the roles
  if (!isAdmin && newUser.roles) {
    return res.status(401).json({
      errorMessage:
        "You don't have permission to update your role. Please contact the support team for the assistance!",
    });
  }
  const foundUser = await UserModel.findById(userID);
  if (!foundUser) {
    return res
      .status(404)
      .send({ errorMessage: `User with ${userID} doesn't exist` });
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    userID,
    {
      $set: newUser,
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res
      .status(500)
      .send({ errorMessage: `Oops! User couldn't be updated!` });
  }
  res.json(updatedUser);
});

/**
 * Delete user Route
 */
usersRoute.delete("/users/:id", async (req, res) => {
  const userID = req.params.id;
  // If not admin, don't allow to delete others account
  if (!isAdmin && userID !== req.account._id) {
    return res.status(401).json({
      errorMessage: "You don't have permission to update this account",
    });
  }
  const foundUser = await UserModel.findById(userID);
  if (!foundUser) {
    return res
      .status(404)
      .send({ errorMessage: `User with ${userID} doesn't exist` });
  }
  const deletedUser = await UserModel.findByIdAndDelete(userID).select(
    "-password"
  );
  if (!deletedUser) {
    return res
      .status(500)
      .send({ errorMessage: `Oops! User couldn't be deleted!` });
  }
  res.json(deletedUser);
});

module.exports = usersRoute;
