<?php 
require_once '../config/db.php';
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST method required']);
    exit;
}

// Require ID
if (!isset($_POST['id']) || empty($_POST['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Worker ID is required']);
    exit;
}

$workerId = (int)$_POST['id'];

// Check if worker exists
$checkStmt = $conn->prepare("SELECT id FROM workers WHERE id = ?");
if (!$checkStmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $conn->error]);
    exit;
}

$checkStmt->bind_param("i", $workerId);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Worker not found']);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Delete worker
$stmt = $conn->prepare("DELETE FROM workers WHERE id = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("i", $workerId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Worker deleted successfully']);
    } else {
        echo json_encode(['error' => 'No worker was deleted']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Delete failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>