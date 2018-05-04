import { cart2tile } from "../../util.js";
import { getPosition } from "../../movement.js";

function assertContext(context) {
  if (!context) {
    throw new Error("Context is undefined");
  }
}

export function getTreeTile(context) {
  assertContext(context);
  return [7, 10];
}

export function getFoodTile(context) {
  assertContext(context);
  return [9, 13];
}

export function getStorageTile(context) {
  assertContext(context);
  return [3, 3];
}

export function getTile(context, object) {
  assertContext(context);
  const { x: cartX, y: cartY } = getPosition(object.path, context.timestamp);
  return cart2tile(cartX, cartY);
}

export function wasWorking(object) {
  return object.state === "working";
}

export function isWalking(context, object) {
  assertContext(context);
  return object.path[object.path.length - 1].timestamp > context.timestamp;
}

export function isOnTile(context, object, target) {
  assertContext(context);
  const { x: cartX, y: cartY } = getPosition(object.path, context.timestamp);
  const tile = cart2tile(cartX, cartY);

  return tile[0] === target[0] && tile[1] === target[1];
}

export function isInventoryEmpty(object) {
  return !object.inventory;
}

export function isInventoryFull(object) {
  return !(object.inventory < 20);
}
