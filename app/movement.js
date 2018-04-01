import { getDirection } from "./util.js";

/**
 * Return the current position of an object, that moves the the specified path.
 *
 * The position is evaluated at the specified time.
 *
 * @param {PathNode[]} path - the path
 * @param {number} currentTime - current time in milliseconds
 */
export function getPosition(path, currentTime) {
  if (currentTime < path[0].timestamp) return path[0];

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
      x: lastNode.x + delta * dX,
      y: lastNode.y + delta * dY,
      direction: getDirection(
        lastNode.x,
        lastNode.y,
        currentNode.x,
        currentNode.y
      )
    };
  }

  return {
    x: lastNode.x,
    y: lastNode.y,
    direction: undefined
  };
}
