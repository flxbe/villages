import * as Constants from "./constants.js";
import State from "./state.js";

const WindowManager = new PIXI.Container();
export default WindowManager;

function pushToFront(window) {
  const index = WindowManager.children.indexOf(window);
  if (index == WindowManager.children.length - 1) return;

  for (let i = index + 1; i < WindowManager.children.length; i++) {
    WindowManager.children[i - 1] = WindowManager.children[i];
  }
  WindowManager.children[WindowManager.children.length - 1] = window;
}

WindowManager.add = function(window) {
  WindowManager.addChild(window);
  window.on("mousedown", () => pushToFront(window));
};

WindowManager.remove = function(window) {
  WindowManager.removeChild(window);
};
