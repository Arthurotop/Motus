// main.js

import { generateWordByLength } from './difficultyLevels.js';

document.addEventListener("DOMContentLoaded", function() {
    const startGameButton = document.getElementById('start-game-button');

    startGameButton.addEventListener('click', async () => {
        const wordLength = document.getElementById('word-length').value;

        if (wordLength) {
            // Appeler la fonction de génération de mot en fonction de la longueur choisie
            await generateWordByLength(wordLength);
        } else {
            console.log('Veuillez entrer un nombre valide de lettres.');
        }
    });
});