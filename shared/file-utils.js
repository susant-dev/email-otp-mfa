const fs = require("fs");

/**
 * Reads a JSON file and parses its content.
 * @param {string} filename - The path to the JSON file to read.
 * @returns {Promise<Object|Array>} - Returns a promise that resolves to the parsed JSON content of the file.
 * @throws {Error} - Throws an error if the file cannot be read or parsed.
 * @example
 * const products = await readFile("./data/products.json");
 */
async function readFile(filename) {
  try {
    const file = fs.readFileSync(filename, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    throw new Error(`Couldn't read file ${filename}`);
  }
}

/**
 * Writes JavaScript objects or arrays into a JSON file.
 * @param {string} filename - The path to the JSON file to write to.
 * @param {Object|Array} updated - The data to write into the file.
 * @returns {Promise<void>} - Returns a promise that resolves when the file has been successfully written.
 * @throws {Error} - Throws an error if the file cannot be written.
 */
async function writeToFile(filename, updated) {
  try {
    const data = JSON.stringify(updated);
    fs.writeFileSync(filename, data, "utf-8");
  } catch (error) {
    throw new Error(`Couldn't write into file ${filename}`);
  }
}

module.exports = { readFile, writeToFile };
