import * as Constants from "../constants.js";
import State from "../state.js";
import Window from "./window.js";

const Compositor = new PIXI.Container();

export default {
  reset,
  pushToFront,
  add,
  remove,
  getIndex,
  getWindow,
  get
};

function assertWindow(window) {
  if (!window instanceof Window) {
    throw new Error("`window` must be an instance of `Window`.");
  }
}

/**
 * Should push the window to the front after it has been clicked.
 *
 * TODO: check, whether window is in child array.
 *
 * @param {Window} window - A registered window.
 * @throws If window is not an instance of `Window`.
 */
function pushToFront(window) {
  assertWindow(window);

  const index = Compositor.children.indexOf(window);
  if (index == Compositor.children.length - 1) return;

  for (let i = index + 1; i < Compositor.children.length; i++) {
    Compositor.children[i - 1] = Compositor.children[i];
  }
  Compositor.children[Compositor.children.length - 1] = window;
}

/**
 * Reset the internal state.
 */
function reset() {
  while (Compositor.children) {
    Compositor.removeChild(Compositor.getChildAtIndex(0));
  }
}

/**
 * Return the window with specified name or `undefined`.
 *
 * @param {string} name - The window name.
 */
function getWindow(name) {
  assertWindow(window);

  for (let window of Compositor.children) {
    if (window.name === name) return window;
  }
  return undefined;
}

/**
 * Get the display index of a registered window.
 *
 * @param {Window} window - A window instance.
 * @throws If window is not an instance of `Window`.
 * @throws If the window is not registered.
 */
function getIndex(window) {
  assertWindow(window);

  return Compositor.getChildIndex(window);
}

/**
 * Add a new window to the UI.
 *
 * @param {Window} window - A window instance.
 * @throws If window is not an instance of `Window`.
 */
function add(window) {
  assertWindow(window);

  Compositor.addChild(window);

  const onMouseDown = () => pushToFront(window);

  window.interactive = true;
  window.on("mousedown", onMouseDown);
  window.once("removed", () => {
    window.removeListener("mousedown", onMouseDown);
  });
}

/**
 * Remove a window from the UI. If the the window is not registered, nothing
 * happens.
 *
 * @param {Window} window - A window instance.
 * @throws If window is not an instance of `Window`.
 */
function remove(window) {
  assertWindow(window);

  Compositor.removeChild(window);
}

function get() {
  return Compositor;
}
