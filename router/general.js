// ======= general.js =======
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;

const public_users = express.Router();
let users = require('../users.js'); // or './users.js' depending on your structure

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
    try {
      const getBooks = () => {
        return new Promise((resolve) => resolve(books));
      };
      const allBooks = await getBooks();
      return res.status(200).json(allBooks);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving books" });
    }
  });
  

// Task 2: Get book details based on ISBN
// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject("Book not found");
          }
        });
      };
  
      const book = await getBookByISBN(isbn);
      return res.status(200).json(book);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

// Task 3: Get book details based on author
// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
  
    try {
      const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
          const result = Object.values(books).filter((book) => book.author === author);
          if (result.length > 0) {
            resolve(result);
          } else {
            reject("No books found by this author");
          }
        });
      };
  
      const booksByAuthor = await getBooksByAuthor(author);
      return res.status(200).json(booksByAuthor);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

// Task 4: Get all books based on title
// Task 13: Get all books based on title using async/await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      const getBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
          const result = Object.values(books).filter((book) => book.title === title);
          if (result.length > 0) {
            resolve(result);
          } else {
            reject("No books found with this title");
          }
        });
      };
  
      const booksByTitle = await getBooksByTitle(title);
      return res.status(200).json(booksByTitle);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

// Task 5: Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;