document.addEventListener('DOMContentLoaded', () => {
    const form       = document.querySelector('.register-form');
    const nameInput  = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passInput  = document.getElementById('password');
    const confirmInput = document.getElementById('confirm_password');

    [nameInput, emailInput, passInput, confirmInput].forEach(i => i.removeAttribute('required'));

    form.addEventListener('submit', e => {
        e.preventDefault();
        let hasError = false;

        function setError(input, msg) {
            const err = input.parentElement.querySelector('.error-message');
            err.textContent = msg;
            hasError = true;
        }

        form.querySelectorAll('.error-message').forEach(div => div.textContent = '');

        if (!nameInput.value.trim())
        setError(nameInput, 'Please enter your name');

        const emailVal = emailInput.value.trim();
        if (!emailVal)
            setError(emailInput, 'Please enter your email.');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            setError(emailInput, 'Please enter a valid email address');

        const passVal = passInput.value;
        if (!passVal)
            setError(passInput, 'Please choose a password.');
        else if (passVal.length < 6)
            setError(passInput, 'Password must be at least 6 characters');

        const confirmVal = confirmInput.value;
        if (!confirmVal)
            setError(confirmInput, 'Please confirm your password');
        else if (confirmVal !== passVal)
            setError(confirmInput, 'Passwords do not match');

        if (!hasError)
            form.submit();
    });
});