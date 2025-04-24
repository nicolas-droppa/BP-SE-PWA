/**
 * Nájde najjasnejšie body v HSV obrázku a nakreslí kruh, ktorý ich ohraničuje.
 * @param {cv.Mat} hsvImage - HSV obrázok (napr. výsledok z convertToHSV).
 * @param {cv.Mat} outputImage - Obrázok, do ktorého sa má nakresliť kruh (napr. pôvodný alebo upravený).
 */
export function drawMinEnclosingCircleFromBrightSpots(hsvImage, outputImage) {
    // Rozdeľ HSV na kanály
    let channels = new cv.MatVector();
    cv.split(hsvImage, channels);
    let vChannel = channels.get(2); // Jas (V)

    // Threshold na veľmi svetlé hodnoty
    let brightMask = new cv.Mat();
    cv.threshold(vChannel, brightMask, 250, 255, cv.THRESH_BINARY);

    cv.imshow("warpCanvas", brightMask);

    vChannel.delete();
    channels.delete();

    // Nájsť kontúry
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(brightMask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    brightMask.delete();
    hierarchy.delete();

    // Spojiť všetky body do jedného cv.Mat
    let allPoints = new cv.Mat();
    for (let i = 0; i < contours.size(); i++) {
        let cnt = contours.get(i);
        if (cnt.rows > 0) {
            if (allPoints.rows === 0) {
                allPoints = cnt.clone();
            } else {
                let stacked = new cv.Mat();
                let matVector = new cv.MatVector();
                matVector.push_back(allPoints);
                matVector.push_back(cnt);
                cv.vconcat(matVector, stacked);
                matVector.delete();
                allPoints.delete();
                allPoints = stacked;
            }
        }
        cnt.delete();
    }

    // Ak máme body, nakresli kruh
    if (allPoints.rows > 0) {
        let center = new cv.Point();
        let radius = 0;
        let moments = cv.moments(allPoints, false);
        center.x = moments.m10 / moments.m00;
        center.y = moments.m01 / moments.m00;

        // Načítaj reálne body ako array kvôli výpočtu maximálnej vzdialenosti
        let maxDist = 0;
        for (let i = 0; i < allPoints.rows; i++) {
            let point = allPoints.intPtr(i, 0);
            let dx = point[0] - center.x;
            let dy = point[1] - center.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > maxDist) {
                maxDist = dist;
            }
        }

        radius = Math.floor(maxDist);
        cv.circle(outputImage, center, radius, new cv.Scalar(255, 0, 0, 255), 2);
        console.log("Kruh – Stred:", center.x, center.y, " Polomer:", radius);
    }

    allPoints.delete();
    contours.delete();
}

