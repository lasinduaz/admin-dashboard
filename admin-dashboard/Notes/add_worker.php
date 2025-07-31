<?php

header("Content-Type: application/json");
$host = "localhost";       
$user = "root";
$pass = "";          
$db   = "adm_dash";    

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "DB connect fail: " . $conn->connect_error]));
}

$fullName = $_POST['fullName'] ?? '';
$username = $_POST['username'] ?? '';
$email    = $_POST['email'] ?? '';
$contact  = $_POST['contactNumber'] ?? '';
$idNumber = $_POST['idNumber'] ?? '';
$password = $_POST['password'] ?? '';  // Consider hashing

if (!$fullName || !$username || !$email || !$password) {
    http_response_code(400);
    die(json_encode(["error" => "Missing required fields."]));
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$sql = "INSERT INTO workers (full_name, username, email, contact_number, id_number, password)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $fullName, $username, $email, $contact, $idNumber, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
