let GRID = [];
const dotSize = 10;
const FR = 30;
let noiseZoom = 2;
// let noiseZoom = 1.2;
const noiseSpeed = FR * 12;
const simplex = new SimplexNoise();

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

function renderCircle(u, v, angle, force, size, color) {
  var vector = p5.Vector.fromAngle(angle);
  vector.setMag(0.015 * force);
  fill(360 * color, 60, 100);
  circle(getX(u + vector.x), getY(v + vector.y), dotSize * size);
}

function getX(u) {
  return windowWidth * u;
}

function getY(v) {
  return windowHeight * v;
}
