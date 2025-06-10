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

let previewRadius = 5;
let brushSlider, brushValueDisplay;
let minPreviewRadius, maxPreviewRadius;

document.addEventListener("DOMContentLoaded", () => {
    brushSlider = document.getElementById("brushSize");
    brushValueDisplay = document.getElementById("brushSizeValue");

    minPreviewRadius = Number(brushSlider.min);
    maxPreviewRadius = Number(brushSlider.max);

    brushValueDisplay.textContent = brushSlider.value;
    previewRadius = Number(brushSlider.value);

    brushSlider.addEventListener("input", (e) => {
        previewRadius = Number(e.target.value);
        brushValueDisplay.textContent = e.target.value;
        drawAll();
    });
});

function updatePointsUI() {
    currentPointsContainer.innerHTML = "";

    const countElem = document.createElement("div");
    countElem.classList.add("point-count");
    countElem.textContent = `Total points: ${points.length}`;
    currentPointsContainer.appendChild(countElem);

    if (points.length == 0)
        countElem.classList.add("hidden");
    else
        countElem.classList.remove("hidden");

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
        
        const right = document.createElement("div");
        right.style.display = "flex";
        right.style.alignItems = "center";

        const values = document.createElement("div");
        values.classList.add("point-values");
        values.textContent = `${score}`;
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
        drawCircle(pt.x, pt.y, pt.r, "red", true);

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
    points.push({ x: mouseX, y: mouseY, r: previewRadius });
    redoStack = [];
    console.log(`Clicked at: x=${mouseX.toFixed(0)}, y=${mouseY.toFixed(0)}, r=${previewRadius}`);
    drawAll();
    updatePointsUI();
});

function updateBrushUI() {
    brushSlider.value = previewRadius;
    brushValueDisplay.textContent = previewRadius;
    drawAll();
}

// Brush Size UP / Size DOWN
function sizeUp(jump) {
    if (jump)
        previewRadius = Math.min(maxPreviewRadius, previewRadius + 5);
    else
        previewRadius = Math.min(maxPreviewRadius, previewRadius + 1);

    updateBrushUI();
}

function sizeDown(jump) {
    if (jump)
        previewRadius = Math.max(minPreviewRadius, previewRadius - 5);
    else
        previewRadius = Math.max(minPreviewRadius, previewRadius - 1);

    updateBrushUI();
}

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
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") 
        return;

    if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
    }

    if (e.shiftKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        sizeUp(true);
        return;
    }
    if (e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        sizeDown(true);
        return;
    }
    if (e.key.toLowerCase() === "w") {
        e.preventDefault();
        sizeUp(false);
        return;
    }
    if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        sizeDown(false);
        return;
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
