export function findPaperCorners(cv, image) {
    let hsvImage = new cv.Mat();
    cv.cvtColor(image, hsvImage, cv.COLOR_BGR2HSV);
    return hsvImage;
}