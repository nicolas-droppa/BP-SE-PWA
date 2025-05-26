import { warpPerspective } from "../utils/imageProcessing.js";
import { saveImageToCanvas } from "../script.js";

const canvas = document.getElementById("warpCanvas");
const ctx = canvas.getContext("2d");

canvas.style.cursor = "none";

export let points = [];
let redoStack = [];

let mouseX = 0;
let mouseY = 0;

const previewRadius = 5;

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top) * scaleY;
    drawAll();
});

canvas.addEventListener("click", (e) => {
    points.push({ x: mouseX, y: mouseY });
    redoStack = [];
    console.log(`Clicked at: x=${mouseX.toFixed(0)}, y=${mouseY.toFixed(0)}`);
    drawAll();
});

function undo() {
    if (points.length) {
        redoStack.push(points.pop());
        drawAll();
    }
}
function redo() {
    if (redoStack.length) {
        points.push(redoStack.pop());
        drawAll();
    }
}

document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("redoBtn").addEventListener("click", redo);

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        e.preventDefault(); undo();
    }
    
    if (e.ctrlKey && e.key === "y") {
        e.preventDefault(); redo();
    }
});


function drawAll() {
    if (window._backgroundImage) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(window._backgroundImage, 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    for (let pt of points) {
        drawCircle(pt.x, pt.y, 5, "red", true);
    }

    drawCircle(mouseX, mouseY, previewRadius, "white", false);
}

function drawCircle(x, y, radius, color, fill) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

export function completeManualSelection(originalImage) {
    if (points.length !== 4) {
        alert("Please select exactly 4 corners.");
        return;
    }

    const orderedPoints = points.map(p => [p.x, p.y]);
    const warped = warpPerspective(originalImage, orderedPoints);

    cv.imshow("warpCanvas", warped);

    originalImage.delete();
    warped.delete();
    document.getElementById("completeSelectionBtn")?.remove();
    saveImageToCanvas(warpCanvas);
    console.log("✅ Manual selection complete.");
}
