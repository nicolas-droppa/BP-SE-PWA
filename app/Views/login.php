<link rel="stylesheet" href="styles/register.css"/>

<?php
$pageTitle = 'MyAimBuddy | Login';
$includeScripts = [
    ['src' => './scripts/validators/validateLogin.js', 'module' => false],
    ['src' => './scripts/design/navbar.js', 'module' => false],
    ['src' => './scripts/utils/infoMessages.js', 'module' => true],
];
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';
?>

<div class="register-page">
    <h2 class="title">Login to Your Account</h2>
    <form action="/myAimBuddy/login" method="POST" class="register-form">
        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="text" id="email" name="email" placeholder="john@example.com"/>
            <div class="error-message"></div>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password"/>
            <div class="error-message"></div>
        </div>

        <button type="submit" class="button submit-btn">
        <i class="fa-solid fa-right-to-bracket"></i> Login
        </button>
    </form>

    <p class="login-link">
        Don't have an account? <a href="/myAimBuddy/register">Register here</a>.
    </p>
</div>

<?php
require __DIR__ . '/layouts/footer.php';
?>