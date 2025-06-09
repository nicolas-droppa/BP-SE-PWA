<link rel="stylesheet" href="styles/about.css"/>

<?php
$pageTitle = 'MyAimBuddy | About';
$includeScripts = [
    ['src' => './scripts/design/navbar.js',  'module' => false],
];
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';
?>

<div class="about-page">
    <h2 class="title">About</h2>
    <p class="message">
        MyAimBuddy is a web application for evaluating shooting accuracy. Users upload a photo of their target, and OpenCV.js automatically detects the paper corners, warps the 
        image to a top‐down view, fits ellipses to the scoring rings, and computes a numerical score for each shot. If automatic corner detection fails or is disabled in Settings, 
        manual corner selection guides you to click the four corners yourself.
    </p>
    <p class="message">
        In Settings you can switch between <strong>Automatic</strong> and <strong>Manual</strong> corner‐selection modes, and toggle between <strong>Light</strong> and <strong>Dark</strong> themes.
    </p>
</div>

<?php
require __DIR__ . '/layouts/footer.php';