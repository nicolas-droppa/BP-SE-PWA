// Function to be called when OpenCV is loaded
function onOpenCvReady() {
    console.log("✅ OpenCV.js is fully loaded and initialized!");
    document.getElementById('status').textContent = "OpenCV.js is ready!";
}

// Function to process the uploaded image
function onFileUpload(event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (!file) {
        console.error("❌ No file selected");
        return;
    }

    // Create an image element to load the file into
    const imgElement = new Image();
    const reader = new FileReader();
    
    // Once the file is read, set it as the source of the image element
    reader.onload = function(e) {
        imgElement.src = e.target.result;
    };

    reader.readAsDataURL(file); // Read the file as a data URL

    // When the image is loaded, process it using OpenCV.js
    imgElement.onload = function() {
        // Create a Mat object from the image
        let mat = cv.imread(imgElement); // Read image into Mat
        console.log("Image Matrix:", mat);

        // Optional: Convert the image to grayscale
        cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);
        console.log("Converted to Grayscale:", mat);

        // Display the image on the canvas
        cv.imshow('canvas', mat);
        mat.delete(); // Clean up memory after use
    };
}

// Check if OpenCV is loaded
function checkOpenCv() {
    if (typeof cv !== 'undefined' && cv.onRuntimeInitialized) {
        console.log("✅ OpenCV.js script found!");
        cv.onRuntimeInitialized = onOpenCvReady;  // Assign function after initialization
    } else {
        console.error("❌ OpenCV.js is not loaded. Please check your network connection or CDN link.");
        document.getElementById('status').textContent = "Failed to load OpenCV.js!";
    }
}

// Call the function to check OpenCV
checkOpenCv();