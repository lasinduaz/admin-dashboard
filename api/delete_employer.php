<?php
header('Content-Type: application/json');
require_once '../config/db.php'; // Adjust path if needed

// Enable error reporting for debugging (remove on production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Check if 'id' is set and is numeric
if (!isset($_POST['id']) || !is_numeric($_POST['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing employer ID']);
    exit;
}

$id = intval($_POST['id']);

// Prepare delete statement
$sql = "DELETE FROM employers WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Employer deleted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Employer not found or already deleted']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Delete failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
