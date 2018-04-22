import * as Constants from "../constants.js";
import State from "../state.js";
import Compositor from "../ui-framework/compositor.js";

import Window from "../ui-framework/window.js";
import LinearLayout from "../ui-framework/linear-layout.js";
import Button from "../ui-framework/button.js";
import Paragraph from "../ui-framework/paragraph.js";

export default function openBuildWindow() {
    const name = `Build Menu`;
    let window = Compositor.getWindow(name);

    if (window) {
        Compositor.pushToFront(window);
        return;
    }

    window = new Window({
        name,
        title: `Build Menu`,
        width: 115,
        height: 175,
        margin: 5,
        spacing: 5
    });

    const hl = new LinearLayout({ margin: 5, spacing: 5, horizontal: true });
    window.container.addChild(hl);

    const vl1 = new LinearLayout({ spacing: 5 });
    hl.addChild(vl1);

    const vl2 = new LinearLayout({ spacing: 5 });
    hl.addChild(vl2);

    const houseButton = new Button("house");
    houseButton.setSize(Constants.BUILDMENU_BUTTON_SIZE, Constants.BUILDMENU_BUTTON_SIZE);
    houseButton.on("click", event => {
        State.update({ type: "ENTER_BUILD_MODE", blueprintName: "house" });
        event.stopPropagation();
    });
    vl1.addChild(houseButton);

    const barnButton = new Button("barn");
    barnButton.setSize(Constants.BUILDMENU_BUTTON_SIZE, Constants.BUILDMENU_BUTTON_SIZE);
    barnButton.on("click", event => {
        State.update({ type: "ENTER_BUILD_MODE", blueprintName: "barn" });
        event.stopPropagation();
    });
    vl1.addChild(barnButton);

    const roadButton = new Button("road");
    roadButton.setSize(Constants.BUILDMENU_BUTTON_SIZE, Constants.BUILDMENU_BUTTON_SIZE);
    roadButton.on("click", event => {
        State.update({ type: "ENTER_BUILD_MODE", blueprintName: "road" });
        event.stopPropagation();
    });
    vl2.addChild(roadButton);

    vl2.update();
    vl1.update();
    hl.update();

    const { applicationWidth } = State.get();
    window.show(applicationWidth - window._width, 0);
}
