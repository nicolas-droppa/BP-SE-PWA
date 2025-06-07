/**
 * Calculates and returns score for shot 
 * @param {{x:number,y:number}} clickPoint shot coords
 * @param {{center:{x:number,y:number}, size:{width:number,height:number}, angle:number}} ellipse edge of darg circle
 */
export function getScore(clickPoint, ellipse) {
    const maxZones = 10;

    const dx = clickPoint.x - ellipse.center.x;
    const dy = clickPoint.y - ellipse.center.y;

    const θ = -ellipse.angle * Math.PI/180;
    const c = Math.cos(θ), s = Math.sin(θ);
    const xRot = dx*c - dy*s;
    const yRot = dx*s + dy*c;

    const dist = Math.hypot(xRot, yRot);
    if (dist === 0) return maxZones;

    const ux = xRot/dist;
    const uy = yRot/dist;

    const ax = ellipse.size.width / 2;
    const ay = ellipse.size.height / 2;

    const rEdge = 1 / Math.sqrt((ux*ux)/(ax*ax) + (uy*uy)/(ay*ay));

    const ringSize = rEdge / 4;

    const ringIdx = Math.ceil(dist / ringSize);

    const score = maxZones - (ringIdx - 1);

    return score > 0 ? score : 0;
}