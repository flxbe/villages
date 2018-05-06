import { cart2tile } from "../../util.js";
import { getPosition } from "../../movement.js";

const INVENTORY_CAPACITY = 20;

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion Error");
  }
}

function assertContext(context) {
  assert(context, "Context is undefined");
}

function assertObject(object) {
  assert(object, "Object is undefined");
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
  assertObject(object);
  const { x: cartX, y: cartY } = getPosition(object.path, context.timestamp);
  return cart2tile(cartX, cartY);
}

export function wasWorking(object) {
  assertObject(object);
  return object.state === "working";
}

export function isWalking(context, object) {
  assertContext(context);
  assertObject(object);
  return object.path[object.path.length - 1].timestamp > context.timestamp;
}

export function isOnTile(context, object, target) {
  assertContext(context);
  assertObject(object);
  const { x: cartX, y: cartY } = getPosition(object.path, context.timestamp);
  const tile = cart2tile(cartX, cartY);

  return tile[0] === target[0] && tile[1] === target[1];
}

export function isInventoryEmpty(object) {
  assertObject(object);
  return !object.inventory;
}

export function isInventoryFull(object) {
  assertObject(object);
  return !(object.inventory < INVENTORY_CAPACITY);
}

export function getFreeInventorySpace(object) {
  assertObject(object);
  return INVENTORY_CAPACITY - object.inventory;
}

export function incInventoryItem(object, item, amount) {
  assertObject(object);
  amount = Math.max(amount, getFreeInventorySpace(object));
  return Actions.updateDeer({
    id: object.id,
    item,
    inventory: object.inventory + amount
  });
}
