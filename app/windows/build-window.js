import State from "../state.js";

import Window from "../ui-framework/window.js";
import VerticalLayout from "../ui-framework/vertical-layout.js";
import HorizontalLayout from "../ui-framework/horizontal-layout.js";
import Button from "../ui-framework/button.js";
import Paragraph from "../ui-framework/paragraph.js";

export default function openBuildWindow() {
    const window = new Window();
    const buttonWidth = 50;
    const buttonHeight = 50;

    const v1 = new VerticalLayout(5);
    window.container.addChild(v1);
    v1.x = 5;

    const v2 = new VerticalLayout(5);
    window.container.addChild(v2);
    v2.x = buttonWidth + 10;

    const houseButton = new Button("house");
    houseButton.setSize(buttonWidth, buttonHeight);
    houseButton.on("click", event => {
        State.update({ type: "ENTER_BUILD_MODE", blueprintName: "house" });
        event.stopPropagation();
    });
    v1.addChild(houseButton);

    const barnButton = new Button("barn");
    barnButton.setSize(buttonWidth, buttonHeight);
    barnButton.on("click", event => {
        State.update({ type: "ENTER_BUILD_MODE", blueprintName: "barn" });
        event.stopPropagation();
    });
    v1.addChild(barnButton);

    const roadButton = new Button("road");
    roadButton.setSize(buttonWidth, buttonHeight);
    roadButton.on("click", event => {
        State.update({ type: "ENTER_BUILD_MODE", blueprintName: "road" });
        event.stopPropagation();
    });
    v2.addChild(roadButton);
    
    window.setSize( 2 * buttonWidth + 15, Math.max(v1.children.length, v2.children.length) * (buttonHeight + 5) + 45);

    v1._recalc();
    v2._recalc();

    const { applicationWidth } = State.get();
    window.show(applicationWidth - window._width, 0);
}
