const canvas = document.getElementById("warpCanvas");
const ctx = canvas.getContext("2d");

let points = [];
let redoStack = [];

canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    points.push({ x, y });
    redoStack = [];
    console.log(`Clicked at: x=${x}, y=${y}`);

    redraw();
});

function redraw() {
    if (window._backgroundImage) {
        ctx.drawImage(window._backgroundImage, 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    for (let pt of points) {
        drawCircle(pt.x, pt.y);
    }
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

// UNDO
function undo() {
    if (points.length > 0) {
        const last = points.pop();
        redoStack.push(last);
        redraw();
    }
}

// REDO
function redo() {
    if (redoStack.length > 0) {
        const restored = redoStack.pop();
        points.push(restored);
        redraw();
    }
}

// Buttons
document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("redoBtn").addEventListener("click", redo);

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
    }
});
