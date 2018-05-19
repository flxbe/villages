import assert from "./assert.js";
import { isArray } from "./assert.js";
import * as State from "./state.js";

export default class Context {
  constructor() {
    this.state = State.create();

    this._callbackMap = [];

    this._dispatch = action => this.dispatch(action);
    this._getState = () => this.getState();

    this.clearActions();
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    if (isArray(action)) {
      for (let a of action) this.dispatch(a);
      return;
    } else if (typeof action === "function") {
      return action(this._dispatch, this._getState);
    }
    State.update(this.state, action);
    this.pushAction(action);

    this.emit(action.type, action);
    this.emit("all", action);
  }

  clearActions() {
    this._actions = [];
  }

  pushAction(action) {
    this._actions.push(action);
  }

  getActions() {
    return this._actions;
  }

  on(eventName, callback) {
    assert(eventName);
    assert(callback);

    if (!this._callbackMap[eventName]) {
      this._callbackMap[eventName] = [];
    }

    this._callbackMap[eventName].push(callback);
  }

  off(eventName, callback) {
    assert(eventName);
    assert(callback);

    if (!this._callbackMap[eventName]) return;

    this._callbackMap[eventName] = this._callbackMap[eventName].filter(
      c => c !== callback
    );
  }

  emit(eventName, data) {
    const callbacks = this._callbackMap[eventName];
    if (callbacks) {
      for (let callback of callbacks) {
        callback(data);
      }
    }
  }
}
