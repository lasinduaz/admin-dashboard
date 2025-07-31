<?php
$host = "localhost";
$user = "root";
$pass = ""; // If your MySQL has a password, set it here
$db = "adm_dash";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed."]));
}
?>
