<link rel="stylesheet" href="styles/404.css"/>

<?php
http_response_code(404);
$pageTitle = '404 | Page Not Found';
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';
?>

<div class="error-page">
    <h2 class="title">404</h2>
    <p class="message">
        Oops! The page you’re looking for can’t be found.
    </p>
    <a href="/myAimBuddy" class="button">
        <i class="fa-solid fa-arrow-left"></i>
        Back Home
    </a>
</div>

<?php
require __DIR__ . '/layouts/footer.php';