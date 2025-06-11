<link rel="stylesheet" href="styles/register.css"/>

<?php
$pageTitle = 'MyAimBuddy | Register';
$includeScripts = [
    ['src' => './scripts/validators/validateRegister.js', 'module' => false],
    ['src' => './scripts/design/navbar.js', 'module' => false],
    ['src' => './scripts/utils/infoMessages.js', 'module' => true],
];
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';
?>

<div class="register-page">
    <h2 class="title">Create Your Account</h2>
    <form action="/myAimBuddy/register" method="POST" class="register-form">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="John Doe"/>
            <div class="error-message"></div>
        </div>

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

        <div class="form-group">
            <label for="confirm_password">Confirm Password</label>
            <input type="password" id="confirm_password" name="confirm_password" placeholder="Re-enter password"/>
            <div class="error-message"></div>
        </div>

        <button type="submit" class="button submit-btn">
            <i class="fa-solid fa-user-plus"></i> Register
        </button>
    </form>
    <p class="login-link">
        Already have an account? 
        <a href="/myAimBuddy/login">Log in here</a>.
    </p>
</div>

<?php
require __DIR__ . '/layouts/footer.php';
?>