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