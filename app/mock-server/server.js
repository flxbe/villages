import astar from "./astar.js";
import * as Actions from "./actions.js";
import State from "../state.js";
import { cart2tile } from "../util.js";
import { getPosition } from "../movement.js";
import { generateRandomMap } from "./map-generator.js";

import * as Blueprints from "../blueprints.js";
import * as Constants from "../constants.js";

let updates = [];
let updateCallback = undefined;

function pushUpdate(update) {
  updates.push(update);
}

function flushUpdates() {
  for (let update of updates) {
    updateCallback(update);
  }
  updates = [];
}

/**
 * Send a request to the server.
 *
 * Apply an user action to the server. This will possably trigger a STATE
 * change by the server. This will be replaced by a real server.
 * @param {objext} request
 */
export function serverRequest(request) {
  switch (request.type) {
    case "LOAD_MAP": {
      loadMap();
      break;
    }
    case "PLACE_BUILDING": {
      const { i, j, blueprintName } = request;
      placeBuilding(i, j, blueprintName);
      break;
    }
  }

  flushUpdates();
}

/**
 * Create a new building.
 *
 * TODO: verify, that the building can be placed.
 * @param {number} i
 * @param {number} j
 * @param {string} blueprintName
 */
function placeBuilding(i, j, blueprintName) {
  const blueprint = Blueprints[blueprintName];
  if (!blueprint) throw Error(`unknown blueprint: ${blueprintName}`);

  if (State.get().storage.wood < blueprint.wood) {
    throw Error("not enough wood");
  }

  // reduce resources
  pushUpdate(
    Actions.updateStorage({
      wood: State.get().storage.wood - blueprint.wood
    })
  );

  // update map
  const mapUpdates = [];
  for (let k = i - blueprint.height + 1; k <= i; k++) {
    for (let l = j - blueprint.width + 1; l <= j; l++) {
      mapUpdates.push({
        i: k,
        j: l,
        tile: {
          type:
            blueprintName == "road"
              ? Constants.TILE_ROAD
              : Constants.TILE_BUILDING,
          shade: blueprintName == "road" ? "0x999999" : "0x000000"
        }
      });
    }
  }

  // dispatch map updates
  pushUpdate(Actions.updateMap(mapUpdates));
}

/**
 * Start the server emulation.
 *
 * This registers a task, that is executed periodically and issues STATE
 * updates. This will eventually be replaced by a real server implementation.
 *
 * @param {function} consumeUpdate - Send Updates to the client) {
 */
export function startServer(consumeUpdate) {
  updateCallback = consumeUpdate;
}

export function serverStep() {
  const treeTile = [7, 10];
  const foodTile = [9, 13];
  const storageTile = [3, 3];

  const timestamp = Date.now();

  for (let deer of Object.values(State.get().deers)) {
    const { x: cartX, y: cartY } = getPosition(deer.path, timestamp);
    const deerTile = cart2tile(cartX, cartY);

    const isWalking = deer.path[deer.path.length - 1].timestamp > timestamp;

    if (deer.job === "wood") {
      // job: wood
      if (deer.inventory < 20) {
        if (deerTile[0] === treeTile[0] && deerTile[1] === treeTile[1]) {
          const inventory = Math.min(deer.inventory + 1, 20);
          pushUpdate(
            Actions.updateDeer({ id: deer.id, inventory, item: "wood" })
          );
        } else if (!isWalking) {
          const path = astar(deerTile, treeTile);
          pushUpdate(Actions.updateDeer({ id: deer.id, path }));
        }
      } else {
        pushUpdate(Actions.updateDeer({ id: deer.id, job: "storage" }));
      }
    } else if (deer.job === "food") {
      // job: food
      if (deer.inventory < 20) {
        if (deerTile[0] === foodTile[0] && deerTile[1] === foodTile[1]) {
          const inventory = Math.min(deer.inventory + 1, 20);
          pushUpdate(
            Actions.updateDeer({ id: deer.id, inventory, item: "food" })
          );
        } else if (!isWalking) {
          const path = astar(deerTile, foodTile);
          pushUpdate(Actions.updateDeer({ id: deer.id, path }));
        }
      } else {
        pushUpdate(Actions.updateDeer({ id: deer.id, job: "storage" }));
      }
    } else if (deer.job === "storage") {
      // job: storage
      if (deer.inventory > 0) {
        if (deerTile[0] === storageTile[0] && deerTile[1] === storageTile[1]) {
          pushUpdate(
            Actions.updateStorage({
              [deer.item]: State.get().storage[deer.item] + deer.inventory
            })
          );
          pushUpdate(Actions.updateDeer({ id: deer.id, inventory: 0 }));
        } else if (!isWalking) {
          const path = astar(deerTile, storageTile);
          pushUpdate(Actions.updateDeer({ id: deer.id, path }));
        }
      } else {
        pushUpdate(Actions.updateDeer({ id: deer.id, job: deer.profession }));
      }
    } else {
      // no job
      pushUpdate(Actions.updateDeer({ id: deer.id, job: deer.profession }));
    }
  }

  flushUpdates();
}

function loadMap() {
  const map = generateRandomMap();

  pushUpdate(Actions.setMap(map));

  pushUpdate(
    Actions.addDeer({
      id: "deer1",
      path: [{ x: 0, y: 0, timestamp: Date.now() }],
      inventory: 0,
      profession: "wood"
    })
  );
  pushUpdate(
    Actions.addDeer({
      id: "deer2",
      path: [{ x: 0, y: 0, timestamp: Date.now() }],
      inventory: 0,
      profession: "food"
    })
  );

  setTree("tree1", 2, 5);
  setTree("tree2", 3, 5);
  setTree("tree3", 4, 5);
  setTree("tree4", 5, 5);
}

function setTree(id, i, j) {
  const tile = {
    type: Constants.TILE_TREE,
    shade: "0x269a41"
  };
  pushUpdate(Actions.updateMap([{ i, j, tile }]));
  pushUpdate(Actions.addTree({ id, i, j }));
}
