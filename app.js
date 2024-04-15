//app.js

const express = require('express');
const connection = require('./connexion.js');
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3005;

const session = require('express-session');

app.use(session({
  secret: 'keyboard cat',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));
app.use(bodyParser.json());




app.post('/api/update_stats', async (req, res) => {
    const { id, victory, attempts } = req.body;

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        console.error('Invalid ID:', parsedId);
        res.status(400).send('Invalid user ID');
        return;
    }

    // Convertir la victoire en 0 ou 1 pour la compatibilité SQL
    const victoryFlag = victory ? 1 : 0;

    const query = `UPDATE users SET 
        nombre_de_parties_jouees = nombre_de_parties_jouees + 1, 
        nombre_de_victoires = nombre_de_victoires + ?, 
        nombre_d_essais = nombre_d_essais + ? 
        WHERE id = ?`;

    const params = [victoryFlag, attempts, parsedId];

    connection.query(query, params, (error, results) => {
        if (error) {
            console.error('Error updating statistics:', error);
            res.status(500).json({status: 'error', message: 'Error updating statistics', error: error.sqlMessage});
            return;
        }
        res.json({ status: 'success', message: 'Statistics successfully updated' });
    });
});



// Servir les fichiers statiques depuis le répertoire 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'motus')));

// Pour la route '/register'
app.post('/register', async (req, res) => {
    const { pseudo, password } = req.body;
    connection.query('INSERT INTO users (pseudo, password) VALUES (?, ?)', [pseudo, password], (error, results) => {
        if (!error) {
            // Initialiser la session ici
            req.session.userId = results.insertId;
            req.session.pseudo = pseudo;  // Stocker le pseudo dans la session
            req.session.isAuthenticated = true;
            res.redirect('/selection.html');
        } else {
            res.status(500).send('Erreur serveur');
        }
    });
});

// Pour la route '/authenticate'
app.post('/authenticate', async (req, res) => {
    const { pseudo, password } = req.body;
    connection.query('SELECT * FROM users WHERE pseudo = ? AND password = ?', [pseudo, password], (error, results) => {
        if (results.length > 0) {
            req.session.userId = results[0].id;  // Stocker l'ID utilisateur dans la session
            req.session.pseudo = pseudo;
            req.session.isAuthenticated = true;
            res.json({ userId: results[0].id, redirect: '/selection.html' });  
        } else {
            res.status(401).send('Pseudo ou mot de passe incorrect');
        }
    });
});



// Pour la route '/ranking'
app.get('/ranking', (req, res) => {
    const currentUserId = req.session.userId;
    const sortKey = req.query.sort === 'ratio' ? 'ratio' : 'nombre_de_victoires'; 

    const queryAllPlayers = `
        SELECT id, pseudo, nombre_de_victoires, nombre_de_parties_jouees,
        ROUND((nombre_de_victoires / GREATEST(nombre_de_parties_jouees, 1) * 100), 2) AS ratio
        FROM users
        ORDER BY ${sortKey} DESC, ratio DESC;
    `;

    connection.query(queryAllPlayers, (error, players) => {
        if (error) {
            console.error('Error fetching player rankings:', error);
            return res.status(500).send('Error fetching player rankings');
        }

        const topPlayers = players.slice(0, 5);
        const currentUser = players.find(player => player.id === currentUserId);
        const currentUserRank = players.findIndex(player => player.id === currentUserId) + 1;
        
        const result = {
            topPlayers,
            currentUser: currentUser && !topPlayers.includes(currentUser) ? {...currentUser, rank: currentUserRank} : null
        };

        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});


