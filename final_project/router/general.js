const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/books'); // Adjust URL if needed
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books." });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`); // Adjust URL if needed
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book details by ISBN." });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/books/author/${author}`); // Adjust URL if needed
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by author." });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/books/title/${title}`); // Adjust URL if needed
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by title." });
  }
});

// Get book review by ISBN
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/books/review/${isbn}`); // Adjust URL if needed
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book reviews." });
  }
});

module.exports.general = public_users;
