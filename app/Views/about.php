<link rel="stylesheet" href="styles/about.css"/>

<?php
$pageTitle = 'MyAimBuddy | About';
$includeScripts = [
    ['src' => './scripts/design/navbar.js',  'module' => false],
    ['src' => './scripts/design/darkmode.js',  'module' => false],
];
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';
?>

<div class="about-page">
    <h2 class="title">About</h2>
    <p class="message">
        MyAimBuddy is a web application for evaluating shooting accuracy. Users upload a photo of their target, and OpenCV.js automatically detects the paper corners, warps the 
        image to a top‐down view, fits ellipses to the scoring rings, and computes a numerical score for each shot. If automatic corner detection fails , 
        manual corner selection guides you to click the four corners yourself.
    </p>
</div>

<?php
require __DIR__ . '/layouts/footer.php';