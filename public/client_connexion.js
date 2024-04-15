//client_connexion.js

// Exporte explicitement la fonction pour envoyer une requête d'authentification au serveur
export async function authenticateUser(pseudo, password) {
    const response = await fetch('/authenticate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({pseudo, password})
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("User ID received from server:", data.userId);
    sessionStorage.setItem('pseudo', pseudo);
    sessionStorage.setItem('userId', data.userId);
    return data;
}


// Exporte explicitement la fonction pour envoyer une requête d'inscription au serveur
export async function registerUser(pseudo, password) {
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pseudo, password })
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.text();
}


document.addEventListener("DOMContentLoaded", function() {
    const pseudoInput = document.getElementById('pseudo');
    const passwordInput = document.getElementById('password');
    const feedbackDisplay = document.getElementById('feedback-display');
 
    document.getElementById('btn-submit-login').addEventListener('click', async () => {
        const pseudo = pseudoInput.value;
        const password = passwordInput.value;

        try {
            // Appeler la fonction pour authentifier un utilisateur
            await authenticateUser(pseudo, password);
            console.log('Utilisateur authentifié avec succès');
            feedbackDisplay.textContent = 'Connexion réussie'; 
            // Redirection vers la page de sélection après l'authentification réussie
            sessionStorage.setItem('isAuthenticated', true);
            window.location.href = '/selection.html';
        } catch (error) {
            console.error('Erreur lors de la connexion :', error.message);
            feedbackDisplay.textContent = 'Erreur lors de la connexion'; 
            setTimeout(() => {
                feedbackDisplay.textContent = '';
            }, 5000);
        }
    });

    document.getElementById('btn-submit-register').addEventListener('click', async () => {
        const pseudo = pseudoInput.value;
        const password = passwordInput.value;

        try {
            // Appeler la fonction pour inscrire un nouvel utilisateur
            await registerUser(pseudo, password);
            console.log('Utilisateur inscrit avec succès');
            feedbackDisplay.textContent = 'Inscription réussie'; 
            // Redirection vers la page de sélection après l'inscription réussie
            window.location.href = '/selection.html';
        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error.message);
            feedbackDisplay.textContent = 'Erreur lors de l\'inscription'; 
        }
    });
});

