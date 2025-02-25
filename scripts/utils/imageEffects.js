/**
 * Converts an image matrix to grayscale
 * 
 * @param {cv.Mat} image - The input image matrix to be converted to grayscale
 * @returns {cv.Mat} - Grayscale image matrix
 */
export function convertToGrayScale(image) {
    let gray = new cv.Mat();
    cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY);
    return gray;
}

/**
 * Converts an image matrix to hsv
 * 
 * @param {cv.Mat} image - The input image matrix to be converted to hsv
 * @returns {cv.Mat} - Hsv image matrix
 */
export function convertToHSV(image) {
    let hsv = new cv.Mat();
    cv.cvtColor(image, hsv, cv.COLOR_BGR2HSV);
    return hsv;
}

/**
 * Creates a mask from images
 * 
 * @param {cv.Mat} image - The input image matrix to be converted to hsv
 * @param {cv.Mat} lowerThresholdValue - Lower threshold color for paper detection
 * @param {cv.Mat} higherThresholdValue - Hower threshold color for paper detection
 * @returns {cv.Mat} - Mask image matrix
 */
export function createMask(image, lowerThresholdValue, higherThresholdValue) {
    let lowerColor = new cv.Mat(image.rows, image.cols, image.type(), lowerThresholdValue);
    let higherColor = new cv.Mat(image.rows, image.cols, image.type(), higherThresholdValue);

    let mask = new cv.Mat();
    cv.inRange(image, lowerColor, higherColor, mask);

    lowerColor.delete();
    higherColor.delete();

    return mask;
}

/**
 * Applies Gaussian blur to the image
 * 
 * @param {cv.Mat} image - The input image matrix to be blured
 * @returns {cv.Mat} - Blured image matrix
 */
export function applyGaussianBlur(image) {
    let bluredImage = new cv.Mat();
    cv.GaussianBlur(image, bluredImage, new cv.Size(5, 5), 1, 1, cv.BORDER_DEFAULT);
    return bluredImage;
}

/**
 * Applies Median blur to the image
 * 
 * @param {cv.Mat} image - The input image matrix to be blured
 * @returns {cv.Mat} - Blured image matrix
 */
export function applyMedianBlur(image) {
    let bluredImage = new cv.Mat();
    cv.medianBlur(image, bluredImage, 5);
    return bluredImage;
}

/**
 * Applies Default (Averaging) blur to the image
 * 
 * @param {cv.Mat} image - The input image matrix to be blured
 * @returns {cv.Mat} - Blured image matrix
 */
export function applyDefaultBlur(image) {
    let bluredImage = new cv.Mat();
    cv.blur(image, bluredImage, new cv.Size(5, 5));
    return bluredImage;
}