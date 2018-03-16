/**
 * Predefine all possible actions.
 */
"use strict";

const Actions = {};

/**
 * Set the map.
 * @param {Map} map
 */
Actions.setMap = function(map) {
  return {
    type: "SET_MAP",
    map
  };
};

/**
 * Update map tiles.
 *
 * Each MapUpdate has the form:
 * { i: number, j: number, tile: Tile }
 *
 * @param {MapUpdate[]} mapUpdates
 */
Actions.updateMap = function(mapUpdates) {
  return {
    type: "UPDATE_MAP",
    mapUpdates
  };
};

/**
 * Add a new deer to the server state.
 * @param {Deer} deer
 */
Actions.addDeer = function(deer) {
  return {
    type: "ADD_DEER",
    deer
  };
};

/**
 * Update an already existing deer.
 * @param {DeerUpdate} deer
 */
Actions.updateDeer = function(deer) {
  return {
    type: "UPDATE_DEER",
    deer
  };
};

/**
 * Remove the deer specified by the id.
 * @param {string} id The deer id.
 */
Actions.removeDeer = function(id) {
  return {
    type: "REMOVE_DEER",
    id
  };
};

/**
 * Add a new tree.
 * @param {Tree} tree
 */
Actions.addTree = function(tree) {
  return {
    type: "ADD_TREE",
    tree
  };
};

/**
 * Update the storage state.
 * @param {StorageUpdate} storage
 */
Actions.updateStorage = function(storage) {
  return {
    type: "UPDATE_STORAGE",
    storage
  };
};
