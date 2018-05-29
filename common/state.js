import assert, { isArray } from "./assert.js";
import * as Constants from "./constants.js";

export function create() {
  return {
    storage: {
      wood: 140,
      food: 100
    },
    deers: {},
    trees: {},
    buildings: {}
  };
}

/**
 * Update the state object by applying an action.
 *
 * @param {object} state
 * @param {object} action
 */
export function update(state, action) {
  assert(!isArray(action));
  assert(action.type, `Action has no type: ${action}`);

  switch (action.type) {
    case "TICK": {
      state.tickTimestamp = action.timestamp;
      break;
    }
    case "LOAD_STATE": {
      Object.assign(state, action.state);
      break;
    }
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
    case "ADD_BUILDING": {
      state.buildings[action.building.id] = action.building;
      break;
    }
    case "SET_MAP": {
      state.map = action.map;
      state.mapHeight = Constants.MAP_HEIGHT;
      state.mapWidth = Constants.MAP_WIDTH;
      break;
    }
    case "UPDATE_MAP": {
      for (let update of action.mapUpdates) {
        state.map[update.i][update.j] = update.tile;
      }
      break;
    }
    case "ADD_FOOD_TILE": {
      state.foodTile = { i: action.i, j: action.j };
      break;
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
    case "INIT_CAMERA": {
      state.offsetX = 0;
      state.offsetY = 0;
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
      console.error(action);
      throw new Error("unknown action", action);
  }

  return state;
}
