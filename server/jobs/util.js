import * as Actions from "../actions.js";

import assert from "../../common/assert.js";
import Point from "../../common/point.js";
import { getMovement } from "../../common/util.js";

const INVENTORY_CAPACITY = 20;

export function getTreeTile(context) {
  assert(context);
  const { treeTile } = context.getState();
  assert(treeTile);
  return Point.fromTile(treeTile.i, treeTile.j);
}

export function getFoodTile(context) {
  assert(context);
  const { foodTile } = context.getState();
  assert(foodTile);
  return Point.fromTile(foodTile.i, foodTile.j);
}

export function getStorageTile(context) {
  assert(context);
  const { storageTile } = context.getState();
  assert(storageTile);
  return Point.fromTile(storageTile.i, storageTile.j);
}

export function getTile(context, object) {
  assert(context);
  assert(object);
  const { tickTimestamp } = context.getState();
  const { position } = getMovement(object.path, tickTimestamp);
  return position.toTile();
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
