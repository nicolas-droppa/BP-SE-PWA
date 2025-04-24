/*
* Idea stored for later if time remains - basically detects from hsv green dots and makes circles from groups...
*/

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
let kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3));
cv.dilate(greenMask, greenMask, kernel);
kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(4, 4));
cv.morphologyEx(greenMask, greenMask, cv.MORPH_CLOSE, kernel);

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

    let margin = 20;
    if (
        radius > 5 &&
        center.x > margin &&
        center.x < warpedImage.cols - margin &&
        center.y > margin &&
        center.y < warpedImage.rows - margin
    ) {
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
cv.imshow("warpCanvas", warpedImage);