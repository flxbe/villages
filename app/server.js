import { startServer, tick, serverRequest } from "../server/server.js";

let callbackMap = {};

export default {
  connect,
  request,
  on,
  off
};

function on(eventName, callback) {
  if (!callbackMap[eventName]) {
    callbackMap[eventName] = [];
  }

  callbackMap[eventName].push(callback);
}

function off(eventName, callback) {
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

function consumeUpdate(update) {
  console.log(update);
  emit("update", update);
}

async function connect() {
  startServer(update => consumeUpdate(update));
  setInterval(() => tick(), 500);
}

async function request(req) {
  return await serverRequest(req);
}
