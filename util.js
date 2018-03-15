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

function dec2hexStr(n) {
  let hex = n.toString(16);
  while(hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}

function rgb2hexColor(r, g, b) {
  return "0x" + dec2hexStr(r) + dec2hexStr(g) + dec2hexStr(b);
}

function shade2hexColor(n) {
  return rgb2hexColor(n, n, n);
}

function noise(width, height, frequency) {
  const sinPhase = Math.floor(Math.random() * 2 * Math.PI);
  const cosPhase = Math.floor(Math.random() * 2 * Math.PI);
  const map = [];
  for (let i = 0; i < width; i++) {
    const line = [];
    for (let j = 0; j < height; j++) {
      line.push(Math.sin(2 * Math.PI * frequency[0] * i / width + sinPhase) * Math.cos(2 * Math.PI * frequency[1] * j / height + cosPhase) + 1);
    }
    map.push(line);
  }
  return map;
}

function weightedSum(width, height, amplitudes, noises) {
  const map = [];
  let max = 0;
  for (let i = 0; i < width; i++) {
    const line = [];
    for (let j = 0; j < height; j++) {
      let val = 0;
      for (let n = 0; n < noises.length; n++) {
        val += noises[n][i][j] * amplitudes[n];
      }
      if (max < val) {
        max = val;
      }
      line.push(val);
    }
    map.push(line);
  }
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      map[i][j] = Math.floor(map[i][j] * 255 / max);
    }
  }
  return map;
}

function generateNoiseMap(width, height, frequencies, amplitudeFunc, seed) {
  //Math.random.seed(seed);
  const amplitudes = [];
  const noises = [];
  for (let i = 0; i < frequencies.length; i++) {
    amplitudes.push(amplitudeFunc(frequencies[i]));
    noises.push(noise(width, height, frequencies[i]));
  }
  return weightedSum(width, height, amplitudes, noises);
}

function generateRandomNoiseMap(width, height) {
  const seed = Math.floor(Math.random() * 16384 + 1);
  const frequencies = [];
  for (let f = 1; f <= 32; f *= 2) {
    frequencies.push([f, f]);
  }
  return generateNoiseMap(width, height, frequencies, function ([f, g]) { return (1 / f + 1 / g) / 2 }, seed);
}