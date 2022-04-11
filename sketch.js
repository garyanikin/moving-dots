let GRID = [];
let antiMagnetVector = null;
const dotSize = 10;
const FR = 30;
let index = 0;
let v0;
let noiseZoom = 2;
// let noiseZoom = 1.2;
const noiseSpeed = FR * 12;
const simplex = new SimplexNoise();

const EasingFunctions = {
  // no easing, no acceleration
  linear: (t) => t,
  // accelerating from zero velocity
  easeInQuad: (t) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // accelerating from zero velocity
  easeInQuint: (t) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  const gridX = Math.floor(windowWidth / 50);
  const gridY = Math.floor(windowHeight / 50);
  GRID = createGrid(gridX, gridY);
}

function setup() {
  // let density = displayDensity();
  frameRate(FR);
  let density = 2;
  pixelDensity(density);
  createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();

  const gridX = Math.floor(windowWidth / 50);
  const gridY = Math.floor(windowHeight / 50);
  GRID = createGrid(gridX, gridY);

  // colorMode(HSB, 100);
}

function draw() {
  antiMagnetVector = createVector(mouseX / windowWidth, mouseY / windowHeight);
  index = 0;
  v0 = createVector(0, 0);
  // background(0);
  background("rgba(0,0,0, 0.8)");
  GRID.forEach(([u, v]) => {
    const _noise = (n) =>
      simplex.noise4D(u / noiseZoom, v / noiseZoom, frameCount / noiseSpeed, n);

    const noiseValue = _noise(0);
    const force = _noise(0.1);
    const size = _noise(1);
    const color = _noise(3);
    var angle = noiseValue * TWO_PI * 4;
    renderCircle(u, v, angle, force, size, color);
  });

  // drawArrow(v0, antiMagnetVector, "purple");
}

function createGrid(x, y) {
  const grid = [];

  for (let i = 0; i <= x; i++) {
    for (let j = 0; j <= y; j++) {
      const u = i / x;
      const v = j / y;
      grid.push([u, v]);
    }
  }

  return grid;
}

function renderCircle(u, v, angle = 0, force = 0, size = 1, color = 1) {
  var vector = p5.Vector.fromAngle(angle);
  vector.setMag(0.015 * force);

  // var vector = p5.Vector.fromAngle(0);
  // vector.setMag(0);

  fill(360 * color, 60, 100);
  let { _u, _v } = applyAntimagnet(u + vector.x, v + vector.y, index++);
  circle(getX(_u), getY(_v), dotSize * size);
}

function getX(u) {
  return windowWidth * u;
}

function getY(v) {
  return windowHeight * v;
}

function applyAntimagnet(u, v, index) {
  const currentVector = createVector(u, v);
  let diff = p5.Vector.sub(currentVector, antiMagnetVector);
  // if (index === 564) {
  // console.log("draw", u, v, diff);
  // drawArrow(v0, currentVector, "blue");
  // drawArrow(antiMagnetVector, diff, "orange");

  const magnetField = 0.18;
  const magnitude = diff.mag();
  if (magnitude < magnetField) {
    const ease = EasingFunctions.easeOutQuad;
    const step = ease(magnitude / magnetField);
    diff.mult(1 / step);
    // console.log("Magnitude", magnitude);
    // console.log("inverse", magnetField - magnitude);
    // drawArrow(antiMagnetVector, diff, "white");
    let draw = p5.Vector.add(antiMagnetVector, diff);
    return { _u: draw.x, _v: draw.y };
  }
  // }

  return { _u: u, _v: v };
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x * windowWidth, base.y * windowHeight);
  line(0, 0, vec.x * windowWidth, vec.y * windowHeight);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
