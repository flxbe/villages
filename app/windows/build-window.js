import * as Constants from "../constants.js";
import State from "../state.js";

import Window from "../ui-framework/window.js";
import VerticalLayout from "../ui-framework/vertical-layout.js";
import HorizontalLayout from "../ui-framework/horizontal-layout.js";
import Button from "../ui-framework/button.js";
import Paragraph from "../ui-framework/paragraph.js";

export default function openBuildWindow() {
    const window = new Window();

    const hl = new HorizontalLayout(5);
    window.container.addChild(hl);

    const vl1 = new VerticalLayout(5);
    hl.addChild(vl1);

    const vl2 = new VerticalLayout(5);
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

    window.setSize(hl.children.length * (Constants.BUILDMENU_BUTTON_SIZE + 5) + 5, Math.max(vl1.children.length, vl2.children.length) * (Constants.BUILDMENU_BUTTON_SIZE + 5) + 5 + Constants.WINDOW_TOP_BORDER_SIZE);

    vl1._recalc();
    vl2._recalc();
    hl._recalc();

    const { applicationWidth } = State.get();
    window.show(applicationWidth - window._width, 0);
}
