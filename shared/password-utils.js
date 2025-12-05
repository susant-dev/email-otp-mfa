const bcrypt = require("bcrypt");

/**
 * 1. Generates a salt using bcrypt.genSaltSync(10).
 *
 * 2. Hashes the raw password with the generated salt using bcrypt.hashSync(raw, salt).
 *
 * 3. Returns the hashed password as a string.
 *
 * 4. If an error occurs, logs the error message and rethrows it.
 */
const encodePassword = (raw) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(raw, salt);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 1. Use bcrypt.compareSync(raw, encoded) to check if the raw password matches the hashed password.
 * 2. Return true if they match, false if they don’t.
 * 3. If an error occurs during comparison, it logs the error and rethrows it.
 *
 * Parameters:
 * raw (string) – The plain text password to verify.
 * encoded (string) – The hashed password stored in the database.
 *
 * Returns:
 * true – If the passwords match.
 * false – If the passwords do not match.
 */
const matchPassword = (raw, encoded) => {
  try {
    return bcrypt.compareSync(raw, encoded);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

module.exports = { encodePassword, matchPassword };
