import WindowManager from "../window-manager.js";
import * as Constants from "../constants.js";
import State from "../state.js";

import Button from "./button.js";

export default class Window extends PIXI.Container {
  constructor() {
    super();

    this.interactive = true;

    this._background = new PIXI.Graphics();
    this.addChild(this._background);

    // TODO: add mask to this
    this.container = new PIXI.Container();
    this.addChild(this.container);

    this._borders = new PIXI.Graphics();
    this._borders.interactive = true;
    this.addChild(this._borders);

    this._borders.on("mousedown", () => {
      this._drag = true;
    });
    this._borders.on("mouseup", () => {
      this._drag = false;
    });
    this._borders.on("mousemove", event => {
      if (!this._drag) return;
      const { mouseIsoX, mouseIsoY } = State.get();
      this.x += event.data.global.x - mouseIsoX;
      this.y += event.data.global.y - mouseIsoY;
    });

    this._closeButton = new Button("Close");
    this._closeButton.on("click", () => this.close());
    this._borders.addChild(this._closeButton);

    this.showBorders(true);
    this.setSize(200, 200);
  }

  show(x, y) {
    WindowManager.add(this);
    this.position.set(x, y);
  }

  close() {
    WindowManager.remove(this);
  }

  showBorders(showBorders) {
    this._showBorders = showBorders;
    this._updateInnerSize();
  }

  setSize(width, height) {
    this._width = width;
    this._height = height;

    this._closeButton.y = 5;
    this._closeButton.x = width - this._closeButton.width - 5;

    this._updateInnerSize();
  }

  _updateInnerSize() {
    this._innerWidth = this._width;

    if (this._showBorders) {
      this._innerHeight = this._height - Constants.WINDOW_TOP_BORDER_SIZE;
    } else {
      this._innerHeight = this._height;
    }

    this.container.x = 0;
    this.container.y = Constants.WINDOW_TOP_BORDER_SIZE;

    this.render();
  }

  render() {
    this._background.clear();
    this._borders.clear();

    this._background.beginFill("0xffffff");
    this._background.moveTo(0, 0);
    this._background.lineTo(this._width, 0);
    this._background.lineTo(this._width, this._height);
    this._background.lineTo(0, this._height);
    this._background.lineTo(0, 0);
    this._background.endFill();

    if (this._showBorders) {
      this._borders.beginFill(Constants.WINDOW_BORDER_COLOR);
      this._borders.moveTo(0, 0);
      this._borders.lineTo(this._width, 0);
      this._borders.lineTo(this._width, Constants.WINDOW_TOP_BORDER_SIZE);
      this._borders.lineTo(0, Constants.WINDOW_TOP_BORDER_SIZE);
      this._borders.lineTo(0, 0);
      this._borders.endFill();

      this._borders.lineStyle(1, "0xaeadae");
      this._borders.moveTo(0, Constants.WINDOW_TOP_BORDER_SIZE);
      this._borders.lineTo(this._width, Constants.WINDOW_TOP_BORDER_SIZE);
    }

    this._borders.lineStyle(1, "0xdedede");
    this._borders.moveTo(0, 0);
    this._borders.lineTo(this._width, 0);
    this._borders.lineTo(this._width, this._height);
    this._borders.lineTo(0, this._height);
    this._borders.lineTo(0, 0);
  }
}
