//connexion.js

const mysql = require('mysql');

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Bastaetpastaga13',
    database: 'motus',
    port: '3306'
});

// Événement de connexion réussie
connection.connect((err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err);
    } else {
        console.log('Connecté à la base de données MySQL');
    }
});

// Événement d'erreur de connexion
connection.on('error', (err) => {
    console.error('Erreur de connexion à la base de données :', err);
});

module.exports = connection;
