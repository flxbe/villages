import * as Constants from "../constants.js";
import State from "../state.js";
import Compositor from "../html-gui/compositor.js";

import Window from "../html-gui/window.js";
import Button from "../html-gui/button.js";
import Paragraph from "../html-gui/paragraph.js";

export default function openBuildMenu() {
  const window = new Window({
    title: "Build Menu",
    width: 150,
    margin: 10,
    fixed: true
  });

  const houseButton = new Button("house");
  houseButton.node.addEventListener("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "house" });
  });
  window.add(houseButton);

  const barnButton = new Button("barn");
  barnButton.node.addEventListener("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "barn" });
  });
  window.add(barnButton);

  const roadButton = new Button("road");
  roadButton.node.addEventListener("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "road" });
  });
  window.add(roadButton);

  const { applicationWidth } = State.get();
  window.show(applicationWidth - window.width, 0);
}
