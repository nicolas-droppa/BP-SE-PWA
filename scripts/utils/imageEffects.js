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