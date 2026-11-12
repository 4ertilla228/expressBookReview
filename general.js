const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Задание 6: Регистрация нового пользователя
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Задание 1 и 10: Получение списка всех книг (с использованием async/await и Promises)
public_users.get('/', async function (req, res) {
  try {
    // Оборачиваем получение данных в Promise
    const getAllBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    
    const bookList = await getAllBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Задание 2 и 11: Получение деталей книги по ISBN (с использованием Promise callbacks)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const getBookByIsbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  
  getBookByIsbn
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Задание 3 и 12: Получение деталей книги по автору (с использованием async/await)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let booksByAuthor = [];
      for (let key in books) {
        if (books[key].author === author) {
          booksByAuthor.push({
            "isbn": key,
            "author": books[key].author,
            "title": books[key].title,
            "reviews": books[key].reviews
          });
        }
      }
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    });
    
    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Задание 4 и 13: Получение деталей книги по названию (с использованием Promise)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      let booksByTitle = [];
      for (let key in books) {
        if (books[key].title === title) {
          booksByTitle.push({
            "isbn": key,
            "author": books[key].author,
            "title": books[key].title,
            "reviews": books[key].reviews
          });
        }
      }
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    });
    
    const result = await getBooksByTitle;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Задание 5: Получение отзывов о книге
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
