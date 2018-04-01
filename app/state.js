import { setAnimation } from "./animations.js";
import Map from "./map.js";
import { getTileCenter } from "./util.js";

/**
 * Defines the current STATE of the complete game.
 */
const STATE = {
  map: undefined,
  storage: {
    food: 500,
    wood: 500
  },
  deers: {},
  trees: {},
  buildings: {}
};

export default { get, update };

function get() {
  return STATE;
}

/**
 * Update the current STATE by applying an update from the server.
 *
 * @param {object} action
 */
function update(action) {
  console.log(`STATE: ${action.type}`);

  switch (action.type) {
    case "SET_MAP": {
      STATE.map = action.map;
      Map.renderTexture();
      break;
    }
    case "UPDATE_MAP": {
      for (let update of action.mapUpdates) {
        STATE.map[update.i][update.j] = update.tile;
      }
      Map.updateTexture(action.mapUpdates);
    }
    case "UPDATE_STORAGE": {
      Object.assign(STATE.storage, action.storage);
      break;
    }
    case "ADD_DEER": {
      const deer = action.deer;
      STATE.deers[deer.id] = deer;
      Map.addDeer(deer);
      break;
    }
    case "UPDATE_DEER": {
      Object.assign(STATE.deers[action.deer.id], action.deer);
      break;
    }
    case "REMOVE_DEER": {
      const deer = STATE.deers[action.id];
      OBJECT_CONTAINER.removeChild(deer.sprite);
      delete STATE.deers[action.id];
      break;
    }
    case "ADD_TREE": {
      const tree = action.tree;
      STATE.trees[tree.id] = tree;
      Map.addTree(tree);
      break;
    }
    case "ADD_BUILDING": {
      const building = action.building;
      STATE.buildings[building.id] = building;
      Map.addBuilding(building);
      break;
    }
  }
}
