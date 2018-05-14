import * as Constants from "./constants.js";
import assert from "./assert.js";
import Point from "./point.js";

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
 * Return the current position of an object, that moves on the specified path.
 *
 * The position is evaluated at the specified time.
 *
 * @param {PathNode[]} path - the path
 * @param {number} currentTime - current time in milliseconds
 * @returns {Movement} the current movement of the object
 */
export function getMovement(path, currentTime) {
  assert(currentTime >= path[0].timestamp);

  let lastNode = path[0];
  for (let i = 1; i < path.length; i++) {
    const currentNode = path[i];

    if (currentTime > path[i].timestamp) {
      lastNode = currentNode;
      continue;
    }

    const dX = currentNode.x - lastNode.x;
    const dY = currentNode.y - lastNode.y;
    const delta =
      (currentTime - lastNode.timestamp) /
      (currentNode.timestamp - lastNode.timestamp);

    return {
      position: Point.fromCart(
        lastNode.x + delta * dX,
        lastNode.y + delta * dY
      ),
      direction: getDirection(
        lastNode.x,
        lastNode.y,
        currentNode.x,
        currentNode.y
      )
    };
  }

  return {
    position: Point.fromCart(lastNode.x, lastNode.y),
    direction: undefined
  };
}

/**
 * Check, whether an object is currently on the specified tile.
 *
 * @param {Context} context - The world context
 * @param {Object} object - The world object
 * @param {Point} target - The tile coordinates
 */
export function isOnTile(context, object, target) {
  assert(context);
  assert(object);
  assert(target);
  assert(target.isTile());
  const { tickTimestamp } = context.getState();
  const { position } = getMovement(object.path, tickTimestamp);

  position.toTile();
  return position.i === target.i && position.j === target.j;
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
