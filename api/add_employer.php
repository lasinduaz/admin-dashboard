<?php
require_once('../config/db.php');
header('Content-Type: application/json');

$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$contact = $_POST['contact'] ?? null;
$company_name = $_POST['company_name'] ?? null;
$address = $_POST['address'] ?? null;

if (!$name || !$email || !$contact || !$company_name) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO employers (name, email, contact, company_name, address) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
    exit;
}

$stmt->bind_param("sssss", $name, $email, $contact, $company_name, $address);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Employer added']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
