document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.register-form');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');

    emailInput.removeAttribute('required');
    passInput.removeAttribute('required');

    form.addEventListener('submit', e => {
        e.preventDefault();
        let hasError = false;

        function setError(input, msg) {
            input.parentElement.querySelector('.error-message').textContent = msg;
            hasError = true;
        }

        form.querySelectorAll('.error-message').forEach(div => div.textContent = '');

        const emailVal = emailInput.value.trim();
        if (!emailVal)
            setError(emailInput, 'Please enter your email.');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            setError(emailInput, 'Please enter a valid email address.');

        const passVal = passInput.value;
        if (!passVal)
            setError(passInput, 'Please enter your password.');

        if (!hasError)
            form.submit();
    });
});