"use strict";

// TODO: window resize
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let offsetX = 200;
let offsetY = 200;

function abs2rel(isoX, isoY) {
  return [isoX + offsetX, isoY + offsetY];
}

function rel2abs(isoX, isoY) {
  return [isoX - offsetX, isoY - offsetY];
}

function cart2abs(cartX, cartY) {
  const absX = cartX - cartY;
  const absY = (cartX + cartY) / 2;
  return [absX, absY];
}

function abs2cart(absX, absY) {
  const cartX = (2 * absY + absX) / 2;
  const cartY = (2 * absY - absX) / 2;
  return [cartX, cartY];
}

function cart2rel(cartX, cartY) {
  const [absX, absY] = cart2abs(cartX, cartY);
  return abs2rel(absX, absY);
}

function rel2cart(relX, relY) {
  const [absX, absY] = rel2abs(relX, relY);
  return abs2cart(absX, absY);
}

function norm(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function distance(x1, y1, x2, y2) {
  return norm(x2 - x1, y2 - y1);
}

function getDirection(x1, y1, x2, y2) {
  const dX = x2 - x1;
  const dY = y2 - y1;
  const dNorm = norm(dX, dY);
  return [dX / dNorm, dY / dNorm];
}

function isNorth([dx, dy]) {
  return dx === 0 && dy < 0;
}

function isNorthEast([dx, dy]) {
  return dx > 0 && dy < 0;
}

function isEast([dx, dy]) {
  return dx > 0 && dy === 0;
}

function isSouthEast([dx, dy]) {
  return dx > 0 && dy > 0;
}

function isSouth([dx, dy]) {
  return dx === 0 && dy > 0;
}

function isSouthWest([dx, dy]) {
  return dx < 0 && dy > 0;
}

function isWest([dx, dy]) {
  return dx < 0 && dy === 0;
}

function isNorthWest([dx, dy]) {
  return dx < 0 && dy < 0;
}

function dec2hex(n) {
  let hex = n.toString(16);
  while (hex.length < 2) { hex = "0" + hex; }
  return hex;
}

function rgb2hexColor(r, g, b) {
  return "0x" + dec2hex(r) + dec2hex(g) + dec2hex(b);
}

function shade2hexColor(n) {
  return rgb2hexColor(n, n, n);
}

function generateNoiseMaps(number, width, height, minVal, maxVal, blurRadius, blurFactor, blurGradient) {
  const maps = [];

  for (let n = 0; n < number; n++) {
    const map = [];

    for (let i = 0; i < width; i++) {
      const line = [];
      for (let j = 0; j < height; j++) {
        line.push(Math.floor(Math.random() * (maxVal - minVal) + minVal));
      }
      map.push(line);
    }

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let val = blurFactor * map[i][j];
        let valc = blurFactor;
        for (let distX = 1; distX < blurRadius; distX++) {
          for (let distY = 1; distX + distY <= blurRadius; distY++) {
            const factor = blurFactor / ((distX + distY) * blurGradient);
            if (i - distX >= 0 && j - distY >= 0) {
              val += factor * map[i - distX][j - distY];
              valc += factor;
            }
            if (i + distX < width && j + distY < height) {
              val += factor * map[i + distX][j + distY];
              valc += factor;
            }
          }
        }
        map[i][j] = Math.floor(val / valc);
      }
    }

    maps.push(map);
  }

  return maps;
}