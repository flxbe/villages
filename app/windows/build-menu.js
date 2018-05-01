import * as Constants from "../constants.js";
import State from "../state.js";
import Compositor from "../html-gui/compositor.js";

import Window from "../html-gui/window.js";
import Button from "../html-gui/button.js";
import Paragraph from "../html-gui/paragraph.js";
import compositor from "../html-gui/compositor.js";

let buildMenuWindow;

function create() {
  buildMenuWindow = new Window({
    title: "Build Menu",
    width: 150,
    margin: 10,
    fixed: true
  });

  const houseButton = new Button("house");
  houseButton.node.addEventListener("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "house" });
  });
  buildMenuWindow.add(houseButton);

  const barnButton = new Button("barn");
  barnButton.node.addEventListener("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "barn" });
  });
  buildMenuWindow.add(barnButton);

  const roadButton = new Button("road");
  roadButton.node.addEventListener("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "road" });
  });
  buildMenuWindow.add(roadButton);

  State.on("SET_APPLICATION_SIZE", updatePosition);
  updatePosition();

  Compositor.add(buildMenuWindow);
}

function updatePosition() {
  const { applicationWidth } = State.get();
  buildMenuWindow.show(applicationWidth - buildMenuWindow.width, 0);
}

export function toggleBuildMenu() {
  if (!buildMenuWindow) create();
  else buildMenuWindow.visible = !buildMenuWindow.visible;
}
