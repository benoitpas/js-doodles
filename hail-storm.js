'use strict'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const width = canvas.width = document.getElementById("main").clientWidth
const height = canvas.height = window.innerHeight

let stones = []
const iAccCoef = 5e5
let accCoef = iAccCoef
let groundBounce = 0.3

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

function angle(x1,y1,x2,y2) {
    //let [[ex1,ey1],[ex2,ey2]] = (x1<x2 ? [[x1,y1],[x2,y2]] : [[x2,y2],[x1,y1]])
    let w = x2-x1
    let h = y2-y1
    let r = (w == 0 ? Math.sign(h) * Math.PI/2 :
        Math.atan(h/w) + (w >= 0 ? 0 : Math.PI))
    return r
}

function toPol(x,y) {
    let d = Math.sqrt(x*x+y*y)
    let a = angle(0,0,x,y)
    return [d,a]
}

function distance(x1, y1, x2, y2) {
    return Math.pow(x1-x2,2) + Math.pow(y1-y2,2)
}

class Hailstone {
    constructor(x,y,color,size, xSpeed,ySpeed) {
        this.x = x
        this.y = y
        this.color = color
        this.size = size
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed
    }

     yAcc() {
        return Math.pow(this.size,3) / accCoef
    }
    

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
    }

    clone() {
        return new Hailstone(this.x, this.y, this.color, this.size, this.xSpeed, this.ySpeed)
    }

    update() {
        // Find intersectinct ball
        let sorted = stones.map(e => e).sort((a,b)=> distance(a.x,a.y,this.x,this.y)-distance(this.x,this.y,b.x,b.y))
        let closest = sorted.slice(1,2)[0]
        let r = this.clone()
        if (closest && distance(this.x, this.y,closest.x,closest.y)<(Math.pow(this.size+closest.size,2))) {
            let psy = angle(this.x, this.y, closest.x, closest.y)
            let [v1, theta1] = toPol(this.xSpeed, this.ySpeed)
            let [v2, theta2] = toPol(closest.xSpeed, closest.ySpeed)
            let [v1x,v1y,v2x,v2y] = afterCollision(v1,v2, Math.pow(this.size,3), Math.pow(closest.size,3),theta1,theta2,psy)
            r.xSpeed = v1x
            r.ySpeed = v1y
        }
        // Next step
        let nextYSpeed = r.ySpeed + r.yAcc()
        let nextY = r.y + r.ySpeed
        // Check for bounce on ground
        if (nextY > height - this.size) {
            nextY = height-this.size
            nextYSpeed = - this.ySpeed*groundBounce
        }
        r.y = nextY
        r.ySpeed = nextYSpeed
        // Check if ball is sliding on the floor, then reduce speed
        if (nextY ==  height-this.size && Math.abs(nextYSpeed) < 0.01) {
            r.xSpeed = r.xSpeed / 2
        }
        let nextX = r.x + r.xSpeed
        // Check for sides
        r.x = (nextX < 0 ? nextX + width : (nextX>=width ? nextX-width : nextX))

        return r
    }
}
  
function newHailstone() {
    let size = random(10,20)
    let x = random(size, width-size)
    let y = size
    let color = random(15,255)
    let hs = new Hailstone(x,y,`rgba(${color},0,${color},1)`, size, 0, 0)
    hs.ySpeed = width * hs.yAcc()
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

    let g = document.getElementById('gravity')
    if (g) {
        accCoef = iAccCoef / parseFloat(g.value)
    }
    let gb = document.getElementById('groundBounce')
    if (gb) {
        groundBounce = parseFloat(gb.value)
    }

  
    for(let i = 0; i < stones.length; i++) {
        stones[i].draw()
    }

    let stones2 = stones.map(s => s.update())
    stones = stones2
  
    requestAnimationFrame(loop);
  }
  
  loop();