export function buildStatCubes(div, total, best, worst, avgScore, meanRad, variance, mad, meanElev, meanWind, maxSpread) {
    div.innerHTML=`
        <h3>EVALUATION OF YOUR STATS</h3>
        <div class="stats-grid">
            <div class="stat-cube">
                <span class="stat-value">${total}</span>
                <p class="stat-label">Total shots</p>
                <p class="stat-desc">Total count of all shots</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${best.toFixed(1)}</span>
                <p class="stat-label">Best score</p>
                <p class="stat-desc">Shot closest to bulls-eye</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${worst.toFixed(1)}</span>
                <p class="stat-label">Worst score</p>
                <p class="stat-desc">Shot furthest from bulls-eye</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${avgScore.toFixed(2)}</span>
                <p class="stat-label">Average score</p>
                <p class="stat-desc">Average score of all shots</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${meanRad.toFixed(2)} mm</span>
                <p class="stat-label">Mean radius</p>
                <p class="stat-desc">Average dispersion radius</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${variance.toFixed(2)} mm²</span>
                <p class="stat-label">Radius variance</p>
                <p class="stat-desc">Radius dispersion around the diameter - a higher value means a greater dispersion of firing points. The average of the squares of the deviations of individual radii from the mean value</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${mad.toFixed(2)} mm</span>
                <p class="stat-label">Consistency (MAD)</p>
                <p class="stat-desc">Mean absolute deviation from the mean</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${meanElev.toFixed(2)} mm</span>
                <p class="stat-label">Elevation</p>
                <p class="stat-desc">Average vertical deviation</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${meanWind.toFixed(2)} mm</span>
                <p class="stat-label">Windage</p>
                <p class="stat-desc">Average horizontal deviation</p>
            </div>
            <div class="stat-cube">
                <span class="stat-value">${maxSpread.toFixed(2)} mm</span>
                <p class="stat-label">Max spread</p>
                <p class="stat-desc">Maximum variance between points</p>
            </div>
        </div>
    `
}