/**
 * Takes a cv.Mat (warped RGBA/RGB)
 * returns { x: cx, y: cy } = centroid of largest non-blank space.
 */
export function computeContentCentroid(warpedMat) {
    let gray = new cv.Mat();
    cv.cvtColor(warpedMat, gray, cv.COLOR_RGBA2GRAY); 

    let thresh = new cv.Mat();
    const thresholdValue = 80;
    cv.threshold(
        gray,
        thresh,
        thresholdValue,
        255,
        cv.THRESH_BINARY_INV
    );
    gray.delete();

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
        thresh,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
    );
    thresh.delete();
    hierarchy.delete();

    if (contours.size() === 0) {
        contours.delete();
        return {
            x: warpedMat.cols / 2,
            y: warpedMat.rows / 2
        };
    }


    let largestIdx = 0;
    let maxArea = 0;
    for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const area = cv.contourArea(cnt, false);
        if (area > maxArea) {
        maxArea = area;
        largestIdx = i;
        }
    }
    let largestContour = contours.get(largestIdx);

    let mu = cv.moments(largestContour, false);
    contours.delete();
    largestContour.delete();

    if (mu.m00 === 0) {
        return {
        x: warpedMat.cols / 2,
        y: warpedMat.rows / 2
        };
    }

    const rawCx = mu.m10 / mu.m00;
    const rawCy = mu.m01 / mu.m00;
    const cx = Math.round(rawCx);
    const cy = Math.round(rawCy);
    return { x: cx, y: cy };
}

/**
 * Run HoughCircles on a blurred grayscale Mat.
 * Returns an array of { x, y, r }.
 *
 * - dp: resolution ratio (usually 1.0)
 * - minDist: min distance between centers (pixels)
 * - param1: Canny high threshold (100–200)
 * - param2: accumulator threshold (30–50)
 * - minRadius, maxRadius: expected radius range (pixels)
 */
export function detectCircles(blurredGray, dp, minDist, param1, param2, minRadius, maxRadius) {
    let circles = new cv.Mat();
    cv.HoughCircles(
        blurredGray,
        circles,
        cv.HOUGH_GRADIENT,
        dp,
        minDist,
        param1,
        param2,
        minRadius,
        maxRadius
    );

    let result = [];
    for (let i = 0; i < circles.cols; i++) {
        const x = circles.data32F[i * 3];
        const y = circles.data32F[i * 3 + 1];
        const r = circles.data32F[i * 3 + 2];
        result.push({ x: Math.round(x), y: Math.round(y), r: Math.round(r) });
    }
    circles.delete();
    return result;
}

/**
 * Preprocess a warped RGBA Mat into a blurred grayscale Mat
 * that’s ready for HoughCircles().
 */
export function preprocessForCircles(warpedMat) {
    let gray = new cv.Mat();
    cv.cvtColor(warpedMat, gray, cv.COLOR_RGBA2GRAY);

    // Gaussian blur with a 5×5 kernel, sigma ≈1.5
    let blurred = new cv.Mat();
    cv.GaussianBlur(
        gray,
        blurred,
        new cv.Size(5, 5),
        1.5,
        1.5,
        cv.BORDER_DEFAULT
    );
    gray.delete();

    return blurred;  // a single‐channel Mat
}

/**
 * Draws each circle (and its center) onto an RGBA Mat for visualization.
 * - warpedMat: RGBA Mat
 * - circles: array of { x, y, r }
 */
export function drawCirclesOnMat(warpedMat, circles) {
    for (let i = 0; i < circles.length; i++) {
        const { x, y, r } = circles[i];
        cv.circle(warpedMat, new cv.Point(x, y), r, [255, 0, 0, 255], 1);
        cv.circle(warpedMat, new cv.Point(x, y), 3, [0, 255, 0, 255], cv.FILLED);
    }
}

