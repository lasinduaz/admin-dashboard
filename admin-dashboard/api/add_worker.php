<?php
require_once '../config/db.php';
header("Content-Type: application/json");

// Validate required fields
$required = ["fullName", "username", "email", "idNumber", "password"];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(["error" => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize & assign inputs
$fullName = $_POST["fullName"];
$username = $_POST["username"];
$email = $_POST["email"];
$contactNumber = $_POST["contactNumber"] ?? null;
$idNumber = $_POST["idNumber"];
$password = password_hash($_POST["password"], PASSWORD_DEFAULT);

$permanentAddress = $_POST["permanentAddress"] ?? null;
$currentAddress = $_POST["currentAddress"] ?? null;
$workExperience = $_POST["workExperience"] ?? null;
$bankAccountNumber = $_POST["bankAccountNumber"] ?? null;
$bankName = $_POST["bankName"] ?? null;
$bankBranch = $_POST["bankBranch"] ?? null;

$idFrontImage = null;
$idBackImage = null;

// Handle file uploads
$uploadDir = "../uploads/";
$idFrontDir = $uploadDir . "id_front/";
$idBackDir = $uploadDir . "id_back/";

if (!is_dir($idFrontDir)) mkdir($idFrontDir, 0755, true);
if (!is_dir($idBackDir)) mkdir($idBackDir, 0755, true);

if (!empty($_FILES["idFrontImage"]["name"])) {
    $targetPath = $idFrontDir . basename($_FILES["idFrontImage"]["name"]);
    move_uploaded_file($_FILES["idFrontImage"]["tmp_name"], $targetPath);
    $idFrontImage = "uploads/id_front/" . basename($_FILES["idFrontImage"]["name"]);
}

if (!empty($_FILES["idBackImage"]["name"])) {
    $targetPath = $idBackDir . basename($_FILES["idBackImage"]["name"]);
    move_uploaded_file($_FILES["idBackImage"]["tmp_name"], $targetPath);
    $idBackImage = "uploads/id_back/" . basename($_FILES["idBackImage"]["name"]);
}

// Insert query
$sql = "INSERT INTO workers (
    fullName, username, email, contactNumber, idNumber, password,
    permanentAddress, currentAddress, workExperience,
    bankAccountNumber, bankName, bankBranch,
    idFrontImage, idBackImage
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "ssssssssssssss",
    $fullName, $username, $email, $contactNumber, $idNumber, $password,
    $permanentAddress, $currentAddress, $workExperience,
    $bankAccountNumber, $bankName, $bankBranch,
    $idFrontImage, $idBackImage
);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Failed to save worker: " . $stmt->error]);
}
?>
