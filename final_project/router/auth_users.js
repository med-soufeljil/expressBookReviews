const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "fingerprint_customer";

// Function to check if a username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Function to authenticate user based on username and password
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Validate user credentials
  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid username or password." });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, SECRET_KEY);
  req.session.token = accessToken;

  return res.status(200).json({ message: "Login successful.", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const { isbn } = req.params;
  const token = req.session.token;

  // Decode JWT to get the username
  let username;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized access." });
  }

  // Find the book by ISBN
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add or modify the review
  book.reviews[username] = review;
  return res.status(200).json({ message: "Review added/modified successfully." });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.session.token;

  // Decode JWT to get the username
  let username;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    username = decoded.username;
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized access." });
  }

  // Find the book by ISBN
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Delete the review if it belongs to the user
  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(404).json({ message: "Review not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
