const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = document.getElementById("main").clientWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

class Hailstone {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}
  
ctx.moveTo(0, height);
ctx.lineTo(width, height);
ctx.stroke();

function newHailstone() {
    let size = random(10,20)
    let x = random(size, width-size)
    let y = random(size, height-size)
    let hs = new Hailstone(x,y,"#0", size)
    hs.draw()
}