import { TILE_ROAD } from "../common/constants.js";
export * from "./actions/client.js";
export * from "./actions/storage.js";
export * from "./actions/villagers.js";

/**
 * Update the tick timestamp.
 */
export function tick() {
  return {
    type: "TICK",
    timestamp: new Date()
  };
}

/**
 * Set the map.
 * @param {Map} map
 */
export function setMap(map) {
  return {
    type: "SET_MAP",
    map
  };
}

export function addStorageTile(i, j) {
  return [
    { type: "ADD_STORAGE_TILE", i, j },
    updateMap([{ i, j, tile: { type: TILE_ROAD } }])
  ];
}

export function addFoodTile(i, j) {
  return [
    { type: "ADD_FOOD_TILE", i, j },
    updateMap([{ i, j, tile: { type: TILE_ROAD } }])
  ];
}

/**
 * Update map tiles.
 *
 * Each MapUpdate has the form:
 * { i: number, j: number, tile: Tile }
 *
 * @param {MapUpdate[]} mapUpdates
 */
export function updateMap(mapUpdates) {
  return {
    type: "UPDATE_MAP",
    mapUpdates
  };
}

/**
 * Add a new deer to the server STATE.
 * @param {Deer} deer
 */
export function addDeer(deer) {
  return {
    type: "ADD_DEER",
    deer
  };
}

/**
 * Update an already existing deer.
 * @param {DeerUpdate} deer
 */
export function updateDeer(deer) {
  return {
    type: "UPDATE_DEER",
    deer
  };
}

/**
 * Remove the deer specified by the id.
 * @param {string} id The deer id.
 */
export function removeDeer(id) {
  return {
    type: "REMOVE_DEER",
    id
  };
}

/**
 * Add a new tree.
 * @param {Tree} tree
 */
export function addTree(tree) {
  return {
    type: "ADD_TREE",
    tree
  };
}
