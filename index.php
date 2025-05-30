<?php

require __DIR__ . '/vendor/autoload.php';

use App\Controllers\ShotController;

$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$uri = rtrim($uri, '/');

if ($uri == '' || $uri == '/myAimBuddy') {
    require __DIR__ . '/app/Views/home.php';
} elseif ($uri == '/shots/create' && $method == 'POST') {
    // Handle AJAX or form POST to save a new shot
    $controller = new ShotController();
    $controller->create();
} elseif ($uri == '/shots/list' && $method == 'GET') {
    // Return a list of shots JSON / XML
    $controller = new ShotController();
    $controller->listAll();
} else {
    // 404 Not Found
    http_response_code(404);
    echo '<h1>404 — Stránka nenájdená</h1>';
}