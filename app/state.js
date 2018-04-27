let callbackMap = {};
let STATE = undefined;

export default {
  reset,
  get,
  update,
  on,
  off
};

function reset() {
  STATE = {
    timestamp: undefined,
    applicationHeight: 0,
    applicationWidth: 0,

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
    renderGrid: false,
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
}

function on(eventName, callback) {
  if (!callbackMap[eventName]) {
    callbackMap[eventName] = [];
  }

  callbackMap[eventName].push(callback);
}

function off(eventName, callback) {
  if (!callbackMap[eventName]) return;

  callbackMap[eventName] = callbackMap[eventName].filter(c => c !== callback);
}

function emit(eventName, data) {
  const callbacks = callbackMap[eventName];
  if (callbacks) {
    for (let callback of callbacks) {
      callback(data);
    }
  }
}

function get() {
  return STATE;
}

/**
 * Update the current State by applying an update from the server.
 *
 * @param {object} action
 */
function update(action = {}) {
  switch (action.type) {
    case "SET_APPLICATION_SIZE": {
      STATE.applicationHeight = action.height;
      STATE.applicationWidth = action.width;
      break;
    }
    case "RESET_MODE": {
      STATE.mode = "normal";
      STATE.blueprintName = null;
      STATE.selectedElement = null;
      break;
    }
    case "ENTER_BUILD_MODE": {
      STATE.mode = "build";
      STATE.blueprintName = action.blueprintName;
      STATE.selectedElement = null;
      break;
    }
    case "SET_MAP": {
      STATE.map = action.map;
      break;
    }
    case "UPDATE_MAP": {
      for (let update of action.mapUpdates) {
        STATE.map[update.i][update.j] = update.tile;
      }
    }
    case "UPDATE_STORAGE": {
      Object.assign(STATE.storage, action.storage);
      break;
    }
    case "ADD_DEER": {
      const deer = action.deer;
      STATE.deers[deer.id] = deer;
      break;
    }
    case "UPDATE_DEER": {
      Object.assign(STATE.deers[action.deer.id], action.deer);
      break;
    }
    case "REMOVE_DEER": {
      const deer = STATE.deers[action.id];
      delete STATE.deers[action.id];
      break;
    }
    case "ADD_TREE": {
      const tree = action.tree;
      STATE.trees[tree.id] = tree;
      break;
    }
    case "MOVE": {
      STATE.timestamp = action.timestamp;
      break;
    }
    case "TOGGLE_HIT_AREAS": {
      STATE.renderHitAreas = !STATE.renderHitAreas;
      break;
    }
    case "TOGGLE_GRID": {
      STATE.renderGrid = !STATE.renderGrid;
      break;
    }
    case "UPDATE_MOSE_POSITION": {
      STATE.mouseIsoX = action.x;
      STATE.mouseIsoY = action.y;
      break;
    }
    case "SET_CTRL_STATE": {
      STATE.ctrlDown = action.value;
      break;
    }
    case "HOVER": {
      STATE.hoveredElement = action.element;
      break;
    }
    case "SELECT": {
      STATE.selectedElement = action.element;
      break;
    }
    case "MOVE_CAMERA": {
      STATE.offsetX += action.dX || 0;
      STATE.offsetY += action.dY || 0;
      break;
    }
    case "UPDATE_MAP_SIZE": {
      STATE.mapHeight = action.height;
      STATE.mapwidth = action.width;
      STATE.mapOffsetX = action.width / 2.0;
      break;
    }
  }

  emit(action.type, action);
}
