import Compositor from "./compositor.js";
import * as Constants from "../constants.js";
import State from "../state.js";

import LinearLayout from "./linear-layout.js";
import Button from "./button.js";

const titleStyle = {
  fontFamily: "Arial",
  fontSize: 12,
  fill: "black"
};

/**
 * Window frame container.
 *
 * Root class for UI windows.
 */
export default class Window extends PIXI.Container {
  constructor(options = {}) {
    super();
    this.name = options.name;
    this.interactive = true;

    this._background = new PIXI.Graphics();
    this.addChild(this._background);

    // TODO: add mask to this
    this.container = new LinearLayout({
      margin: options.margin,
      spacing: options.spacing
    });
    this.addChild(this.container);

    this._borders = new PIXI.Graphics();
    this._borders.interactive = true;
    this.addChild(this._borders);

    this._borders.on("mousedown", () => this.startDrag());
    this._borders.on("mouseup", () => this.stopDrag());
    this._borders.on("mouseupoutside", () => this.stopDrag());
    this._borders.on("mousemove", event => this.onMove(event));

    this._closeButton = new Button("X");
    this._closeButton.setSize(20, 20);
    this._closeButton.on("click", () => this.close());
    this._borders.addChild(this._closeButton);

    this._titleText = new PIXI.Text(options.title || "", titleStyle);
    this._borders.addChild(this._titleText);

    this.showBorders(true);
    this.setSize(options.width || 200, options.height || 200);
  }

  /**
   * Start drag mode.
   *
   * @private
   */
  startDrag() {
    this._drag = true;
  }

  /**
   * Stop drag mode.
   *
   * @private
   */
  stopDrag() {
    this._drag = false;
  }

  /**
   * Drag the window, if in drag mode.
   *
   * @param {PIXI.InteractionEvent} event - The event data.
   * @private
   */
  onMove(event) {
    if (!this._drag) return;
    const { mouseIsoX, mouseIsoY } = State.get();

    this.x += event.data.global.x - mouseIsoX;
    this.y += event.data.global.y - mouseIsoY;
    this.fixPosition();
  }

  /**
   * Display the window at the specified position.
   * @param {Integer} x - The initial x position.
   * @param {Integer} y - The initial y position.
   */
  show(x = 0, y = 0) {
    if (!Number.isInteger(x) || x < 0 || !Number.isInteger(y) || y < 0) {
      throw new Error("arguments must be positive integers");
    }

    Compositor.add(this);
    this.position.set(x, y);
  }

  /**
   * Close the window and remove it from the UI.
   */
  close() {
    Compositor.remove(this);
  }

  /**
   * Add a new widget to the window.
   *
   * @param {Widget} child - The new widget.
   * @throws If the child is already registered.
   */
  add(child) {
    // TODO: test whether the child is already in the array.
    this.container.add(child);
  }

  /**
   * Remove a registered widget.
   *
   * @param {Widget} child - The widget.
   */
  remove(child) {
    this.container.remove(child);
  }

  update() {
    this.container.update();
  }

  showBorders(showBorders) {
    this._showBorders = showBorders;
    this.updateInnerSize();
  }

  setSize(width, height) {
    this._width = width;
    this._height = height;

    this._closeButton.y = 2;
    this._closeButton.x = width - this._closeButton.width - 1;

    this._titleText.y = 2;
    this._titleText.x = (width - this._titleText.width) / 2.0;

    this.updateInnerSize();
  }

  fixPosition() {
    const { applicationWidth, applicationHeight } = State.get();

    this.x = Math.max(0, this.x);
    this.x = Math.min(this.x, applicationWidth - this._width);
    this.y = Math.max(0, this.y);
    this.y = Math.min(
      this.y,
      applicationHeight - Constants.WINDOW_TOP_BORDER_SIZE
    );
  }

  updateInnerSize() {
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
