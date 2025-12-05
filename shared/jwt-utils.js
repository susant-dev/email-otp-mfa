const { verify } = require("jsonwebtoken");
const { sign } = require("jsonwebtoken");

const secret = process.env.TOKEN_SECRET;
const expiresIn = "6h";

/**
 * 1. Checks if a token is provided.
 * 2. Splits the token if it’s in the Bearer <token> format.
 * 3. Uses the verify() function from jsonwebtoken to verify the token against the secret.
 * 4. Returns the decoded payload if the token is valid.
 *
 * Parameters:
 * token (string) – The JWT token to decode. Usually comes in the HTTP Authorization header like "Bearer <token>".
 *
 * Returns:
 * The decoded payload object if the token is valid.
 * undefined if no token is provided or if the token is invalid.
 */
const decodeToken = (token) => {
  if (!token) return;
  token = token.split(" ")[1];
  if (!token) return;
  const secret = process.env.TOKEN_SECRET;
  return verify(token, secret);
};

/**
 * 1. Uses the sign() function from the jsonwebtoken library.
 * 2. Signs the provided payload with a secret key.
 * 3. Sets an expiration time (expiresIn) for the token to 1 hours.
 *
 * Parameters:
 * payload (object) – The data you want to encode in the token (e.g., user ID, role, email).
 *
 * Returns:
 * A string representing the JWT token.
 */
const encodeToken = (payload) => {
  const secret = process.env.TOKEN_SECRET;
  return sign(payload, secret, { expiresIn: "1h" });
};

module.exports = { decodeToken, encodeToken };
