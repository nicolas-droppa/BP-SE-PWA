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

$flash = $_SESSION['flash'] ?? [];
unset($_SESSION['flash']);

$errors = $flash['errors'] ?? [];
$oldValues = $flash['oldValues'] ?? [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $oldValues['name'] = trim($_POST['name'] ?? '');
    $oldValues['email'] = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if ($oldValues['name'] == '') {
        $errors['name'] = 'Please enter your name';
    }

    if ($oldValues['email'] == '' || ! filter_var($oldValues['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email address';
    }

    if ($password == '') {
        $errors['password'] = 'Please choose a password';
    } elseif (strlen($password) < 6) {
        $errors['password'] = 'Password must be at least 6 characters';
    }

    if ($confirmPassword != $password) {
        $errors['confirm_password'] = 'Passwords do not match';
    }

    if (empty($errors)) {
        try {
            $stmt = $db->prepare('SELECT id FROM users WHERE email = :email');
            $stmt->execute(['email' => $oldValues['email']]);
            if ($stmt->fetch()) {
                $errors['email'] = 'This email is already registered.';
            } else {
                $hash = password_hash($password, PASSWORD_DEFAULT);
                $query = $db->prepare(
                    'INSERT INTO users (name, email, password) VALUES (:name, :email, :password)'
                );
                $query->execute([
                    'name' => $oldValues['name'],
                    'email' => $oldValues['email'],
                    'password' => $hash,
                ]);

                $_SESSION['user_id'] = $db->lastInsertId();
                $_SESSION['user_name'] = $oldValues['name'];

                header('Location: /myAimBuddy/login');
                exit;
            }
        } catch (PDOException $e) {
            $errors['general'] = 'A db error has occurred';
        }
    }

    $_SESSION['flash'] = [
        'errors' => $errors,
        'oldValues' => $oldValues,
    ];

    header('Location: /myAimBuddy/register');
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

<?php if (!empty($errors['email'])): ?>
    <script type="module">
        import { showMessage } from '/myAimBuddy/scripts/utils/infoMessages.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            showMessage('alert', <?= json_encode($errors['email']) ?>);
        });
    </script>
<?php endif; ?>

<?php
require __DIR__ . '/layouts/footer.php';
?>