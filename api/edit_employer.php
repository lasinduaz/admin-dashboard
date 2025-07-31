<?php
header('Content-Type: application/json');
require_once '../config/db.php'; // adjust path if needed

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Check required POST fields
$required = ['id', 'name', 'email', 'contact', 'company_name', 'address'];
foreach ($required as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        echo json_encode(['status' => 'error', 'message' => "Missing or empty field: $field"]);
        exit;
    }
}

$id = intval($_POST['id']);
$name = trim($_POST['name']);
$email = trim($_POST['email']);
$contact = trim($_POST['contact']);
$company_name = trim($_POST['company_name']);
$address = trim($_POST['address']);

// Prepare update query
$sql = "UPDATE employers SET name = ?, email = ?, contact = ?, company_name = ?, address = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param('sssssi', $name, $email, $contact, $company_name, $address, $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Employer updated successfully']);
    } else {
        // No rows updated (maybe id not found)
        echo json_encode(['status' => 'error', 'message' => 'No changes made or employer not found']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Execute failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
