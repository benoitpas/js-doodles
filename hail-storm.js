const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = document.getElementById("main").clientWidth;
const height = canvas.height = window.innerHeight;

const stones = []
const accCoef = 1e4
const groundBounce = 0.5

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    return num
}

class Hailstone {
    constructor(x,y,color,size, xSpeed,ySpeed,xAcc,yAcc) {
        this.x = x
        this.y = y
        this.color = color
        this.size = size
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed
        this.xAcc = xAcc
        this.yAcc = yAcc
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
    }

    update() {
        // Next step
        let nextXSpeed = this.xSpeed + this.xAcc
        let nextYSpeed = this.ySpeed + this.yAcc
        let nextY = this.y + this.ySpeed
        let nextX = this.x + this.xSpeed
        // Find interestinct ball
        let sorted = stones.sort((a,b)=> (a.x-b.x)^2 + (a.y-b,y)^2)
        let closest = 0
        let distance = ()
        for(let i=0; i<stones.length;i++) {

        }
        // Check for bounce on ground
        let [y, ySpeed] = (nextY > height - this.size ? [height-this.size, - this.ySpeed*groundBounce] : [nextY, nextYSpeed])
        return new Hailstone(this.x, y, this.color, this.size, this.xSpeed, ySpeed, this.yAcc)
    }
}
  


function newHailstone() {
    let size = random(10,20)
    let x = random(size, width-size)
    let y = random(size, size)
    let color = random(15,255)
    let yAcc = (size ^ 3) / accCoef
    let ySpeed = width * yAcc

    let hs = new Hailstone(x,y,`rgba(${color},0,${color},1)`, size, 0, ySpeed, yAcc)
    hs.draw()
    stones.push(hs)
}

function reset() {
    // interesting way to clear the array !
    stones.length = 0
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
    }

    for(let i = 0; i < stones.length; i++) {
        stones[i] = stones[i].update()
    }
  
    requestAnimationFrame(loop);
  }
  
  loop();