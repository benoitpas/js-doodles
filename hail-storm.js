const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = document.getElementById("main").clientWidth;
const height = canvas.height = window.innerHeight;

const stones = []
const speed = 1

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    return num
}

class Hailstone {
    constructor(x, y, color, size) {
        this.x = x
        this.y = y
        this.color = color
        this.size = size
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
    }

    update() {
        this.y = Math.min(this.y + speed, height-this.size)
    }
}
  


function newHailstone() {
    let size = random(10,20)
    let x = random(size, width-size)
    let y = random(size, size)
    let hs = new Hailstone(x,y,'#F0F', size)
    hs.draw()
    stones.push(hs)
}

// Background to animation
ctx.moveTo(0, height)
ctx.lineTo(width, height)
ctx.stroke()

function loop() {
    ctx.fillStyle = 'rgba(128,0,255,0.25)'
    ctx.fillRect(0,0,width,height)
  
    for(let i = 0; i < stones.length; i++) {
        stones[i].draw()
        stones[i].update()
    }
  
    requestAnimationFrame(loop);
  }
  
  loop();