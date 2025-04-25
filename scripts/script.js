import { HIGHER_THRESHOLD_VALUE, LOWER_THRESHOLD_VALUE } from "./_constants.js";
import { convertToGrayScale, convertToHSV, createMask } from "./utils/imageEffects.js";
import { findPaperCorners, warpPerspective } from "./utils/imageProcessing.js";

/*import { func } from "./utils/autoDetectionScript.js"; Postponed for later... */

document.addEventListener("DOMContentLoaded", function () {
    if (cv.getBuildInformation) {
        onOpenCvReady();
    } else {
        cv.onRuntimeInitialized = onOpenCvReady;
    }

    document.getElementById("fileInput").addEventListener("change", onFileUpload);
});

function onOpenCvReady() {
    console.log("✅ OpenCV.js is fully loaded and initialized!");
    document.getElementById('status').textContent = "OpenCV.js is ready!";
}

function onFileUpload(event) {
    if (!cv || !cv.imread) {
        console.error("❌ OpenCV is not fully loaded yet.");
        return;
    }

    const file = event.target.files[0];
    if (!file) {
        console.error("❌ No file selected");
        return;
    }

    const imgElement = new Image();
    const reader = new FileReader();
    
    reader.onload = function(e) {
        imgElement.src = e.target.result;
    };
    reader.readAsDataURL(file);

    imgElement.onload = function() {
        let image = cv.imread(imgElement);
        console.log("Image Matrix:", image);

        let grayImage = convertToGrayScale(image);
        console.log("Grayscale image:", grayImage);

        let hsvImage = convertToHSV(image);
        console.log("Hsv image", hsvImage);

        let maskImage = createMask(hsvImage, LOWER_THRESHOLD_VALUE, HIGHER_THRESHOLD_VALUE);
        console.log("Mask image", maskImage);

        let data = findPaperCorners(image, maskImage);
        let corners = data[0];
        let finalTargetImage = data[1];
        console.log("Corners:", corners);
        console.log("Final target ROI:", finalTargetImage);

        let warpedImage = warpPerspective(finalTargetImage, corners);
        finalTargetImage.delete();

        //cv.imshow("canvas", image);
        //cv.imshow("grayCanvas", grayImage);
        //cv.imshow("hsvCanvas", hsvImage);
        //cv.imshow("maskCanvas", maskImage);
        const canvas = document.getElementById("warpCanvas");
        canvas.style.display = "block";
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        cv.imshow("warpCanvas", warpedImage);

        document.querySelector(".button-row").style.display = "flex";
        document.getElementById("uploadPlaceholder").style.display = "none";

        image.delete();
        grayImage.delete();
        hsvImage.delete();
        maskImage.delete();

        saveImageToCanvas(document.getElementById("warpCanvas"));

        warpedImage.delete();
    };
}

function saveImageToCanvas(canvas) {
    const savedCanvas = document.createElement("canvas");
    savedCanvas.width = canvas.width;
    savedCanvas.height = canvas.height;
    const savedCtx = savedCanvas.getContext("2d");
    savedCtx.drawImage(canvas, 0, 0);

    window._backgroundImage = savedCanvas;
}

// Check if OpenCV is loaded
function checkOpenCv() {
    if (typeof cv !== "undefined" && cv.onRuntimeInitialized) {
        console.log("✅ OpenCV.js script found!");
        cv.onRuntimeInitialized = onOpenCvReady;
    } else {
        console.log("❌ OpenCV.js is not loaded.");
        document.getElementById("status").textContent = "Failed to load OpenCV.js!";
    }
}

checkOpenCv();