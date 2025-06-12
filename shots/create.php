<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../session.php';

header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
    header('Location: /myAimBuddy/');
    exit;
}

$total = $_POST['total_shots'] ?? 0;
$best = $_POST['best_score'] ?? 0;
$worst = $_POST['worst_score'] ?? 0;
$avg = $_POST['average_score'] ?? 0;
$rad = $_POST['mean_radius_mm'] ?? 0;
$var = $_POST['variance_mm2'] ?? 0;
$mad = $_POST['consistency_mm'] ?? 0;
$elev = $_POST['elevation_mm'] ?? 0;
$wind = $_POST['windage_mm'] ?? 0;
$spread = $_POST['max_spread_mm'] ?? 0;

try {
    $query = $db->prepare("
        INSERT INTO session_stats
            (total_shots, best_score, worst_score, average_score,
            mean_radius_mm, variance_mm2, consistency_mm,
            elevation_mm, windage_mm, max_spread_mm)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $query->execute([
        $total, $best, $worst, $avg,
        $rad,   $var,  $mad,
        $elev,  $wind, $spread
    ]);

    $sid = $db->lastInsertId();
    $link = $db->prepare("INSERT INTO user_sessions (user_id, session_id) VALUES (?, ?)");
    $link->execute([ $_SESSION['user_id'], $sid ]);

    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    header('Location: /myAimBuddy');
    exit;
}