/**
 * TODO: Connect MongoDB using Mongoose in an Express middleware:
 *
 * 1. Import the 'mongoose' library at the top of the file.
 * 2. Access the MongoDB connection URL from environment variables using process.env.DB_URL.
 *    (Ensure the DB_URL is defined in a .env file.)
 * 3. Create an asynchronous middleware function called connectDB that takes (req, res, next) as parameters.
 * 4. Inside the function, use a try...catch block to manage connection logic.
 * 5. In the try block, call mongoose.connect() with the database URL.
 *    - Pass an options object that includes the dbName (e.g., { dbName: "YourDatabaseName" }).
 * 6. After successfully connecting, log a message like "Database connected!".
 * 7. Call next() to pass control to the next middleware or route.
 * 8. In the catch block, log the error and throw a new Error with a message like "Database connection failed!".
 * 9. Export the connectDB function using module.exports so it can be used in other parts of the application.
 */
const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

async function connectDB(req, res, next) {
  try {
    await mongoose.connect(DB_URL, { dbName: DB_NAME });
    console.log("Database Connected");
    next();
  } catch (error) {
    console.log(`Database connection failed`);
    console.log(error);
  }
}

module.exports = connectDB;
