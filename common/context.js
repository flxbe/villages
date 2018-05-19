import { isArray } from "./assert.js";
import * as State from "./state.js";

export default class Context {
  constructor() {
    this.state = State.create();

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
