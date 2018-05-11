import assert, { isArray } from "./assert.js";

export function create() {
  return {
    storage: {},
    deers: {},
    trees: {}
  };
}

/**
 * Update the state object by applying an action.
 *
 * @param {object} state
 * @param {object} action
 */
export function update(state, action) {
  if (isArray(action)) {
    return action.reduce(update, state);
  }

  assert(action.type, `Action has no type: ${action}`);
  switch (action.type) {
    case "SET_APPLICATION_SIZE": {
      state.applicationHeight = action.height;
      state.applicationWidth = action.width;
      break;
    }
    case "RESET_MODE": {
      state.mode = "normal";
      state.blueprintName = null;
      state.selectedElement = null;
      break;
    }
    case "ENTER_BUILD_MODE": {
      state.mode = "build";
      state.blueprintName = action.blueprintName;
      state.selectedElement = null;
      break;
    }
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
      state.deers[deer.id] = deer;
      break;
    }
    case "UPDATE_DEER": {
      Object.assign(state.deers[action.deer.id], action.deer);
      break;
    }
    case "REMOVE_DEER": {
      const deer = state.deers[action.id];
      delete state.deers[action.id];
      break;
    }
    case "ADD_TREE": {
      const tree = action.tree;
      state.trees[tree.id] = tree;
      break;
    }
    case "MOVE": {
      state.timestamp = action.timestamp;
      break;
    }
    case "TOGGLE_HIT_AREAS": {
      state.renderHitAreas = !state.renderHitAreas;
      break;
    }
    case "TOGGLE_GRID": {
      state.renderGrid = !state.renderGrid;
      break;
    }
    case "UPDATE_MOSE_POSITION": {
      state.mouseIsoX = action.x;
      state.mouseIsoY = action.y;
      break;
    }
    case "SET_CTRL_state": {
      state.ctrlDown = action.value;
      break;
    }
    case "HOVER": {
      state.hoveredElement = action.element;
      break;
    }
    case "SELECT": {
      state.selectedElement = action.element;
      break;
    }
    case "MOVE_CAMERA": {
      state.offsetX += action.dX || 0;
      state.offsetY += action.dY || 0;
      break;
    }
    case "UPDATE_MAP_SIZE": {
      state.mapHeight = action.height;
      state.mapwidth = action.width;
      state.mapOffsetX = action.width / 2.0;
      break;
    }
    default:
      assert(false, `Unknwon action: ${action}`);
  }

  return state;
}