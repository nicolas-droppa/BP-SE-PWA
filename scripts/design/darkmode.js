const button = document.getElementById('dayNightButton');

function applyDarkMode() {
    const darkMode = localStorage.getItem('dark-mode');
    if (darkMode == 'enabled') {
        document.body.classList.add('dark-mode');
        button.textContent = "Day";
    } else {
        document.body.classList.remove('dark-mode');
        button.textContent = "Night";
    }
}

applyDarkMode();

button.addEventListener('click', () => {
    const darkMode = localStorage.getItem('dark-mode');

    if (darkMode == 'enabled') {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
        button.textContent = "Night";
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'enabled');
        button.textContent = "Day";
    }
});