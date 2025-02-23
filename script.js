let openCvReady = false;

// This function will be called when OpenCV.js finishes loading
function onOpenCvReady() {
    console.log("✅ OpenCV.js is fully loaded and initialized!");
    openCvReady = true;

    // Check if 'cv.imread' is available
    if (cv.imread) {
        console.log("✅ cv.imread is available!");
    } else {
        console.error("❌ cv.imread is not available!");
    }
}

// Check if OpenCV is ready and start processing the image
document.getElementById('fileInput').addEventListener('change', (event) => {
    // Wait until OpenCV is fully initialized before processing the image
    if (!openCvReady) {
        console.log("⏳ Waiting for OpenCV to finish initializing...");
        return;
    }

    let file = event.target.files[0];
    if (!file) return;

    let img = new Image();
    img.onload = () => processImage(img);
    img.src = URL.createObjectURL(file);
});

function processImage(img) {
    // Ensure OpenCV is initialized before processing the image
    if (!openCvReady) {
        console.error("❌ OpenCV.js is not initialized yet!");
        return;
    }

    // Log cv object to check availability of methods like 'imread'
    console.log("OpenCV object:", cv);

    // Check if cv.imread is available
    if (typeof cv.imread !== 'function') {
        console.error("❌ cv.imread is not available. Something went wrong with OpenCV.js.");
        return;
    }

    let originalCanvas = document.getElementById('originalCanvas');
    let processedCanvas = document.getElementById('processedCanvas');
    let ctx = originalCanvas.getContext('2d');
    
    // Draw image on the canvas
    originalCanvas.width = img.width;
    originalCanvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Ensure that OpenCV.js can access the canvas
    let src = cv.imread(originalCanvas);  // Corrected: use cv.imread for canvas
    let dst = new cv.Mat();

    // Convert the image to grayscale
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

    // Apply a binary threshold
    cv.threshold(src, dst, 127, 255, cv.THRESH_BINARY);

    // Show the processed image on the second canvas
    cv.imshow('processedCanvas', dst);

    // Clean up memory
    src.delete();
    dst.delete();
}