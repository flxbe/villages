import * as Constants from "../common/constants.js";
import context from "./context.js";

/**
 * Return euclidean norm of 2-dimensional vector.
 * @param {number} x
 * @param {number} y
 */
export function norm(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

/**
 * Return euclidean distance of 2-dimensional points.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
export function distance(x1, y1, x2, y2) {
  return norm(x2 - x1, y2 - y1);
}

/**
 * Return direction from one 2-dimensional point to another as normalized vector.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
export function getDirection(x1, y1, x2, y2) {
  const dX = x2 - x1;
  const dY = y2 - y1;
  const dNorm = norm(dX, dY);
  return [dX / dNorm, dY / dNorm];
}

export function isNorth([dx, dy]) {
  return dx === 0 && dy < 0;
}

export function isNorthEast([dx, dy]) {
  return dx > 0 && dy < 0;
}

export function isEast([dx, dy]) {
  return dx > 0 && dy === 0;
}

export function isSouthEast([dx, dy]) {
  return dx > 0 && dy > 0;
}

export function isSouth([dx, dy]) {
  return dx === 0 && dy > 0;
}

export function isSouthWest([dx, dy]) {
  return dx < 0 && dy > 0;
}

export function isWest([dx, dy]) {
  return dx < 0 && dy === 0;
}

export function isNorthWest([dx, dy]) {
  return dx < 0 && dy < 0;
}

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

export function sufficientResources(blueprint) {
  return context.get().storage.wood >= blueprint.wood;
}

/**
 * Check, whether a building with the specified width and height can
 * be placed at position i, j.
 * @param {number} i
 * @param {number} j
 * @param {number} height
 * @param {number} width
 */
export function isAreaFreeForBuilding(i, j, height, width) {
  for (let k = i; k > i - height; k--) {
    for (let l = j; l > j - width; l--) {
      if (!isTileOnMap(k, l) || !isBuildableTile(context.get().map[k][l].type))
        return false;
    }
  }
  return true;
}

/**
 * Determine if a tile is walkable by its type.
 * @param {string} type
 */
export function isWalkableTile(type) {
  switch (type) {
    case Constants.TILE_GRASS:
    case Constants.TILE_DIRT:
    case Constants.TILE_ROAD:
      return true;
    case Constants.TILE_WATER:
    case Constants.TILE_DEEPWATER:
    case Constants.TILE_TREE:
    case Constants.TILE_BUILDING:
      return false;
    default:
      throw Error(`unknown tile type: ${type}`);
  }
}

/**
 * Determine if a tile is buildable by its type.
 * @param {string} type
 */
export function isBuildableTile(type) {
  switch (type) {
    case Constants.TILE_GRASS:
    case Constants.TILE_DIRT:
      return true;
    case Constants.TILE_WATER:
    case Constants.TILE_DEEPWATER:
    case Constants.TILE_TREE:
    case Constants.TILE_BUILDING:
    case Constants.TILE_ROAD:
      return false;
    default:
      throw Error(`unknown tile type: ${type}`);
  }
}

/**
 * Determine if a tile is acceptable for street building by its type.
 * @param {string} type
 */
export function isRoadableTile(type) {
  switch (type) {
    case Constants.TILE_GRASS:
    case Constants.TILE_DIRT:
    case Constants.TILE_WATER:
      return true;
    case Constants.TILE_DEEPWATER:
    case Constants.TILE_TREE:
    case Constants.TILE_BUILDING:
    case Constants.TILE_ROAD:
      return false;
    default:
      throw Error(`unknown tile type: ${type}`);
  }
}
