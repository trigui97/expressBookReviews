const axios = require('axios');

async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("📚 Liste des livres disponibles :");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération :", error.message);
  }
}

getBooks();

const axios = require('axios');

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(`📚 Livres de ${author}:`, response.data);
  } catch (error) {
    console.error("❌ Erreur:", error.response ? error.response.data : error.message);
  }
}

// Exemple
getBooksByAuthor('J.K. Rowling');

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`📚 Livre intitulé "${title}":`, response.data);
  } catch (error) {
    console.error("❌ Erreur:", error.response ? error.response.data : error.message);
  }
}

// Exemple
getBooksByTitle('Harry Potter and the Sorcerer\'s Stone');


// 🔹 Fonction pour obtenir les détails d’un livre à partir de son ISBN
async function getBookByISBN(isbn) {
  try {
    // Envoie une requête GET à ton serveur Express
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    
    console.log(`📖 Détails du livre avec ISBN ${isbn} :`);
    console.log(response.data);
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du livre ${isbn} :`, error.message);
  }
}

// Exemple : récupère le livre dont l’ISBN est 1
getBookByISBN(1);
