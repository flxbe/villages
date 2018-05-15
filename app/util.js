import * as Constants from "../common/constants.js";
import context from "./context.js";

/**
 * Convert decimal number to hexadecimal string.
 * @param {number} n - expected to be in {0,...,255}
 */
export function dec2hexStr(n) {
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
export function rgb2hexColor(r, g, b) {
  return "0x" + dec2hexStr(r) + dec2hexStr(g) + dec2hexStr(b);
}

/**
 * Convert intensity to hexadecimal string.
 * @param {number} n - expected to be in {0,...,255}
 */
export function shade2hexColor(n) {
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
export function pointInHitbox(x, y, w, h, px, py) {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}
