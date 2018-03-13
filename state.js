/**
 * Defines the current state of the complete game.
 */

"use strict";

const state = {
  map: undefined,
  storage: {
    food: 0,
    wood: 0
  },
  deers: {}
};

/**
 * Update the current state by applying an update from the server.
 *
 * @param {object} action
 */
function updateState(action) {
  console.log(`UPDATE STATE: ${action.type}`);

  switch (action.type) {
    case "SET_MAP": {
      state.map = action.map;
      return;
    }
    case "UPDATE_STORAGE": {
      Object.assign(state.storage, action.storage);
      return;
    }
    case "ADD_DEER": {
      const deer = action.deer;
      deer.sprite = new PIXI.Sprite();
      setAnimation(deer, "STAND");
      app.stage.addChild(deer.sprite);
      state.deers[deer.id] = deer;
      return;
    }
    case "UPDATE_DEER": {
      Object.assign(state.deers[action.deer.id], action.deer);
      return;
    }
    case "REMOVE_DEER": {
      const deer = state.deers[action.id];
      app.stage.removeChild(deer.sprite);
      delete state.deers[action.id];
      return;
    }
  }
}