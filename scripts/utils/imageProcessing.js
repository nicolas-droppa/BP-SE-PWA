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

export function findPaperCorners(mask) {
    let contours = findContoursInMask(mask);
    console.log("Countours", contours.size());

    if (contours.size() == 0)
        console.error("Target not detected!");

    let largestContour = getLargestContour(contours);
    console.log(largestContour);

    contours.delete();
}