import astar from "../astar.js";
import * as Actions from "../actions.js";

import assert from "../../common/assert.js";
import Point from "../../common/point.js";
import { getMovement } from "../../common/util.js";

const INVENTORY_CAPACITY = 20;

export function getPathToTile(context, start, target) {
  const map = context.getState().map;
  return astar(map, start, end);
}

/**
 * Get a path from a start tile next to the target tile.
 *
 * @param {Context} context
 * @param {Point} start - start tile
 * @param {Point} target - end tile
 */
export function getPathNextToTile(context, start, target) {
  const path = getPathToTile(context, start, target);
  if (!path) return path;
  return path.slice(0, -1);
}

export function goToStorage(context, villager) {
  const { map } = context.getState();
  const villagerTile = getTile(context, villager);
  const path = astar(map, villagerTile, getStorageTile(context));

  context.dispatch(Actions.setVillagerTarget(villager.id, "storage", path));
}

export function goToFood(context, villager) {
  const { map } = context.getState();
  const villagerTile = getTile(context, villager);
  const path = astar(map, villagerTile, getFoodTile(context));

  context.dispatch(Actions.setVillagerTarget(villager.id, "food", path));
}
export function goToTree(context, villager) {
  const { map } = context.getState();
  const villagerTile = getTile(context, villager);
  const path = astar(map, villagerTile, getTreeTile(context));

  context.dispatch(Actions.setVillagerTarget(villager.id, "wood", path));
}

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

export function startWorking(context, villager) {
  context.dispatch(Actions.setVillagerState(villager.id, "working"));
}

export function startJob(context, villager, job) {
  context.dispatch(Actions.setVillagerJob(villager.id, job));
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

export function wasWalking(object) {
  assert(object);
  return object.state === "walking";
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

export function incInventoryItem(context, villager, item, amount) {
  assert(villager);
  amount = Math.min(amount, getFreeInventorySpace(villager));
  context.dispatch(
    Actions.setVillagerInventory(villager.id, item, villager.inventory + amount)
  );
}
export function storeInventory(context, villager) {
  context.dispatch(
    Actions.updateStorage({
      [villager.item]:
        context.getState().storage[villager.item] + villager.inventory
    })
  );
  context.dispatch(Actions.setVillagerInventory(villager.id, villager.item, 0));
}
