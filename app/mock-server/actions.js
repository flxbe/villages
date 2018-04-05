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

/**
 * Update the storage STATE.
 * @param {StorageUpdate} storage
 */
export function updateStorage(storage) {
  return {
    type: "UPDATE_STORAGE",
    storage
  };
}

/**
 * Add a new building.
 * @param {Building} building
 */
export function addBuilding(building) {
  return {
    type: "ADD_BUILDING",
    building
  };
}

/**
 * Remove the building specified by the id.
 * @param {string} id The building id.
 */
export function removeBuilding(id) {
  return {
    type: "REMOVE_BUILDING",
    id
  };
}
