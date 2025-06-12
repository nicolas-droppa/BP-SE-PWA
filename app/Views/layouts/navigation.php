<?php
$userName = $_SESSION['user_name'] ?? null;
?>

<nav class="navbar">
    <div class="logo">MyAimBuddy</div>
    <ul class="nav-links">
        <li><a href="/myAimBuddy">Evaluation</a></li>
        <li><a href="/myAimBuddy/about">About</a></li>

        <?php if (!$userName): ?>
        <li><a href="/myAimBuddy/login">Login</a></li>
        <li><a href="/myAimBuddy/register">Register</a></li>
        <?php else: ?>
        <li class="dropdown">
            <a href="/myAimBuddy/dashboard" class="dropbtn"><?= htmlspecialchars($userName) ?></a>
            <ul class="dropdown-content">
                <li><a href="/myAimBuddy/dashboard">Dashboard</a></li>
                <li><a href="/myAimBuddy/logout">Logout</a></li>
            </ul>
        </li>
        <?php endif; ?>

        <li class="theme-toggle" id="dayNightButton">Day</li>
    </ul>
</nav>
<main class="container">