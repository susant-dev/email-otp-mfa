// Import and configure the 'dotenv' package at the top of server.js to load environment variables.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./shared/middlewares/connect-db");
const oauthRoutes = require("./modules/google-oauth/oauth-routes");
const usersRoute = require("./modules/users/users-routes");

const port = process.env.SERVER_PORT || 3000;
const hostname = process.env.SERVER_HOST || "localhost";

const server = express();

server.use(cors());

// built-in middlewares to parse request body in application-level
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// middlewares to parse request cookies in application-level
server.use(cookieParser());

// Add the connectDB middleware in application-level, before defining routes.
server.use(connectDB);

// Mount all the routes
server.use(oauthRoutes);
server.use(usersRoute);

// error-handling middleware to logs the error for debugging.
server.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send("Oops! Internal server error!");
});

// Middleware to handle route not found error.
server.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});

server.listen(port, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server running on http://${hostname}:${port}`);
});
