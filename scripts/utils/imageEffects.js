/**
 * Converts an image matrix to grayscale
 * 
 * @param {Object} cv - Global object representing OpenCV.js library
 * @param {cv.Mat} image - The input image matrix to be converted to grayscale
 * @returns {cv.Mat} - Grayscale image matrix
 */
export function convertToGrayScale(cv, image) {
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY);
    return image;
}