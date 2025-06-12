<?php

require __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/session.php';

use App\Controllers\ShotController;

$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$uri = rtrim($uri, '/');

if ($uri == '' || $uri == '/myAimBuddy') {
    require __DIR__ . '/app/Views/home.php';
} elseif ($uri == '/myAimBuddy/about') {
    require __DIR__ . '/app/Views/about.php';
} elseif ($uri == '/myAimBuddy/register') {
    require __DIR__ . '/app/Views/register.php';
} elseif ($uri == '/myAimBuddy/login') {
    require __DIR__ . '/app/Views/login.php';
} elseif ($uri == '/myAimBuddy/logout') {
    require __DIR__ . '/logout.php';
} elseif ($uri == '/myAimBuddy/dashboard') {
    require __DIR__ . '/app/Views/dashboard.php';
} elseif ($uri == '/myAimBuddy/shots/create' && $method == 'POST') {
    require __DIR__ . '/shots/create.php';
    exit;
}else {
    require __DIR__ . '/app/Views/404.php';
}