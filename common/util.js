import * as Constants from "./constants.js";
import assert from "./assert.js";
import Point, { assertPoint } from "./point.js";

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
 * Get the nearest tree as seen from startTile.
 * Uses the euclidian distance.
 *
 * @param {Context} context
 * @param {Point} startTile
 */
export function getNearestTree(context, startTile) {
  assert(context);
  assertPoint(startTile);
  assert(startTile.isTile());

  const { trees } = context.getState();
  let nearestTree = undefined;
  let minDist = undefined;
  for (let tree of Object.values(trees)) {
    const dist = startTile.distance(Point.fromTile(tree.i, tree.j));
    if (!nearestTree || dist < minDist) {
      nearestTree = tree;
      minDist = dist;
    }
  }

  return nearestTree;
}

export function getNearestBuilding(context, startTile, blueprintName) {
  assert(context);
  assert(startTile);
  assert(startTile.isTile());
  assert(blueprintName);

  const { buildings } = context.getState();
  const sortedBuildings = Object.values(buildings)
    .filter(b => b.blueprintName === blueprintName)
    .sort(b => startTile.distance(Point.fromTile(b.i, b.j)))
    .reverse();

  return sortedBuildings[0];
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

  return position.toTile().equals(target);
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

export function getTileType(context, tile) {
  assert(tile.isTile());
  return context.getState().map[tile.i][tile.j].type;
}

/**
 * Check, whether a blueprint can be placed at the specified tile.
 * @param {Context} context
 * @param {Blueprint} blueprint
 * @param {Point} tile
 */
export function canBuildingBePlaced(context, blueprint, tile) {
  for (let i = 0; i < blueprint.height; i++) {
    for (let j = 0; j < blueprint.width; j++) {
      const currentTile = tile.clone().sub(i, j);
      if (!currentTile.isOnMap(context)) return false;
      if (!isBuildableTile(getTileType(context, currentTile))) return false;
    }
  }

  return true;
}

export function sufficientResources(context, blueprint) {
  return context.getState().storage.wood >= blueprint.wood;
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
