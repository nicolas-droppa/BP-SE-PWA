<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$hostname = 'localhost';
$database = 'myAimBuddy';
$username = 'root';
$password = '';

function connectDatabase() {
    global $hostname, $database, $username, $password;

    $dsn = "mysql:host={$hostname};dbname={$database};charset=utf8mb4";

    $options = [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        \PDO::ATTR_EMULATE_PREPARES => false,
    ];

    return new \PDO($dsn, $username, $password, $options);
}

try {
    $db = connectDatabase();
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}