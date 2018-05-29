import Context from "../common/context.js";

let context;

export default {
  reset,
  getState,
  dispatch,
  on,
  off
};

function reset() {
  context = new Context();
}

function on(eventName, callback) {
  return context.on(eventName, callback);
}

function off(eventName, callback) {
  return context.off(eventName, callback);
}
function getState() {
  return context.getState();
}

function dispatch(action) {
  return context.dispatch(action);
}
