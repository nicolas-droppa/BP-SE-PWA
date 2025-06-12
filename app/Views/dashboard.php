<link rel="stylesheet" href="/myAimBuddy/styles/dashboard.css"/>

<?php
if (empty($_SESSION['user_id'])) {
    header('Location: /myAimBuddy/');
    exit;
}

$pageTitle = 'MyAimBuddy | Dashboard';
$includeScripts = [
    ['src' => './scripts/design/navbar.js', 'module' => false],
    ['src' => './scripts/utils/infoMessages.js', 'module' => true],
    ['src' => './scripts/design/darkmode.js',  'module' => false],
];
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';

$query = $db->prepare("
    SELECT s.id, s.recorded_at,
        s.total_shots, s.best_score, s.worst_score, s.average_score,
        s.mean_radius_mm, s.variance_mm2, s.consistency_mm,
        s.elevation_mm, s.windage_mm, s.max_spread_mm
    FROM session_stats s
    JOIN user_sessions us ON us.session_id = s.id
    WHERE us.user_id = :uid
    ORDER BY s.recorded_at DESC
");
$query->execute(['uid' => $_SESSION['user_id']]);
$sessions = $query->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="info-message success" id="globalMessage">
    <div class="message">Placeholder text, testing messages…</div>
    <button id="closeMessage">
        <i class="fa-solid fa-xmark"></i>
    </button>
</div>

<div class="dashboard-page">
    <h2 class="title">Hi <span><?= $_SESSION['user_name'] ?></span>, your sessions:</h2>

    <?php if (empty($sessions)): ?>
        <p class="no-sessions"> No data recorded</p>
    <?php else: ?>
        <div class="table-container">
            <table class="sessions-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Best</th>
                        <th>Worst</th>
                        <th>Avg</th>
                        <th>Mean Rad (mm)</th>
                        <th>Var (mm²)</th>
                        <th>Consist (mm)</th>
                        <th>Elev (mm)</th>
                        <th>Wind (mm)</th>
                        <th>Spread (mm)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($sessions as $row): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['id']) ?></td>
                        <td><?= date('Y-m-d H:i', strtotime($row['recorded_at'])) ?></td>
                        <td><?= htmlspecialchars($row['total_shots']) ?></td>
                        <td><?= number_format($row['best_score'], 1) ?></td>
                        <td><?= number_format($row['worst_score'], 1) ?></td>
                        <td><?= number_format($row['average_score'], 2) ?></td>
                        <td><?= number_format($row['mean_radius_mm'], 2) ?></td>
                        <td><?= number_format($row['variance_mm2'], 3) ?></td>
                        <td><?= number_format($row['consistency_mm'], 2) ?></td>
                        <td><?= number_format($row['elevation_mm'], 2) ?></td>
                        <td><?= number_format($row['windage_mm'], 2) ?></td>
                        <td><?= number_format($row['max_spread_mm'], 2) ?></td>
                        <td class="actions">
                            <a href="/myAimBuddy/shots/delete.php?id=<?= $row['id'] ?>" class="danger">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<?php
require __DIR__ . '/layouts/footer.php';
?>
