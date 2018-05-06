import * as Actions from "../actions.js";

import assert from "../../assert.js";
import { cart2tile } from "../../util.js";
import { getPosition } from "../../movement.js";

const INVENTORY_CAPACITY = 20;

export function getTreeTile(context) {
  assert(context);
  return [7, 10];
}

export function getFoodTile(context) {
  assert(context);
  return [9, 13];
}

export function getStorageTile(context) {
  assert(context);
  return [3, 3];
}

export function getTile(context, object) {
  assert(context);
  assert(object);
  const { x: cartX, y: cartY } = getPosition(object.path, context.timestamp);
  return cart2tile(cartX, cartY);
}

export function wasWorking(object) {
  assert(object);
  return object.state === "working";
}

export function isWalking(context, object) {
  assert(context);
  assert(object);
  return object.path[object.path.length - 1].timestamp > context.timestamp;
}

export function isOnTile(context, object, target) {
  assert(context);
  assert(object);
  const { x: cartX, y: cartY } = getPosition(object.path, context.timestamp);
  const tile = cart2tile(cartX, cartY);

  return tile[0] === target[0] && tile[1] === target[1];
}

export function isInventoryEmpty(object) {
  assert(object);
  return !object.inventory;
}

export function isInventoryFull(object) {
  assert(object);
  return getFreeInventorySpace(object) === 0;
}

export function getFreeInventorySpace(object) {
  assert(object);
  return INVENTORY_CAPACITY - object.inventory;
}

export function incInventoryItem(object, item, amount) {
  assert(object);
  amount = Math.min(amount, getFreeInventorySpace(object));
  return Actions.updateDeer({
    id: object.id,
    item,
    inventory: object.inventory + amount
  });
}
