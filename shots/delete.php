<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../session.php';

if (empty($_SESSION['user_id'])) {
    header('Location: /myAimBuddy/');
    exit;
}

$sid = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($sid <= 0) {
    header('Location: /myAimBuddy/dashboard');
    exit;
}

$query = $db->prepare("
    SELECT 1
    FROM user_sessions
    WHERE user_id = ? AND session_id = ?
");
$query->execute([$_SESSION['user_id'], $sid]);
if (!$query->fetch()) {
    header('Location: /myAimBuddy/dashboard');
    exit;
}

$db->prepare("DELETE FROM user_sessions WHERE user_id = ? AND session_id = ?")
    ->execute([$_SESSION['user_id'], $sid]);

$db->prepare("DELETE FROM session_stats WHERE id = ?")
    ->execute([$sid]);

header('Location: /myAimBuddy/dashboard');
exit;