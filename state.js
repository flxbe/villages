/**
 * Defines the current state of the complete game.
 */

"use strict";

const state = {
  map: undefined,
  storage: {
    food: 500,
    wood: 500
  },
  deers: {},
  trees: {}
};

const uiState = {
  blueprint: "house",
  mode: "normal",
  grid: false
};

/**
 * Update the current state by applying an update from the server.
 *
 * @param {object} action
 */
function updateState(action) {
  console.groupCollapsed(`state: ${action.type}`);
  console.log("prev state", state);
  console.log("action", action);

  switch (action.type) {
    case "SET_MAP": {
      state.map = action.map;
      break;
    }
    case "UPDATE_MAP": {
      for (let update of action.mapUpdates) {
        state.map[update.i][update.j] = update.tile;
      }
    }
    case "UPDATE_STORAGE": {
      Object.assign(state.storage, action.storage);
      break;
    }
    case "ADD_DEER": {
      const deer = action.deer;
      deer.sprite = new PIXI.Sprite();
      setAnimation(deer, "STAND");
      app.stage.addChild(deer.sprite);
      state.deers[deer.id] = deer;
      break;
    }
    case "UPDATE_DEER": {
      Object.assign(state.deers[action.deer.id], action.deer);
      break;
    }
    case "REMOVE_DEER": {
      const deer = state.deers[action.id];
      app.stage.removeChild(deer.sprite);
      delete state.deers[action.id];
      break;
    }
    case "ADD_TREE": {
      const tree = action.tree;
      tree.sprite = new PIXI.Sprite();
      setAnimation(tree, "PINE_TREE");
      app.stage.addChild(tree.sprite);
      state.trees[tree.id] = tree;
      break;
    }
  }

  console.log("next state", state);
  console.groupEnd();
}
