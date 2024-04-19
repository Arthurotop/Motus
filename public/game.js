//game.js

let currentAttempt = 0;
const maxAttempts = 6;
let victory = false;

export async function generateWordByDifficulty(difficulty) {
  let generatedWord;

  sessionStorage.setItem('generatedWord', generatedWord);
  window.location.href = 'game.html';
}

export function validateAttempt(attempt) {
  const generatedWord = sessionStorage.getItem('generatedWord').toUpperCase();
  const currentRowCells = document.querySelectorAll('#game-table tr')[currentAttempt].cells;
  const userAttempt = attempt.toUpperCase();
  let victory = userAttempt === generatedWord;

  let generatedLetterCounts = {};
  let attemptLetterCounts = {};
  let isAnyCorrect = false;

  for (let letter of generatedWord) {
    generatedLetterCounts[letter] = (generatedLetterCounts[letter] || 0) + 1;
  }

  const submitButton = document.getElementById('submit-attempt'); 
  // Première passe pour identifier les lettres correctement placées
  for (let i = 0; i < attempt.length; i++) {
      const letter = attempt[i].toUpperCase();
      if (letter === generatedWord[i]) {
          generatedLetterCounts[letter]--;
          attemptLetterCounts[letter] = (attemptLetterCounts[letter] || 0) + 1;
          setTimeout(() => {
              currentRowCells[i].classList.add('correct-location');
              playSound('correctSound');
              
              if (i === attempt.length - 1) {
                  setTimeout(() => {
                      submitButton.disabled = false;
                  }, 500); 
              }
          }, i * 500);
          isAnyCorrect = true;
      }
  }

  // Deuxième passe pour identifier les lettres mal placées ou non présentes
  for (let i = 0; i < attempt.length; i++) {
      const letter = attempt[i].toUpperCase();
      if (letter !== generatedWord[i]) {
          if (generatedLetterCounts[letter] > 0) { // Vérifier s'il reste des occurrences non placées de la lettre
              generatedLetterCounts[letter]--; // Décompter l'occurrence utilisée
              setTimeout(() => {
                  const contentSpan = document.createElement('span');
                  contentSpan.textContent = letter;
                  contentSpan.classList.add('wrong-location');
                  currentRowCells[i].innerHTML = '';
                  currentRowCells[i].appendChild(contentSpan);
                  playSound('wrongLocationSound');

                  if (i === attempt.length - 1) {
                      setTimeout(() => {
                          submitButton.disabled = false;
                      }, 500); 
                  }
              }, i * 500);
              isAnyCorrect = true;
          } else {
              setTimeout(() => {
                  currentRowCells[i].classList.add('not-in-word');
                  playSound('notInWordSound');

                  if (i === attempt.length - 1) {
                      setTimeout(() => {
                          submitButton.disabled = false;
                      }, 500); 
                  }
              }, i * 500);
          }
      }
  }

  

  currentAttempt++;
  if (victory || currentAttempt >= maxAttempts) {
if (victory) {
        document.getElementById('feedback').textContent = 'Félicitations ! Vous avez trouvé le mot : ' + generatedWord;
        document.getElementById('submit-attempt').disabled = true;  // Désactiver le bouton de soumission
        return true;  // Retourner la victoire
    }

    // Incrementer le nombre d'essais
    currentAttempt++;

    // Vérifier si tous les essais sont épuisés
    if (currentAttempt >= maxAttempts) {
        document.getElementById('feedback').textContent = 'Vous avez épuisé tous vos essais. Le mot à deviner était : ' + generatedWord;
        document.getElementById('submit-attempt').disabled = true;
        return false;
    }
    updatePlayerStats(victory, currentAttempt);
    return;
  }

  initNextRow();
  setTimeout(reportCorrectLettersToNextRow, 500 * attempt.length);
}


function initNextRow() {
    if (currentAttempt < maxAttempts) {
      const nextRowCells = document.querySelectorAll('#game-table tr')[currentAttempt].cells;
      for (const cell of nextRowCells) {
          cell.textContent = '.';
          cell.contentEditable = "true";
          cell.onclick = function() {       
          };
  
          // Limiter la saisie à un seul caractère et passer à la cellule suivante
          cell.addEventListener('input', function() {
              if (this.textContent.length > 1) {
                  this.textContent = this.textContent.charAt(0); // Conserve uniquement le premier caractère
              }
              if (this.textContent.length === 1) {
                  const nextCell = this.nextElementSibling;
                  if (nextCell && nextCell.contentEditable === "true") {
                    nextCell.focus(); // Déplacer le focus à la cellule suivante
                }
            }
        });

        // Ajout pour empêcher la navigation au "Entrée"
        cell.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Empêcher le comportement par défaut de la touche "Entrée"
            }
        });
    }
}
}

// Rapporte les lettres correctes à la ligne suivante avec un délai de 1 seconde
function reportCorrectLettersToNextRow() {
    // Récupère les cellules de la ligne précédente et de la ligne suivante du jeu
    const previousRowCells = document.querySelectorAll('#game-table tr')[currentAttempt - 1].cells;
    const nextRowCells = document.querySelectorAll('#game-table tr')[currentAttempt].cells;

    // Copie les lettres correctement placées de la ligne précédente à la ligne suivante
    for (let i = 0; i < previousRowCells.length; i++) {
        if (previousRowCells[i].classList.contains('correct-location')) {
            setTimeout(function() {
                nextRowCells[i].textContent = previousRowCells[i].textContent;
                nextRowCells[i].classList.add('correct-location');
                nextRowCells[i].contentEditable = "false";
                nextRowCells[i].onclick = null;
            }, i * 150); 
        }
    }
}


// Fonction pour jouer un son
function playSound(soundId) {
  const sound = document.getElementById(soundId);
  sound.currentTime = 0; // Réinitialiser la lecture au début du fichier audio
  sound.play();
}

// Fonction pour initialiser le jeu lors du chargement du document
document.addEventListener('DOMContentLoaded', () => {
  
    // Début de l'insertion du nouveau code pour le bouton "Retour"
    const backButton = document.getElementById('back-button');

    backButton.addEventListener('click', () => {
      // Nettoyer les données du jeu en cours
      sessionStorage.removeItem('generatedWord');  // Supprimez le mot actuellement en jeu
      sessionStorage.removeItem('currentAttempt'); 
  
      // Redirection vers la page de sélection
      window.location.href = 'selection.html';
  });






  // Récupérer les éléments du DOM nécessaires
  const toggleSoundButton = document.getElementById('toggle-sound');
  const audioElements = document.querySelectorAll('audio');

  // Variable pour suivre l'état du son
  let isSoundOn = true;

// Gestionnaire d'événements pour le bouton "Couper le son"
toggleSoundButton.addEventListener('click', () => {
  isSoundOn = !isSoundOn;
  if (isSoundOn) {
      toggleSoundButton.src = 'sound_on.png'; // Image lorsque le son est activé
      audioElements.forEach(audio => audio.muted = false);
  } else {
      toggleSoundButton.src = 'sound_off.png'; // Image lorsque le son est désactivé
      audioElements.forEach(audio => audio.muted = true);
  }
});

  // Fonction pour initialiser la position du bouton "Valider" lors du chargement de la page
function updateSubmitButtonPosition() {
    const submitButton = document.getElementById('submit-attempt');
    const gameTable = document.getElementById('game-table');
    if (submitButton && gameTable && currentAttempt >= 0) {
        const currentRow = document.querySelector(`#game-table tr:nth-child(${currentAttempt + 1})`);
        if (currentRow) {
            submitButton.style.top = `${currentRow.getBoundingClientRect().top - gameTable.getBoundingClientRect().top}px`;
            submitButton.style.left = `${gameTable.offsetLeft + gameTable.offsetWidth + 20}px`;
        }
    }
}

// Gestionnaire d'événements pour le formulaire de soumission de la tentative
const form = document.getElementById('attempt-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const submitButton = document.getElementById('submit-attempt');
    submitButton.disabled = true;

    const gameTable = document.getElementById('game-table');
    let currentAttempt = Array.from(gameTable.querySelectorAll('tr')).findIndex(row => Array.from(row.querySelectorAll('td')).some(cell => cell.isContentEditable));
    const cells = document.querySelectorAll('#game-table tr:nth-child(' + (currentAttempt + 1) + ') td');
    cells.forEach(cell => {
        cell.contentEditable = "false";
    });

    let userAttempt = '';
    cells.forEach(cell => {
        userAttempt += cell.textContent.toUpperCase();
    });

    const victory = validateAttempt(userAttempt);
    if (victory || currentAttempt >= maxAttempts - 1) {
        document.getElementById('feedback').textContent = victory ? 'Félicitations ! Vous avez trouvé le mot : ' + sessionStorage.getItem('generatedWord') : 'Vous avez épuisé tous vos essais. Le mot à deviner était : ' + sessionStorage.getItem('generatedWord');
        submitButton.disabled = true;
    } else {
        // Prepare the next line if not the last attempt
        if (currentAttempt + 1 < maxAttempts) {
            const nextRowCells = document.querySelectorAll('#game-table tr:nth-child(' + (currentAttempt + 2) + ') td');
            nextRowCells.forEach(cell => {
                cell.contentEditable = "true";
            });
            
        }
        setTimeout(() => {
            submitButton.disabled = false;  // Re-enable the button after all animations
        }, maxAttempts * 500);  // Ensure delay covers all animations
    }

    updateSubmitButtonPosition();  // Update button position if necessary
});


  // Appel initial pour positionner le bouton "Valider" au chargement de la page
  updateSubmitButtonPosition();
});

const gameTable = document.getElementById('game-table');
const rows = gameTable.querySelectorAll('tr');

rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, cellIndex) => {
        if (rowIndex > 0) { // Ignorer la première ligne
            cell.setAttribute('data-placeholder', 'Rechercher');
            cell.addEventListener('focus', function() {
                if (this.textContent === '.') {
                    this.textContent = '';
                }
            });
            cell.addEventListener('blur', function() {
                if (this.textContent === '') {
                    this.textContent = '.';
                }
            });
        }
    });
});

// Fonction pour mettre à jour les statistiques des joueurs
async function updatePlayerStats(victory, attempts) {
  const userId = sessionStorage.getItem('userId');
  console.log("Updating stats for User ID:", userId);  

  if (!userId || isNaN(parseInt(userId, 10))) {
      console.error("User ID is missing or invalid. UserID:", userId);
      return;
  }

  const data = {
      id: parseInt(userId, 10),
      victory,
      attempts
  };

  console.log('Data sent to server:', data); 

  try {
      const response = await fetch('/api/update_stats', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      });
      if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Statistiques mises à jour avec succès:', result);
  } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
  }
}


