import * as Actions from "../actions.js";

import assert from "../../common/assert.js";
import Point from "../../common/point.js";
import { getMovement } from "../../common/util.js";

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
  const { tickTimestamp } = context.getState();
  const { position } = getMovement(object.path, tickTimestamp);

  // TODO: return point
  return position.toTile().toArray();
}

export function wasWorking(object) {
  assert(object);
  return object.state === "working";
}

export function isWalking(context, object) {
  assert(context);
  assert(object);
  return (
    object.path[object.path.length - 1].timestamp >
    context.getState().tickTimestamp
  );
}

export function isOnTile(context, object, target) {
  assert(context);
  assert(object);
  const { tickTimestamp } = context.getState();
  const { position } = getMovement(object.path, tickTimestamp);

  const { i, j } = position.toTile();
  return i === target[0] && j === target[1];
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
