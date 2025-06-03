import { HIGHER_THRESHOLD_VALUE, LOWER_THRESHOLD_VALUE } from "./_constants.js";
/*import { convertToGrayScale, convertToHSV, createMask } from "./utils/imageEffects.js";*/
import { findPaperCorners, warpPerspective } from "./utils/imageProcessing.js";
import { completeManualSelection } from "./handlers/selectionHandler.js";
import { points } from './handlers/selectionHandler.js';
import { computeContentCentroid, detectRingsByEllipseFit } from "./utils/targetDetection.js";
import { applyBinaryThreshold, applyDefaultBlur, applyGaussianBlur, applyMedianBlur, convertToGrayScale, convertToHSV, createMask } from "./utils/imageEffects.js";

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
    document.getElementById("status").textContent = "OpenCV.js is ready!";
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

    document.getElementById("uploadPlaceholder").style.display = "none";
    document.getElementById("loadingSpinner").style.display = "flex";

    const file = event.target.files[0];
    if (!file) {
        console.error("❌ No file selected");
        document.getElementById("loadingSpinner").style.display = "none";
        document.getElementById("uploadPlaceholder").style.display = "flex";
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
    let maskImage = createMask(
        hsvImage,
        LOWER_THRESHOLD_VALUE,
        HIGHER_THRESHOLD_VALUE
    );

    let data = findPaperCorners(image, maskImage);
    let corners = data[0];
    let finalTargetImage = data[1];
    let warpedImage = null;

    const continueWithWarpedImage = (warpSrc) => {
        const centroid = computeContentCentroid(warpSrc);
        console.log("cc: ", centroid);
        cv.circle( warpSrc, new cv.Point(centroid.x, centroid.y), 1, [255, 0, 0, 255], 2);

        const ellipses = detectRingsByEllipseFit(warpSrc, {
            threshold:          100,
            minContourArea:     10,
            centerTolerance:    5,
            axisRatioTolerance: 0.5,
            maxEllipseCount:    10
        });
        console.log("Detected ellipses:", ellipses);

        for (let e of ellipses) {
            const ex = e.center.x;
            const ey = e.center.y;

            const ax = e.size.width  / 2;
            const ay = e.size.height / 2;
            const angle = e.angle;

            cv.ellipse(warpSrc, new cv.Point(ex, ey), new cv.Size(ax, ay), angle, 0, 360, [255, 0, 0, 255], 2);
        }

        let hsvImageNew = convertToHSV(warpSrc);

        cv.imshow("warpCanvas", warpSrc);
        hsvImageNew.delete();

        saveImageToCanvas(warpCanvas);
        warpSrc.delete();

        uploadDisabled = true;
        console.log("✅ Upload done, rings detected, click disabled.");
    };

    if (corners == null) {
        console.log("❌ Automatic detection failed. Switching to manual corner selection...");

        document.getElementById("loadingSpinner").style.display = "none";
        document.getElementById("contentArea").style.display = "flex";

        warpedImage = image.clone();
        cv.imshow("warpCanvas", warpedImage);
        saveImageToCanvas(warpCanvas);

        const doneBtn = document.createElement("button");
        doneBtn.textContent = "Done";
        doneBtn.id = "completeSelectionBtn";
        doneBtn.style.marginTop = "10px";
        doneBtn.onclick = () => {
            const orderedPoints = points.map((p) => [p.x, p.y]);
            let manuallyWarped = warpPerspective(image, orderedPoints);

            document.getElementById("completeSelectionBtn").remove();
            continueWithWarpedImage(manuallyWarped);
            image.delete();
        };
        document.querySelector(".control-panel").appendChild(doneBtn);

        uploadDisabled = true;
        return;
    }

    warpedImage = warpPerspective(finalTargetImage, corners);
    finalTargetImage.delete();

    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("contentArea").style.display = "flex";

    continueWithWarpedImage(warpedImage);

    image.delete();
    grayImage.delete();
    hsvImage.delete();
    maskImage.delete();
    console.log("Finished cleanup");

    const uploadBox = document.getElementById("uploadBox");
    uploadBox.style.outlineStyle = "solid";
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
        document.getElementById("status").textContent =
        "Failed to load OpenCV.js!";
    }
}

export function resetApp() {
    const fi = document.getElementById("fileInput");
    fi.value = "";

    const uploadBox = document.getElementById("uploadBox");
    uploadBox.style.outlineStyle = "dashed";

    document.getElementById("uploadPlaceholder").style.display = "flex";
    uploadPlaceholder.style.flexDirection = "column";
    uploadPlaceholder.style.alignItems = "center";
    uploadPlaceholder.style.justifyContent = "center";
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("contentArea").style.display = "none";

    const canvas = document.getElementById("warpCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const doneBtn = document.getElementById("completeSelectionBtn");
    if (doneBtn) doneBtn.remove();

    delete window._backgroundImage;

    uploadDisabled = false;
}

checkOpenCv();