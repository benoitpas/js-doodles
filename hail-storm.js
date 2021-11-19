'use strict'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const width = canvas.width = document.getElementById("main").clientWidth
const height = canvas.height = window.innerHeight

let stones = []
const accCoef = 1e4
const groundBounce = 0.5

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    return num
}

// from https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects

function afterCollision(v1, v2, m1, m2, theta1, theta2, psy) {
    let a1 = (v1*Math.cos(theta1-psy)*(m1-m2) + 2*m2*v2*Math.cos(theta2-psy))/(m1+m2)
    let b1 = v1*Math.sin(theta1-psy)
    let v1x = a1*Math.cos(psy) + b1*Math.cos(psy+Math.PI/2)
    let v1y = a1*Math.sin(psy) + b1*Math.sin(psy+Math.PI/2)
    let a2 = (v2*Math.cos(theta2-psy)*(m2-m1) + 2*m1*v1*Math.cos(theta1-psy))/(m1+m2)
    let b2 = v2*Math.sin(theta2-psy)
    let v2x = a2*Math.cos(psy) + b2*Math.cos(psy+Math.PI/2)
    let v2y = a2*Math.sin(psy) + b2*Math.sin(psy+Math.PI/2)
    return [v1x,v1y,v2x,v2y]
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
        // Find intersectinct ball
        let sorted = stones.map(e => e).sort((a,b)=> (a.x-b.x)^2 + (a.y-b.y)^2)
        let closest = sorted.slice(1,2)
        // Check for bounce on ground
        let [y, ySpeed] = (nextY > height - this.size ? [height-this.size, - this.ySpeed*groundBounce] : [nextY, nextYSpeed])
        return new Hailstone(this.x, y, this.color, this.size, this.xSpeed, ySpeed, this.xAcc, this.yAcc)
    }
}
  


function newHailstone() {
    let size = random(10,20)
    let x = random(size, width-size)
    let y = size
    let color = random(15,255)
    let yAcc = (size ^ 3) / accCoef
    let ySpeed = width * yAcc

    let hs = new Hailstone(x,y,`rgba(${color},0,${color},1)`, size, 0, ySpeed, 0, yAcc)
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

    let stones2 = stones.map(s => s.update())
    stones = stones2
  
    requestAnimationFrame(loop);
  }
  
  loop();