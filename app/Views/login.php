<link rel="stylesheet" href="styles/register.css"/>

<?php
if (!empty($_SESSION['user_id'])) {
    header('Location: /myAimBuddy/dashboard');
    exit;
}

$pageTitle = 'MyAimBuddy | Login';
$includeScripts = [
    ['src' => './scripts/validators/validateLogin.js', 'module' => false],
    ['src' => './scripts/design/navbar.js', 'module' => false],
    ['src' => './scripts/utils/infoMessages.js', 'module' => true],
    ['src' => './scripts/design/darkmode.js',  'module' => false],
];
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';

$flash = $_SESSION['flash'] ?? [];
unset($_SESSION['flash']);

$errors = $flash['errors'] ?? [];
$oldValues = $flash['oldValues'] ?? [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $oldValues['email'] = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($oldValues['email'] == '' || !filter_var($oldValues['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email address';
    }
    if ($password == '') {
        $errors['password'] = 'Please enter your password';
    }

    if (empty($errors)) {
        try {
            $stmt = $db->prepare('SELECT id, name, password FROM users WHERE email = :email');
            $stmt->execute(['email' => $oldValues['email']]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                header('Location: /myAimBuddy/dashboard');
                exit;
            } else {
                $errors['general'] = 'Invalid email or password';
            }
        } catch (PDOException $e) {
            $errors['general'] = 'A db error has occurred';
        }
    }

    $_SESSION['flash'] = [
        'errors' => $errors,
        'oldValues' => $oldValues,
    ];
    header('Location: /myAimBuddy/login');
    exit;
}

?>

<div class="info-message success" id="globalMessage">
    <div class="message">Placeholder text, testing messages…</div>
    <button id="closeMessage">
        <i class="fa-solid fa-xmark"></i>
    </button>
</div>

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

<?php if (!empty($errors['general'])): ?>
    <script type="module">
        import { showMessage } from './scripts/utils/infoMessages.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            showMessage('alert', <?= json_encode($errors['general']) ?>);
        });
    </script>
<?php endif; ?>

<?php
require __DIR__ . '/layouts/footer.php';
?>