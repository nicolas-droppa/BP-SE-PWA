const canvas = document.getElementById("warpCanvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(`Clicked at: x=${x}, y=${y}`);

    drawCircle(x, y);
});

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}