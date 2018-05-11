import Context from "./context.js";

import executeRequest from "./requests.js";
import scheduleJobs from "./scheduler.js";

const context = new Context();
let updateCallback = undefined;

function flushUpdates() {
  for (let action of context.getActions()) {
    updateCallback(action);
  }
  context.clearActions();
}

function getContext() {
  return {
    timestamp: Date.now(),
    getState: () => context.getState(),
    pushUpdate: action => context.dispatch(action)
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
  const ctx = getContext();
  scheduleJobs(ctx);
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
  const ctx = getContext();
  executeRequest(ctx, request);

  flushUpdates();
}
