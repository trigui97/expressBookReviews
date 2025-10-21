const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Vérifie si le nom d'utilisateur existe déjà
const isValid = (username) => { 
  return users.some(user => user.username === username);
};

// Vérifie si le nom d'utilisateur et le mot de passe sont corrects
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Seuls les utilisateurs enregistrés peuvent se connecter
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Vérifier que les champs sont remplis
  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
  }

  // Vérifier les identifiants
  if (authenticatedUser(username, password)) {
    // Génération du token JWT
    const accessToken = jwt.sign(
      { username: username },       // payload
      'access',                     // clé secrète
      { expiresIn: '1h' }           // durée de validité du token
    );

    // Stocker la session utilisateur
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "Connexion réussie",
      token: accessToken
    });
  } else {
    return res.status(401).json({
      message: "Nom d'utilisateur ou mot de passe incorrect"
    });
  }
});

// Ajouter ou modifier une critique de livre
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  // Vérifie si l'utilisateur est connecté
  if (!username) {
    return res.status(401).json({ message: "Utilisateur non authentifié. Veuillez vous connecter." });
  }

  // Vérifie si l'ISBN existe
  if (!books[isbn]) {
    return res.status(404).json({ message: "Livre introuvable." });
  }

  // Vérifie si une critique est fournie
  if (!review) {
    return res.status(400).json({ message: "Veuillez fournir une critique." });
  }

  // Si le livre n'a pas encore de critiques, on crée l'objet
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Ajouter ou modifier la critique de l'utilisateur connecté
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Critique ajoutée ou modifiée avec succès.",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // utilisateur connecté

  // Vérifier si le livre existe
  if (!books[isbn]) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  // Vérifier si l'utilisateur a publié une critique
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]; // suppression de la critique
    return res.status(200).json({
      message: "Critique supprimée avec succès.",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({
      message: "Aucune critique trouvée pour cet utilisateur sur ce livre."
    });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
