const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = document.getElementById("main").clientWidth;
const height = canvas.height = window.innerHeight;

ctx.moveTo(0, 0);
ctx.lineTo(width, height);
ctx.stroke();

function reset() {
}