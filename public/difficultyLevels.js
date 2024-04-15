// Importation de la fonction nécessaire pour générer un mot
import { generateWord } from './genWord.js';

export async function generateWordByLength(length) {
    let generatedWord = await generateWord(length);
    // Stockage du mot généré pour utilisation ultérieure
    sessionStorage.setItem('generatedWord', generatedWord);
    window.location.href = 'game.html';  // Redirection vers la page du jeu
}