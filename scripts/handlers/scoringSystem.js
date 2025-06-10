/**
 * Calculates and returns score for shot (accounting for shot radius)
 * @param {{x:number,y:number}} clickPoint shot center coords
 * @param {{center:{x:number,y:number}, size:{width:number,height:number}, angle:number}} ellipse
 * @param {number} previewRadius radius of shot
 * @return {number} score
 */
export function getScore(clickPoint, ellipse, previewRadius) {
    const MAX_SCORE = 10;

    const ringWidths = [0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8];
    const boundary = ringWidths.slice(0, 4).reduce((sum, w) => sum + w, 0);

    const deltaX = clickPoint.x - ellipse.center.x;
    const deltaY = clickPoint.y - ellipse.center.y;

    const radians = -ellipse.angle * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const rotX = deltaX * cos - deltaY * sin;
    const rotY = deltaX * sin + deltaY * cos;

    const distance = Math.hypot(rotX, rotY);

    const effectiveDistance = Math.max(0, distance - previewRadius);

    const unitX = rotX / (distance || 1);
    const unitY = rotY / (distance || 1);
    const halfWidth = ellipse.size.width / 2;
    const halfHeight = ellipse.size.height / 2;
    const boundaryRadiusPx = 1 / Math.sqrt(
        (unitX * unitX) / (halfWidth * halfWidth) +
        (unitY * unitY) / (halfHeight * halfHeight)
    );

    const pxPerCm = boundaryRadiusPx / boundary;
    const effectiveDistanceCm = effectiveDistance / pxPerCm;

    const cumulativeBoundsCm = ringWidths.reduce((bounds, widthCm) => {
        const lastBoundary = bounds.length ? bounds[bounds.length - 1] : 0;
        bounds.push(lastBoundary + widthCm);
        return bounds;
    }, []);

    let zoneIndex = cumulativeBoundsCm.findIndex(boundary => effectiveDistanceCm <= boundary);
    if (zoneIndex === -1) zoneIndex = ringWidths.length;

    const score = MAX_SCORE - zoneIndex;
    return Math.max(0, score);
}