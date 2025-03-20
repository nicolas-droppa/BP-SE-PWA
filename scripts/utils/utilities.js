/**
 * Orders points in a specific order (top-l, top-r, bottom-r, bottom-l)
 * @param {Array<Array<number>>} points - Array of 4 points [x, y]
 * 
 * @returns {Array<Array<number>>} Ordered points
 */
export function orderPoints(points) {
    let rect = new Array(4).fill(null).map(() => new Array(2).fill(0));
    
    let s = points.map(p => p[0] + p[1]);
    rect[0] = points[s.indexOf(Math.min(...s))];
    rect[3] = points[s.indexOf(Math.max(...s))];
    
    let diff = points.map(p => p[0] - p[1]);
    rect[1] = points[diff.indexOf(Math.min(...diff))];
    rect[2] = points[diff.indexOf(Math.max(...diff))];
    
    return rect;
}

/**
 * Calculates the width and height of quadrilateral based on corners
 * @param {Array<Array<number>>} corners - Corners from which it calculates
 * 
 * @returns {Array<number>} An array of dimensions of quadrilateral
 */
export function calculateWidthHeight(corners) {
    corners = corners.map(point => [...point]);
    
    let width1 = Math.hypot(corners[0][0] - corners[1][0], corners[0][1] - corners[1][1]);
    let width2 = Math.hypot(corners[2][0] - corners[3][0], corners[2][1] - corners[3][1]);
    let height1 = Math.hypot(corners[0][0] - corners[2][0], corners[0][1] - corners[2][1]);
    let height2 = Math.hypot(corners[1][0] - corners[3][0], corners[1][1] - corners[3][1]);
    
    let width = (width1 + width2) / 2;
    let height = (height1 + height2) / 2;
    
    return [Math.round(width), Math.round(height)];
}