import { HIGHER_THRESHOLD_VALUE, LOWER_THRESHOLD_VALUE } from "./_constants.js";
import { convertToGrayScale, convertToHSV, createMask } from "./utils/imageEffects.js";
import { findPaperCorners, warpPerspective } from "./utils/imageProcessing.js";

import { drawMinEnclosingCircleFromBrightSpots } from "./utils/testScript.js";

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
        cv.imshow("warpCanvas", warpedImage);
        
        
        let hsvImageRoi = convertToHSV(warpedImage);
        let bluredImage = new cv.Mat();
        cv.GaussianBlur(hsvImageRoi, bluredImage, new cv.Size(5, 5), 1, 1, cv.BORDER_DEFAULT);
        let bluredImage2 = new cv.Mat();
        cv.medianBlur(bluredImage, bluredImage2, 5);
        let bluredImage3 = new cv.Mat();
        cv.blur(bluredImage2, bluredImage3, new cv.Size(5, 5));
        cv.imshow("warpCanvas", bluredImage3);

// Detect and draw circles around bright green areas
let greenMask = new cv.Mat();
// Green in HSV: H ~ [35, 85], S/V ~ [100, 255]
let lowerGreen = new cv.Mat(bluredImage3.rows, bluredImage3.cols, bluredImage3.type(), [80, 100, 0, 0]); // Lower bound for green range
let upperGreen = new cv.Mat(bluredImage3.rows, bluredImage3.cols, bluredImage3.type(), [100, 255, 255, 255]); // Upper bound for green range

cv.inRange(bluredImage3, lowerGreen, upperGreen, greenMask);

cv.imshow("warpCanvas", greenMask);

// Morphology to clean up small noise
let kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(2, 2));
cv.dilate(greenMask, greenMask, kernel);
kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3));
cv.morphologyEx(greenMask, greenMask, cv.MORPH_OPEN, kernel);

cv.imshow("warpCanvas", greenMask);

// Find contours in the mask
let contours = new cv.MatVector();
let hierarchy = new cv.Mat();
cv.findContours(greenMask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

// Draw enclosing circles
for (let i = 0; i < contours.size(); ++i) {
    let cnt = contours.get(i);
    if (cnt.rows < 5) {  // Skip small blobs
        cnt.delete();
        continue;
    }

    // Convert contour to float
    let floatCnt = new cv.Mat();
    cnt.convertTo(floatCnt, cv.CV_32F);

    // Get enclosing circle
    let minCircle = cv.minEnclosingCircle(floatCnt);  // Returns a tuple [center, radius]

    let center = minCircle.center;
    let radius = minCircle.radius;

    if (radius) {
        cv.circle(warpedImage, center, radius, new cv.Scalar(0, 255, 0, 255), 2);
        console.log(`Circle ${i + 1}: Center = (${center.x}, ${center.y}), Radius = ${radius}`);
    }

    cnt.delete();
    floatCnt.delete();
}

// Clean up
greenMask.delete();
kernel.delete();
contours.delete();
hierarchy.delete();
lowerGreen.delete();
upperGreen.delete();
hsvImageRoi.delete();

// Show final result
//cv.imshow("warpCanvas", warpedImage);


        image.delete();
        grayImage.delete();
        hsvImage.delete();
        maskImage.delete();

        document.getElementById("canvasBox").style.display = "inline-block";

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