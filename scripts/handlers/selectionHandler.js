import { warpPerspective } from "../utils/imageProcessing.js";
import { saveImageToCanvas } from "../script.js";
import { resetApp } from "../script.js";
import { getScore } from './scoringSystem.js';

const canvas = document.getElementById("warpCanvas");
const ctx = canvas.getContext("2d");

const currentPointsContainer = document.querySelector(".current-points");

canvas.style.cursor = "none";

export let points = [];
let redoStack = [];

let mouseX = 0;
let mouseY = 0;

const previewRadius = 5;

function updatePointsUI() {
    currentPointsContainer.innerHTML = "";

    points.forEach((point, i) => {
        const ellipse = window._currentEllipse;
        if (!ellipse) {
            console.warn("Elipsa ešte nebola detegovaná");
            return;
        }

        const score = getScore(point, ellipse);
        console.log("Score:", score);

        const item = document.createElement("div");
        item.classList.add("point-item");

        const details = document.createElement("div");
        details.classList.add("point-details");
        const header = document.createElement("div");
        header.classList.add("point-header");
        header.textContent = `Point ${i + 1}`;
        details.appendChild(header);
        
        const xLine = document.createElement("div");
        xLine.textContent = `x: ${point.x.toFixed(0)}`;
        const yLine = document.createElement("div");
        yLine.textContent = `y: ${point.y.toFixed(0)}`;
        details.appendChild(xLine);
        details.appendChild(yLine);

        
        const right = document.createElement("div");
        right.style.display = "flex";
        right.style.alignItems = "center";

        const values = document.createElement("div");
        values.classList.add("point-values");
        values.textContent = `9.8`;
        right.appendChild(values);

        const del = document.createElement("i");
        del.className = "fa-solid fa-xmark delete-icon";
        del.addEventListener("click", () => {
            points.splice(i, 1);
            updatePointsUI();
            drawAll();
        });
        right.appendChild(del);

        item.appendChild(details);
        item.appendChild(right);
        currentPointsContainer.appendChild(item);
    });
}

function drawAll() {
    if (window._backgroundImage) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(window._backgroundImage, 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    for (let pt of points)
        drawCircle(pt.x, pt.y, 5, "red", true);

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

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top)  * scaleY;
    drawAll();
});

canvas.addEventListener("click", (e) => {
    points.push({ x: mouseX, y: mouseY });
    redoStack = [];
    console.log(`Clicked at: x=${mouseX.toFixed(0)}, y=${mouseY.toFixed(0)}`);
    drawAll();
    updatePointsUI();
});

// Undo / Redo
function undo() {
    if (points.length) {
        redoStack.push(points.pop());
        drawAll();
        updatePointsUI();
    }
}

function redo() {
    if (redoStack.length) {
        points.push(redoStack.pop());
        drawAll();
        updatePointsUI();
    }
}

document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("redoBtn").addEventListener("click", redo);

function newImage(e) {
    e.stopPropagation();
    points.length = 0;
    redoStack.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAll();
    updatePointsUI();
    resetApp();
}

document.getElementById("resetBtn").addEventListener("click", newImage);

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
    }
    if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
    }
});

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
