import * as Constants from "../constants.js";
import State from "../state.js";
import Window from "./window.js";

let windowLayer = null;

export default {
  mount,
  unmount,
  clear,
  reset,
  pushToFront,
  add,
  remove,
  getIndex,
  getWindow
};

function assertReady() {
  if (!windowLayer) {
    throw new Error("The compositor must first be mounted.");
  }
}

function assertWindow(window) {
  if (!(window instanceof Window)) {
    throw new Error("`window` must be an instance of `Window`.");
  }
}

function assertIsChild(window) {
  const index = getIndex(window);
  if (index === -1) throw new Error("`window` is no child of the compositor.");
}

/**
 * Mount the compositor to a DOM node.
 *
 * @param {Element} node - the compositor DOM root node
 */
function mount(node) {
  if (node.children.length) {
    throw new Error("The mount node must not have children.");
  }
  windowLayer = node;
}

function unmount() {
  windowLayer = null;
}

/**
 * Remove all windows.
 */
function clear() {
  if (!windowLayer) return;

  while (windowLayer.children.length) {
    remove(windowLayer.firstChild._owner);
  }
}

function reset() {
  clear();
  unmount();
}

/**
 * Should push the window to the front after it has been clicked.
 *
 * @param {Window} window - A registered window.
 * @throws If window is not an instance of `Window`.
 * @throws If the window is not registered at the compositor.
 */
function pushToFront(window) {
  assertReady();
  assertWindow(window);
  assertIsChild(window);
  if (windowLayer.lastChild === window.node) return;

  // if the reference element is null, the node will be placed at the end.
  // If the node is already a child of the parnt element, it is first removed
  // and then again added at the new position.
  windowLayer.insertBefore(window.node, null);
}

/**
 * Return the window with specified name or `undefined`.
 *
 * @param {string} name - The window name.
 */
function getWindow(name) {
  assertReady();

  for (let node of windowLayer.children) {
    if (node._owner.name === name) return node._owner;
  }
  return undefined;
}

/**
 * Get the display index of a registered window. If the window is not
 * registered, it returns `-1`.
 *
 * @param {Window} window - A window instance.
 * @throws If window is not an instance of `Window`.
 */
function getIndex(window) {
  assertReady();
  assertWindow(window);

  let i = 0;
  for (let node of windowLayer.children) {
    if (node === window.node) return i;
    i++;
  }

  return -1;
}

/**
 * Add a new window to the UI.
 *
 * @param {Window} window - A window instance.
 * @throws If window is not an instance of `Window`.
 */
function add(window) {
  assertReady();
  assertWindow(window);

  windowLayer.appendChild(window.node);
  window._onMount();

  window.node.addEventListener("mousedown", () => {
    pushToFront(window);
  });
}

/**
 * Remove a window from the UI. If the the window is not registered, nothing
 * happens.
 *
 * @param {Window} window - A window instance.
 * @throws If window is not an instance of `Window`.
 * @throws If the window is not registered.
 */
function remove(window) {
  assertReady();
  assertWindow(window);
  assertIsChild(window);

  windowLayer.removeChild(window.node);
  window._onUnmount();
}
