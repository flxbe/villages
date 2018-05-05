import * as Constants from "../constants.js";
import State from "../state.js";

import Window from "../html-gui/window.js";
import Button from "../html-gui/button.js";
import Paragraph from "../html-gui/paragraph.js";

class BuildMenu extends Window {
  constructor() {
    super({
      title: "Build Menu",
      width: 150,
      margin: 10,
      fixed: true
    });

    this._onUpdatePosition = () => this.onUpdatePosition();
    this._onBuildHouse = () => this.onBuild("house");
    this._onBuildBarn = () => this.onBuild("barn");
    this._onBuildRoad = () => this.onBuild("road");

    this.houseButton = new Button("house");
    this.add(this.houseButton);

    this.barnButton = new Button("barn");
    this.add(this.barnButton);

    this.roadButton = new Button("road");
    this.add(this.roadButton);
  }

  onDidMount() {
    super.onDidMount();
    State.on("SET_APPLICATION_SIZE", this._onUpdatePosition);
    this.houseButton.node.addEventListener("click", this._onBuildHouse);
    this.barnButton.node.addEventListener("click", this._onBuildBarn);
    this.roadButton.node.addEventListener("click", this._onBuildRoad);
  }

  onDidUnmount() {
    super.onDidUnmount();
    State.off("SET_APPLICATION_SIZE", this._onUpdatePosition);
    this.houseButton.node.removeEventListener("click", this._onBuildHouse);
    this.barnButton.node.removeEventListener("click", this._onBuildBarn);
    this.roadButton.node.removeEventListener("click", this._onBuildRoad);
  }

  onBuild(blueprintName) {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName });
  }

  onUpdatePosition() {
    this.x = this.getXPosition();
  }

  getXPosition() {
    const { applicationWidth } = State.get();
    return applicationWidth - this.width;
  }

  show() {
    super.show(this.getXPosition(), 0);
  }
}

let visible = false;
const buildMenuWindow = new BuildMenu();

export function toggleBuildMenu() {
  if (visible) {
    visible = false;
    buildMenuWindow.close();
  } else {
    visible = true;
    buildMenuWindow.show();
  }
}
