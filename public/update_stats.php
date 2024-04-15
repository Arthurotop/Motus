<?php
$servername = "localhost";
$username = "root";
$password = "Bastaetpastaga13";
$dbname = "motus";

// Créer la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Réception des données POST
$data = json_decode(file_get_contents('php://input'), true);
$userId = intval($data['userId']);
$victory = $data['victory'] ? 1 : 0;
$attempts = intval($data['attempts']);

// Mise à jour de la base de données
$sql = "UPDATE users SET 
            nombre_de_parties_jouees = nombre_de_parties_jouees + 1,
            nombre_de_victoires = nombre_de_victoires + $victory,
            nombre_d_essais = nombre_d_essais + $attempts
        WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>
