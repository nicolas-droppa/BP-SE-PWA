import { COLOR_RED, DEV_MODE, HIGHER_THRESHOLD_VALUE, LOWER_THRESHOLD_VALUE, TARGET_MARGIN_ROI_PIXELS } from "../_constants.js";
import { applyBinaryThreshold, applyDefaultBlur, applyGaussianBlur, applyMedianBlur, convertToGrayScale, convertToHSV, createMask } from "./imageEffects.js";

/**
 * Finds contours in the image
 * 
 * @param {cv.Mat} image - image used for contour detection
 * @returns {cv.MatVector} - The contours
 */
export function findContours(image) {
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    
    cv.findContours(image, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
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
 * @param {cv.Mat} image - Input image
 * @param {cv.MatVector} contours - List of contours
 * @returns {cv.Mat} - TargetROI image matrix
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

/**
 * Detects corners in target's ROI using mask
 * @param {cv.Mat} image - target's ROI
 * 
 * @returns 
 */
export function detectCornersInMask(image) {
    let hsvImage = convertToHSV(image);
    let maskImage = createMask(hsvImage, LOWER_THRESHOLD_VALUE, HIGHER_THRESHOLD_VALUE);
    hsvImage.delete();

    let mbImage = applyMedianBlur(maskImage);
    maskImage.delete();

    let gbImage = applyGaussianBlur(mbImage);
    mbImage.delete();

    let dbImage = applyDefaultBlur(gbImage);
    gbImage.delete();

    cv.imshow("targetRoiCanvas", dbImage);

    let contours = findContours(dbImage);
    // TODO: Check for no countours found and handle the case
    dbImage.delete();
    let largestContour = getLargestContour(contours);

    let corners = approximateContourToPolygon(largestContour, image);
    console.log("Corners", corners);
    cv.imshow("targetRoiCanvas", image);
}

/**
 * Detects corners in target's ROI by binary aproach
 * @param {cv.Mat} image - target's ROI
 * 
 * @returns 
 */
export function detectCornersBinary(image) {
    let grayImage = convertToGrayScale(image);

    let mbImage = applyMedianBlur(grayImage);
    grayImage.delete();

    let gbImage = applyGaussianBlur(mbImage);
    mbImage.delete();

    let dbImage = applyDefaultBlur(gbImage);
    gbImage.delete();

    let binaryImage = applyBinaryThreshold(dbImage);
    dbImage.delete();

    let dBluredImage = applyDefaultBlur(binaryImage);
    binaryImage.delete();

    let gBluredImage = applyGaussianBlur(dBluredImage);
    dBluredImage.delete();

    let mBluredImage = applyMedianBlur(gBluredImage);
    gBluredImage.delete();

    let contours = findContours(mBluredImage);
    // TODO: Check for no countours found and handle the case
    mBluredImage.delete();
    let largestContour = getLargestContour(contours);

    approximateContourToPolygon(largestContour, image);

    cv.imshow("targetRoiCanvas", image);
}

/**
 * approximates largest contour to a polygon and if it is
 * quadrilateral, function returns paper corners
 * @param {cv.Mat} largestContour 
 */
export function approximateContourToPolygon(largestContour, image) {
    let epsilon = 0.02 * cv.arcLength(largestContour, true);
    let approx = new cv.Mat();
    cv.approxPolyDP(largestContour, approx, epsilon, true);

    if (approx.rows === 4) {
        // If the approximation is quadrilateral, use it as paper corners
        let corners = [];
        for (let i = 0; i < approx.rows; i++) {
            let x = approx.intPtr(i, 0)[0];
            let y = approx.intPtr(i, 0)[1];
            corners.push([x, y]);

            if (DEV_MODE) {
                cv.circle(image, new cv.Point(x, y), 10, new cv.Scalar(0, 255, 0, 255), -1);
            }
        }

        approx.delete();
        return corners;
    }

    approx.delete();
    return null;
}

export function findPaperCorners(originalImage, mask) {
    let contours = findContours(mask);
    console.log("Countours", contours.size());

    if (contours.size() == 0)
        console.error("Target not detected!");

    let largestContour = getLargestContour(contours);
    console.log("Largest contour", largestContour);

    // TODO: NEW IMAGE NEEDS TO BE CREATED
    /*if (DEV_MODE)
        markLargestContour(originalImage, contours, COLOR_RED, 3);*/

    let targetRoiImage = getTargetRegionOfInterest(originalImage, contours);
    cv.imshow("targetRoiCanvas", targetRoiImage);

    //let corners = detectCornersInMask(targetRoiImage);
    let corners = detectCornersBinary(targetRoiImage);

    contours.delete();
    largestContour.delete();
    targetRoiImage.delete();
}