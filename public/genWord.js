// Fonction pour récupérer un mot aléatoire basé sur la longueur
export async function generateWord(length) {
    try {
        const response = await fetch(`https://trouve-mot.fr/api/size/${length}`);
        const data = await response.json();
        const word = data[0].name; // Récupérer le premier mot du tableau
        return word;
    } catch (error) {
        console.error('Erreur lors de la récupération du mot :', error);
        return null;
    }
}