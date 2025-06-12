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
];
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';
?>

<div class="info-message success" id="globalMessage">
    <div class="message">Placeholder text, testing messages…</div>
    <button id="closeMessage">
        <i class="fa-solid fa-xmark"></i>
    </button>
</div>

<div class="dashboard-page">
    <h2 class="title">Welcome, <?= htmlspecialchars($_SESSION['user_name']) ?>!</h2>
</div>

<?php
require __DIR__ . '/layouts/footer.php';
?>
