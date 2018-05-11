import { isArray } from "../common/assert.js";
import * as State from "../common/state.js";

let callbackMap = {};
let state = undefined;

export default {
  reset,
  get,
  update,
  on,
  off
};

function reset() {
  state = State.create();
}

function on(eventName, callback) {
  if (!callback) {
    throw new Error("Callback is undefined.");
  }

  if (!callbackMap[eventName]) {
    callbackMap[eventName] = [];
  }

  callbackMap[eventName].push(callback);
}

function off(eventName, callback) {
  if (!callback) {
    throw new Error("Callback is undefined.");
  }

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

function emitAction(action) {
  emit(action.type, action);
}

function get() {
  return state;
}

function update(action) {
  State.update(state, action);

  if (isArray(action)) {
    for (let a of action) emitAction(a);
  } else {
    emitAction(action);
  }
}
