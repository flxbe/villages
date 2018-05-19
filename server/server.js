import Context from "../common/context.js";
import * as Actions from "./actions.js";

import executeRequest from "./requests.js";
import scheduleJobs from "./scheduler.js";

const context = new Context();
let updateCallback = undefined;

function flushUpdates() {
  updateCallback(context.getActions());
  context.clearActions();
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
  updateCallback = consumeUpdate;
}

/**
 * Compute the next server tick
 */
export function tick() {
  context.dispatch(Actions.tick());
  scheduleJobs(context);
  flushUpdates();
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
  flushUpdates();
}
