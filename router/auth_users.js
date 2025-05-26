// ======= auth_users.js =======
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = require('../users.js'); // or './users.js' depending on your structure


// Check if username already exists
const isValid = (username) => {
    return users.hasOwnProperty(username);
  };
  
// Check if username and password match
const authenticatedUser = (username, password) => {
    return users[username] && users[username].password === password;
  };
  

// Register route now only in general.js, not repeated here

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "User successfully logged in" });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const bookReviews = books[isbn].reviews;
  
    if (bookReviews && bookReviews[username]) {
      delete bookReviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "No review found for this user" });
    }
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
