<?php
require_once '../config/db.php';  // adjust path if needed
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Worker ID is required']);
    exit;
}

$id = intval($_GET['id']);
$sql = "SELECT * FROM workers WHERE id = $id LIMIT 1";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'details' => $conn->error]);
    exit;
}

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Worker not found']);
    exit;
}

$worker = $result->fetch_assoc();
echo json_encode($worker);
?>
