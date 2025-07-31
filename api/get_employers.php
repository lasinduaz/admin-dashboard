<?php
require_once '../config/db.php';
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$sql = "SELECT id, name, email, contact, company_name, address FROM employers ORDER BY id DESC";
$result = $conn->query($sql);

$employers = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Make sure keys match DataTable columns: id, name, email, contact, company_name, address
        $employers[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'contact' => $row['contact'],
            'company_name' => $row['company_name'],
            'address' => $row['address']
        ];
    }
}

echo json_encode($employers);

$conn->close();
?>
