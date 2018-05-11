import { isArray } from "../common/assert.js";
import * as State from "../common/state.js";

export default class Context {
  constructor() {
    this.state = State.create();

    this.clearActions();
  }

  getState() {
    return this.state;
  }

  update(action) {
    if (isArray(action)) {
      for (let a of action) this.update(a);
      return;
    }

    State.update(this.state, action);
    this.pushAction(action);
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
}
