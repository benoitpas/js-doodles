const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = document.getElementById("main").clientWidth;
const height = canvas.height = window.innerHeight;

const stones = []
const accCoef = 1e4

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
        this.xSpeed = 0
        this.yAcc = (this.size ^ 3)/accCoef
        this.ySpeed = width*this.yAcc
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
    }

    update() {
        // Next step
        this.ySpeed = this.ySpeed + this.yAcc
        this.y = this.y + this.ySpeed
        // Check for bounce on ground
        if (this.y > height-this.size) {
            this.ySpeed = - this.ySpeed*0.5
            this.y = height-this.size
        }
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
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.fillRect(0,0,width,height)
  
    for(let i = 0; i < stones.length; i++) {
        stones[i].draw()
        stones[i].update()
    }
  
    requestAnimationFrame(loop);
  }
  
  loop();