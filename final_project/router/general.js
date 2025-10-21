const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
 return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Récupère l’ISBN depuis l’URL
  
    // Accès à la base de données locale (booksdb.js)
    const books = require('./booksdb.js'); // Assure-toi que ce chemin est correct
  
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Livre non trouvé pour cet ISBN" });
    }
  });
  

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // 🔹 Récupère le nom de l’auteur depuis l’URL
    const booksByAuthor = [];
  
    // 🔹 Récupère toutes les clés des livres (ex: ISBNs)
    const keys = Object.keys(books);
  
    // 🔹 Parcourt tous les livres pour vérifier si l’auteur correspond
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor.push({ isbn: key, ...books[key] });
      }
    });
  
    // 🔹 Si aucun livre trouvé
    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur." });
    }
  
    // 🔹 Retourne la liste des livres trouvés
    return res.status(200).json(booksByAuthor);
  });
  

// Get book details based on author
public_users.get('/title/:title', function (req, res) {
    const author = req.params.title; // 🔹 Récupère le title de BOOK depuis l’URL
    const booksByTitle = [];
  
    // 🔹 Récupère toutes les clés des livres (ex: ISBNs)
    const keys = Object.keys(books);
  
    // 🔹 Parcourt tous les livres pour vérifier si l’auteur correspond
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === author.toLowerCase()) {
        booksByTitle.push({ isbn: key, ...books[key] });
      }
    });
  
    // 🔹 Si aucun livre trouvé
    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé pour cet  title." });
    }
  
    // 🔹 Retourne la liste des livres trouvés
    return res.status(200).json(booksByTitle);
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Récupérer l'ISBN depuis les paramètres de la requête
    const isbn = req.params.isbn;
  
    // Vérifier si le livre avec cet ISBN existe dans la base de données (ex: objet "books")
    const book = books[isbn];
  
    if (book) {
      // Retourner les critiques du livre
      return res.status(200).json(book.reviews);
    } else {
      // Si le livre n'existe pas
      return res.status(404).json({ message: "Livre non trouvé" });
    }
  });


// ✅ Route asynchrone pour obtenir tous les livres
public_users.get('/', async (req, res) => {
  try {
    // Simuler une opération asynchrone avec Promise
    let getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });

    const bookList = await getBooks;
    return res.status(200).json(bookList);
  } catch (err) {
    return res.status(500).json({ message: "Erreur lors de la récupération des livres." });
  }
});




module.exports.general = public_users;
