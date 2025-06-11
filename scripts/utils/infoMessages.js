const messageBox = document.getElementById('globalMessage');
const messageText = messageBox.querySelector('.message');
const closeBtn = document.getElementById('closeMessage');

closeBtn.addEventListener('click', () => {
    messageBox.style.visibility = 'hidden';
    clearTimeout(hideTimer);
});

const TYPES = ['success','alert','danger','info'];

let hideTimer = null;

/**
 * Shows message
 * @param {'success'|'alert'|'danger'|'info'} type 
 * @param {string} text 
 */
export function showMessage(type, text) {
    if (!TYPES.includes(type)) 
        type = 'info';

    clearTimeout(hideTimer);

    TYPES.forEach(t => messageBox.classList.remove(t));
    messageBox.classList.add(type);
    messageText.textContent = text;

    messageBox.style.visibility = 'visible';

    hideTimer = setTimeout(() => {
        messageBox.style.visibility = 'hidden';
    }, 3000);
}