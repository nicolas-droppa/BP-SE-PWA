import { HIGHER_THRESHOLD_VALUE, LOWER_THRESHOLD_VALUE } from "./_constants.js";
import { convertToGrayScale, convertToHSV, createMask } from "./utils/imageEffects.js";
import { findPaperCorners, warpPerspective } from "./utils/imageProcessing.js";
import { completeManualSelection } from "./handlers/selectionHandler.js";

/*import { func } from "./utils/autoDetectionScript.js"; Postponed for later... */

document.addEventListener("DOMContentLoaded", function () {
    if (cv.getBuildInformation) {
        onOpenCvReady();
    } else {
        cv.onRuntimeInitialized = onOpenCvReady;
    }

    const fileInput = document.getElementById("fileInput");
    const uploadBox = document.getElementById("uploadBox");

    fileInput.addEventListener("change", onFileUpload);

    uploadBox.addEventListener("click", openFileInput);
});

function onOpenCvReady() {
    console.log("✅ OpenCV.js is fully loaded and initialized!");
    document.getElementById('status').textContent = "OpenCV.js is ready!";
}

function openFileInput(e) {
    if (uploadDisabled) return;

    document.getElementById("fileInput").click();
}

let uploadDisabled = false;

function onFileUpload(event) {
    if (!cv || !cv.imread) {
        console.error("❌ OpenCV is not fully loaded yet.");
        return;
    }

    document.getElementById('uploadPlaceholder').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'flex';

    const file = event.target.files[0];
    if (!file) {
        console.error("❌ No file selected");

        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('uploadPlaceholder').style.display = 'flex';
        return;
    }


    const imgElement = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
        imgElement.src = e.target.result;
    };
    reader.readAsDataURL(file);

    imgElement.onload = function () {
        let image = cv.imread(imgElement);
        console.log("Image Matrix:", image);

        let grayImage = convertToGrayScale(image);
        let hsvImage = convertToHSV(image);
        let maskImage = createMask(hsvImage, LOWER_THRESHOLD_VALUE, HIGHER_THRESHOLD_VALUE);

        let data = findPaperCorners(image, maskImage);
        let corners = data[0];
        let finalTargetImage = data[1];

        /**
         * Handle no corners detected automatically
         */
        if (corners == null) {
            console.log("❌ Automatic detection failed. Switching to manual corner selection...");
        
            document.getElementById("loadingSpinner").style.display = "none";
            document.getElementById("contentArea").style.display = "flex";
        
            cv.imshow("warpCanvas", image);
            saveImageToCanvas(warpCanvas);
        
            const doneBtn = document.createElement("button");
            doneBtn.textContent = "Done";
            doneBtn.id = "completeSelectionBtn";
            doneBtn.style.marginTop = "10px";
            doneBtn.onclick = () => completeManualSelection(image);
            document.querySelector(".control-panel").appendChild(doneBtn);

            uploadDisabled = true;
            return;
        }

        let warpedImage = warpPerspective(finalTargetImage, corners);
        finalTargetImage.delete();

        document.getElementById("loadingSpinner").style.display = "none";
        document.getElementById("uploadPlaceholder").style.display = "none";
        document.getElementById("contentArea").style.display = "flex";
        document.getElementById('loadingSpinner').style.display = 'none';

        cv.imshow("warpCanvas", warpedImage);

        image.delete();
        grayImage.delete();
        hsvImage.delete();
        maskImage.delete();
        warpedImage.delete();

        saveImageToCanvas(warpCanvas);

        uploadDisabled = true;
        document.getElementById("uploadPlaceholder").style.display = "none";
        console.log("✅ Upload done, click disabled, now free to interact.");
    };
}

export function saveImageToCanvas(canvas) {
    const savedCanvas = document.createElement("canvas");
    savedCanvas.width = canvas.width;
    savedCanvas.height = canvas.height;
    const savedCtx = savedCanvas.getContext("2d");
    savedCtx.drawImage(canvas, 0, 0);

    window._backgroundImage = savedCanvas;
}

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
