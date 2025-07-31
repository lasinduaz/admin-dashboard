<?php
require_once '../config/db.php';  // Make sure this path is correct
header('Content-Type: application/json');
// Error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Fetch all worker fields from the database
$sql = "SELECT * FROM workers ORDER BY created_at DESC";
$result = $conn->query($sql);

$workers = [];

if ($result === false) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database query failed',
        'details' => $conn->error
    ]);
    exit;
}

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $workers[] = $row;
    }
}

echo json_encode($workers);
?>
