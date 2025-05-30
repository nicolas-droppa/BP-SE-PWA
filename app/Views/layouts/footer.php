</main>

<?php
if (!empty($includeScripts)) {
    foreach ($includeScripts as $script) {
        $attrs = $script['module']
        ? 'type="module"'
        : 'defer';
        printf('<script %s src="%s"></script>' . "\n",
        $attrs,
        htmlspecialchars($script['src'], ENT_QUOTES)
        );
    }
}
?>

<footer>
    <p>© 2025 MyAimBuddy | Nicolas Droppa – bachelor thesis</p>
</footer>
</body>
</html>