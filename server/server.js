import Context from "../common/context.js";
import * as Constants from "../common/constants.js";
import * as Actions from "./actions.js";

import executeRequest from "./requests.js";
import scheduleJobs from "./scheduler.js";
import { generateRandomMap } from "./map-generator.js";

const context = new Context();
initContext();

function setTree(id, i, j) {
  const tile = {
    type: Constants.TILE_TREE
  };
  context.dispatch(Actions.updateMap([{ i, j, tile }]));
  context.dispatch(Actions.addTree({ id, i, j }));
}

function addDeer(id, profession) {
  context.dispatch(
    Actions.addDeer({
      id,
      profession,
      path: [{ x: 0, y: 0, timestamp: Date.now() }],
      inventory: 0,
      needs: {
        food: 100.0,
        sleep: 100.0
      },
      skills: {
        harvesting: 1,
        woodCutting: 1
      }
    })
  );
}

function initContext() {
  const map = generateRandomMap();

  context.dispatch(Actions.setMap(map));
  context.dispatch(Actions.addStorageTile(3, 3));
  context.dispatch(Actions.addFoodTile(9, 13));

  addDeer("deer1", "wood");
  addDeer("deer2", "food");
  setTree("tree1", 2, 5);
  setTree("tree2", 3, 5);
  setTree("tree3", 4, 5);
  setTree("tree4", 5, 5);
}

/**
 * Start the server emulation.
 *
 * This registers a task, that is executed periodically and issues STATE
 * updates. This will eventually be replaced by a real server implementation.
 *
 * @param {function} consumeUpdate - Send Updates to the client
 */
export function startServer(consumeUpdate) {
  context.on("all", consumeUpdate);
}

/**
 * Compute the next server tick
 */
export function tick() {
  context.dispatch(Actions.tick());
  scheduleJobs(context);
}

/**
 * Send a request to the server.
 *
 * Apply an user action to the server. This will possably trigger a STATE
 * change by the server. This will be replaced by a real server.
 * @param {objext} request
 */
export function serverRequest(request) {
  executeRequest(context, request);
}
