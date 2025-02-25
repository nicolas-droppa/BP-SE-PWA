import { COLOR_RED, DEV_MODE, TARGET_MARGIN_ROI_PIXELS } from "../_constants.js";

/**
 * Finds contours in the mask image
 * 
 * @param {cv.Mat} mask - Binary image used for contour detection
 * @returns {cv.MatVector} - The contours
 */
export function findContoursInMask(mask) {
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    
    cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    console.log(hierarchy);

    hierarchy.delete();
    return contours;
}

/**
 * Returns the largest contour
 * 
 * @param {cv.MatVector} contours - List of contours
 * @returns {cv.Mat} - Largest contour
 */
export function getLargestContour(contours) {
    let largestContour = contours.get(0);
    let maxArea = cv.contourArea(largestContour);

    for (let i = 1; i < contours.size(); i++) {
        let contour = contours.get(i);
        let area = cv.contourArea(contour);
        if (area > maxArea) {
            largestContour = contour;
            maxArea = area;
        }
    }
    
    return largestContour;
}

/**
 * Draws the largest contour on the image with a bounding box
 * 
 * @param {cv.Mat} image - Input image
 * @param {cv.MatVector} contours - List of contours
 * @param {cv.Scalar} color - Color of bounding box
 * @param {number} thickness - The thickness of lines
 */
export function markLargestContour(image, contours, color, thickness) {
    let largestContour = getLargestContour(contours);

    let rect = cv.boundingRect(largestContour);
    let x = rect.x;
    let y = rect.y;
    let w = rect.width;
    let h = rect.height;

    let pt1 = new cv.Point(x, y); // Top-left corner
    let pt2 = new cv.Point(x + w, y + h); // Bottom-right corner

    cv.rectangle(image, pt1, pt2, color, thickness);
}

/**
 * Based on largest contour creates target's roi
 * 
 * 
 */
export function getTargetRegionOfInterest(image, contours) {
    let largestContour = getLargestContour(contours);

    let rect = cv.boundingRect(largestContour);
    let x = Math.max(0, rect.x - TARGET_MARGIN_ROI_PIXELS);
    let y = Math.max(0, rect.y - TARGET_MARGIN_ROI_PIXELS);
    let w = Math.min(image.cols - x, rect.width + 2 * TARGET_MARGIN_ROI_PIXELS);
    let h = Math.min(image.rows - y, rect.height + 2 * TARGET_MARGIN_ROI_PIXELS);

    let roi = image.roi(new cv.Rect(x, y, w, h));

    return roi;
}

export function findPaperCorners(originalImage, mask) {
    let contours = findContoursInMask(mask);
    console.log("Countours", contours.size());

    if (contours.size() == 0)
        console.error("Target not detected!");

    let largestContour = getLargestContour(contours);
    console.log(largestContour);

    // TODO : NEW IMAGE NEEDS TO BE CREATED
    if (DEV_MODE)
        markLargestContour(originalImage, contours, COLOR_RED, 3);

    let targetRoiImage = getTargetRegionOfInterest(originalImage, contours);
    cv.imshow("targetRoiCanvas", targetRoiImage);

    contours.delete();
}