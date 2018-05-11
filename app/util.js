import * as Constants from "./constants.js";
import context from "./context.js";

/**
 * Convert absolute to relative coordinates.
 * @param {number} absX
 * @param {number} absY
 */
export function abs2rel(absX, absY) {
  const { offsetX, offsetY } = context.get();
  return [absX + offsetX, absY + offsetY];
}

/**
 * Convert relative to absolute coordinates.
 * @param {number} relX
 * @param {number} relY
 */
export function rel2abs(relX, relY) {
  const { offsetX, offsetY } = context.get();
  return [relX - offsetX, relY - offsetY];
}

/**
 * Convert cartesian to absolute coordinates.
 * @param {number} cartX
 * @param {number} cartY
 */
export function cart2abs(cartX, cartY) {
  const absX = cartX - cartY;
  const absY = (cartX + cartY) / 2;
  return [absX, absY];
}

/**
 * Convert absolute to cartesian coordinates.
 * @param {number} absX
 * @param {number} absY
 */
export function abs2cart(absX, absY) {
  const cartX = (2 * absY + absX) / 2;
  const cartY = (2 * absY - absX) / 2;
  return [cartX, cartY];
}

/**
 * Convert cartesian to relative coordinates.
 * @param {number} cartX
 * @param {number} cartY
 */
export function cart2rel(cartX, cartY) {
  const [absX, absY] = cart2abs(cartX, cartY);
  return abs2rel(absX, absY);
}

/**
 * Convert relative to cartesian coordinates.
 * @param {number} relX
 * @param {number} relY
 */
export function rel2cart(relX, relY) {
  const [absX, absY] = rel2abs(relX, relY);
  return abs2cart(absX, absY);
}

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
 * Convert cartesian coordinates to tile indices.
 * @param {number} cartX
 * @param {number} cartY
 */
export function cart2tile(cartX, cartY) {
  const j = Math.floor(cartX / Constants.TILE_WIDTH);
  const i = Math.floor(cartY / Constants.TILE_HEIGHT);

  return [i, j];
}

/**
 * Convert tile indices to cartesian coordinates.
 * @param {number} i
 * @param {number} j
 */
export function tile2cart(i, j) {
  return [j * Constants.TILE_WIDTH, i * Constants.TILE_HEIGHT];
}

/**
 * Convert tile indices to relative coordinates.
 * @param {number} i
 * @param {number} j
 */
export function tile2rel(i, j) {
  const [absX, absY] = tile2abs(i, j);
  return abs2rel(absX, absY);
}

/**
 * Convert relative coordinates to tile indices.
 * @param {number} relX
 * @param {number} relY
 */
export function rel2tile(relX, relY) {
  const [absX, absY] = rel2abs(relX, relY);
  return abs2tile(absX, absY);
}

/**
 * Convert tile indices to relative coordinates.
 * @param {number} i
 * @param {number} j
 */
export function tile2abs(i, j) {
  const [cartX, cartY] = tile2cart(i, j);
  return cart2abs(cartX, cartY);
}

/**
 * Convert absolute coordinates to tile indices.
 * @param {number} absX
 * @param {number} absY
 */
export function abs2tile(absX, absY) {
  const [cartX, cartY] = abs2cart(absX, absY);
  return cart2tile(cartX, cartY);
}

/**
 * Check if tile indices give a tile on the map.
 * @param {number} i
 * @param {number} j
 */
export function isTileOnMap(i, j) {
  return (
    j >= 0 && j < Constants.MAP_WIDTH && i >= 0 && i < Constants.MAP_HEIGHT
  );
}

/**
 * Return cartesian coordinates of the center of the tile with given indices.
 * @param {number} i
 * @param {number} j
 */
export function getTileCenter(i, j) {
  return [(j + 0.5) * Constants.TILE_WIDTH, (i + 0.5) * Constants.TILE_HEIGHT];
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

export function getActiveTile() {
  const { mouseIsoX, mouseIsoY } = context.get();
  const [absX, absY] = rel2abs(mouseIsoX, mouseIsoY);
  return abs2tile(absX, absY);
}
