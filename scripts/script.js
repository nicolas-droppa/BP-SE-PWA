import { convertToGrayScale, convertToHSV } from "./utils/imageEffects.js";

document.addEventListener("DOMContentLoaded", function () {
    if (cv.getBuildInformation) {
        onOpenCvReady();
    } else {
        cv.onRuntimeInitialized = onOpenCvReady;
    }

    document.getElementById("fileInput").addEventListener("change", onFileUpload);
});

// Function to be called when OpenCV is loaded
function onOpenCvReady() {
    console.log("✅ OpenCV.js is fully loaded and initialized!");
    document.getElementById('status').textContent = "OpenCV.js is ready!";
}

// Function to process the uploaded image
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
        console.log("Converted to Grayscale:", grayImage);

        let hsvImage = convertToHSV(image);
        console.log("hsv image", hsvImage);

        cv.imshow("canvas", hsvImage);

        image.delete();
        //grayImage.delete();
    };
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

// Call the function to check OpenCV
checkOpenCv();