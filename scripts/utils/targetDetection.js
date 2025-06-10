/**
 * Takes a cv.Mat (warped RGBA/RGB)
 * @returns { x: cx, y: cy } = centroid of largest non-blank space.
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

export function detectRingsByEllipseFit(warpSrc, opts = {}) {
    const {
        threshold           = 100,
        minContourArea      = 80,
        centerTolerance     = 5,
        axisRatioTolerance  = 0.2,
        maxEllipseCount     = 10
    } = opts;

    const centroid = computeContentCentroid(warpSrc);
    const cx = Math.round(centroid.x);
    const cy = Math.round(centroid.y);

    let gray = new cv.Mat();
    if (warpSrc.channels() === 4) {
        cv.cvtColor(warpSrc, gray, cv.COLOR_RGBA2GRAY);
    } else if (warpSrc.channels() === 3) {
        cv.cvtColor(warpSrc, gray, cv.COLOR_RGB2GRAY);
    } else {
        warpSrc.copyTo(gray);
    }
    let thresh = new cv.Mat();
    cv.threshold(gray, thresh, threshold, 255, cv.THRESH_BINARY_INV);
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

    const candidates = [];
    for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const area = cv.contourArea(cnt, false);
        if (area < minContourArea) {
            cnt.delete();
            continue;
        }

        if (cnt.rows < 5) {
            cnt.delete();
            continue;
        }

        const rawEllipse = cv.fitEllipse(cnt);
        cnt.delete();

        const ex = Math.round(rawEllipse.center.x);
        const ey = Math.round(rawEllipse.center.y);
        const ew = Math.round(rawEllipse.size.width);
        const eh = Math.round(rawEllipse.size.height);

        const dx = ex - cx;
        const dy = ey - cy;
        if (Math.hypot(dx, dy) > centerTolerance)
            continue;

        const ratio = ew > eh ? (eh / ew) : (ew / eh);
        if (ratio < (1 - axisRatioTolerance))
            continue;


        candidates.push({
            center: { x: ex, y: ey },
            size:   { width: ew, height: eh },
            angle: rawEllipse.angle
        });
    }
    contours.delete();

    candidates.sort((a, b) => {
        const ma = (a.size.width + a.size.height) / 2;
        const mb = (b.size.width + b.size.height) / 2;
        return mb - ma;
    });

    let result = [];
    if (candidates.length > 0)
        result.push(candidates[candidates.length - 1]);

    return result;
}