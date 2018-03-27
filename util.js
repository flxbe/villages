"use strict";

/**
 * Convert absolute to relative coordinates.
 * @param {number} absX
 * @param {number} absY
 */
function abs2rel(absX, absY) {
  return [absX + UI_STATE.offsetX, absY + UI_STATE.offsetY];
}

/**
 * Convert relative to absolute coordinates.
 * @param {number} relX
 * @param {number} relY
 */
function rel2abs(relX, relY) {
  return [relX - UI_STATE.offsetX, relY - UI_STATE.offsetY];
}

/**
 * Convert cartesian to absolute coordinates.
 * @param {number} cartX
 * @param {number} cartY
 */
function cart2abs(cartX, cartY) {
  const absX = cartX - cartY;
  const absY = (cartX + cartY) / 2;
  return [absX, absY];
}

/**
 * Convert absolute to cartesian coordinates.
 * @param {number} absX
 * @param {number} absY
 */
function abs2cart(absX, absY) {
  const cartX = (2 * absY + absX) / 2;
  const cartY = (2 * absY - absX) / 2;
  return [cartX, cartY];
}

/**
 * Convert cartesian to relative coordinates.
 * @param {number} cartX
 * @param {number} cartY
 */
function cart2rel(cartX, cartY) {
  const [absX, absY] = cart2abs(cartX, cartY);
  return abs2rel(absX, absY);
}

/**
 * Convert relative to cartesian coordinates.
 * @param {number} relX
 * @param {number} relY
 */
function rel2cart(relX, relY) {
  const [absX, absY] = rel2abs(relX, relY);
  return abs2cart(absX, absY);
}

/**
 * Return euclidean norm of 2-dimensional vector.
 * @param {number} x
 * @param {number} y
 */
function norm(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

/**
 * Return euclidean distance of 2-dimensional points.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function distance(x1, y1, x2, y2) {
  return norm(x2 - x1, y2 - y1);
}

/**
 * Return direction from one 2-dimensional point to another as normalized vector.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
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

/**
 * Convert decimal number to hexadecimal string.
 * @param {number} n - expected to be in {0,...,255}
 */
function dec2hexStr(n) {
  let hex = n.toString(16);
  while (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}

/**
 * Convert RGB color to hexadecimal color string.
 * @param {number} r - expected to be in {0,...,255}
 * @param {number} g - expected to be in {0,...,255}
 * @param {number} b - expected to be in {0,...,255}
 */
function rgb2hexColor(r, g, b) {
  return "0x" + dec2hexStr(r) + dec2hexStr(g) + dec2hexStr(b);
}

/**
 * Convert intensity to hexadecimal string.
 * @param {number} n - expected to be in {0,...,255}
 */
function shade2hexColor(n) {
  return rgb2hexColor(n, n, n);
}

/**
 *
 * @param {number} x - hitbox x
 * @param {number} y - hitbox y
 * @param {number} w - hitbox width
 * @param {number} h - hitbox height
 * @param {number} px - point x
 * @param {number} py - point y
 */
function pointInHitbox(x, y, w, h, px, py) {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}
