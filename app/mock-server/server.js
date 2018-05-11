import Context from "../context.js";

import executeRequest from "./requests.js";
import scheduleJobs from "./scheduler.js";

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
function getContext() {
  return {
    timestamp: Date.now(),
    getState: Context.get,
    pushUpdate
  };
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
  const context = getContext();
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
  const context = getContext();
  executeRequest(context, request);

  flushUpdates();
}
