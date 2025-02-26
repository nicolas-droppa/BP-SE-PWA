/** DEV MODE (DEBUG)
 * value based on which are debug functions fired
 * True -> debug functions will execude
 * False -> debug function are skipped
 */
export const DEV_MODE = true;

/** LOWER THRESHOLD VALUE
 * value reprezenting lower threshold for detecting paper color
 */
export const LOWER_THRESHOLD_VALUE = [80, 40, 70, 0]; //[20, 20, 150, 0] | [0, 0, 0, 0] | Best: [90, 50, 100, 0]

/** HIGHER THRESHOLD VALUE
 * value reprezenting higher threshold for detecting paper color
 */
export const HIGHER_THRESHOLD_VALUE = [155, 255, 255, 255]; //[35, 100, 255, 255] | [150, 150, 150, 255] | Best: [140, 255, 255, 255]

/** COLORS
 * arrays used for coloring some debug prints
 */
export const COLOR_RED = [255, 0, 0, 255];

/** TARGET MARGIN
 * value that is added in target roi, for extra safe meassures in case of wrong detection
 */
export const TARGET_MARGIN_ROI_PIXELS = 50;