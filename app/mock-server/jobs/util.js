import { cart2tile } from "../../util.js";
import { getPosition } from "../../movement.js";

export function getTile(context, object) {
  const { x: cartX, y: cartY } = getPosition(object.path, context.timestamp);
  return cart2tile(cartX, cartY);
}

export function wasWorking(object) {
  return object.state === "working";
}

export function isWalking(context, object) {
  return object.path[object.path.length - 1].timestamp > context.timestamp;
}

export function isOnTile(context, object, target) {
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
