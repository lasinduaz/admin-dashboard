<?php

require_once('../config/db.php');

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

$id = $data['id'] ?? null;
$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$contact = $data['contact'] ?? null;
$company_name = $data['company_name'] ?? null;

if (!$id || !$name || !$email || !$contact || !$company_name) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("UPDATE employers SET name = ?, email = ?, contact = ?, company_name = ? WHERE id = ?");
$stmt->bind_param("ssssi", $name, $email, $contact, $company_name, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Employer updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed"]);
}

?>
