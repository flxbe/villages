import { setAnimation } from "./animations.js";
import { getTileCenter } from "./util.js";

let callbacks = [];
let STATE = undefined;

const State = {};
export default State;

State.reset = function() {
  STATE = {
    map: undefined,
    storage: {
      food: 500,
      wood: 500
    },
    deers: {},
    trees: {},

    mode: "normal",

    // build mode
    blueprintName: null,

    // debug options
    grid: false,
    renderHitAreas: false,

    // camera
    offsetX: 200,
    offsetY: 200,

    // mouse state
    mouseIsoX: 0,
    mouseIsoY: 0,
    clickStartX: 0,
    clickStartY: 0,
    leftMouseDown: false,
    rightMouseDown: false,
    hoveredElement: null,
    selection: null,

    ctrlDown: false
  };
};

State.subscribe = function(callback) {
  callbacks.push(callback);
};

State.unsubscribe = function(callback) {
  callbacks = callbacks.filter(c => c !== callback);
};

State.get = function() {
  return STATE;
};

/**
 * Update the current State by applying an update from the server.
 *
 * @param {object} action
 */
State.update = function(action = {}) {
  console.log(`State: ${action.type}`);

  switch (action.type) {
    case "SET_MAP": {
      STATE.map = action.map;
      //Map.renderTexture();
      break;
    }
    case "UPDATE_MAP": {
      for (let update of action.mapUpdates) {
        STATE.map[update.i][update.j] = update.tile;
      }
      //Map.updateTexture(action.mapUpdates);
    }
    case "UPDATE_STORAGE": {
      Object.assign(STATE.storage, action.storage);
      break;
    }
    case "ADD_DEER": {
      const deer = action.deer;
      STATE.deers[deer.id] = deer;
      //Map.addDeer(deer);
      break;
    }
    case "UPDATE_DEER": {
      Object.assign(STATE.deers[action.deer.id], action.deer);
      break;
    }
    case "REMOVE_DEER": {
      const deer = STATE.deers[action.id];
      //OBJECT_CONTAINER.removeChild(deer.sprite);
      delete STATE.deers[action.id];
      break;
    }
    case "ADD_TREE": {
      const tree = action.tree;
      STATE.trees[tree.id] = tree;
      //Map.addTree(tree);
      break;
    }
  }

  for (let callback of callbacks) {
    callback(action);
  }
};
