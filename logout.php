<?php
require __DIR__ . '/session.php';

session_unset();
session_destroy();

header('Location: /myAimBuddy');
exit;