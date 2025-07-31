<?php
header('Content-Type: application/json');
require_once '../config/db.php';  // Adjust path if needed

// Enable error reporting for debugging (remove on production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Validate the employer ID from GET
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid employer ID']);
    exit;
}

$id = intval($_GET['id']);

// Prepare SQL query with placeholder to prevent SQL injection
$sql = "SELECT id, name, email, contact, company_name, address, created_at FROM employers WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param('i', $id);
$stmt->execute();

$result = $stmt->get_result();
$employer = $result->fetch_assoc();

if ($employer) {
    echo json_encode(['status' => 'success', 'data' => $employer]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Employer not found']);
}

$stmt->close();
$conn->close();
?>
