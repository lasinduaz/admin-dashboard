<?php 
require_once '../config/db.php';
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST method required']);
    exit;
}

// ✅ Require ID
if (!isset($_POST['id']) || empty($_POST['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Worker ID is required']);
    exit;
}

$workerId = $_POST['id'];
$fullName = trim($_POST['fullName'] ?? '');
$email = trim($_POST['email'] ?? '');
$contactNumber = trim($_POST['contactNumber'] ?? '');

// ✅ Basic validation
if (empty($fullName) || empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Full Name and Email are required']);
    exit;
}

// ✅ Email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// ✅ Check if worker exists
$checkStmt = $conn->prepare("SELECT id FROM workers WHERE id = ?");
if (!$checkStmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare check statement', 'details' => $conn->error]);
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

// ✅ Prepared statement to prevent SQL injection
$stmt = $conn->prepare("UPDATE workers SET fullName = ?, email = ?, contactNumber = ? WHERE id = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare statement', 'details' => $conn->error]);
    exit;
}

$stmt->bind_param("sssi", $fullName, $email, $contactNumber, $workerId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Worker updated successfully']);
    } else {
        echo json_encode(['success' => true, 'message' => 'No changes made']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Update failed', 'details' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>