import * as Constants from "../constants.js";
import State from "../state.js";
import Compositor from "../ui-framework/compositor.js";

import Window from "../ui-framework/window.js";
import LinearLayout from "../ui-framework/linear-layout.js";
import Button from "../ui-framework/button.js";
import Paragraph from "../ui-framework/paragraph.js";

export default function openBuildWindow() {
  const window = new Window({
    title: "Build Menu",
    width: 200,
    height: 300,
    margin: 10,
    spacing: 10
  });

  const houseButton = new Button("house");
  houseButton.setSize(
    Constants.BUILDMENU_BUTTON_SIZE,
    Constants.BUILDMENU_BUTTON_SIZE
  );
  houseButton.on("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "house" });
  });
  window.add(houseButton);

  const barnButton = new Button("barn");
  barnButton.setSize(
    Constants.BUILDMENU_BUTTON_SIZE,
    Constants.BUILDMENU_BUTTON_SIZE
  );
  barnButton.on("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "barn" });
  });
  window.add(barnButton);

  const roadButton = new Button("road");
  roadButton.setSize(
    Constants.BUILDMENU_BUTTON_SIZE,
    Constants.BUILDMENU_BUTTON_SIZE
  );
  roadButton.on("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName: "road" });
  });
  window.add(roadButton);

  const { applicationWidth } = State.get();
  window.show(applicationWidth - window.width, 0);
}
