import Compositor from "./compositor.js";
import * as Constants from "../constants.js";

import Widget from "./widget.js";
import { intToPx, pxToInt } from "./util.js";

// TODO: memory is leaked, callbacks should be removed

/**
 * Window frame container.
 *
 * Root class for UI windows.
 */
export default class Window extends Widget {
  constructor(options = {}) {
    super("Window", {
      isContainer: true
    });

    this.name = options.name;
    this.fixed = options.fixed || false;

    if (options.width) this.width = options.width;
    if (options.height) this.height = options.height;

    this.node.style.position = "absolute";
    this.node.style.backgroundColor = options.backgroundColor || "#ffffff";
    this.node.style.padding = options.margin ? intToPx(options.margin) : "2px";

    this.shadow = options.shadow || false;

    this.borders = options.borders || false;
    this.node.style.borderColor = "#dad9da";
    this.node.style.borderStyle = "solid";

    this.x = 0;
    this.y = 0;

    this._onDrag = event => this.onDrag(event);
    this._onMouseDown = event => this.onMouseDown(event);
    this._onMouseUp = event => this.onMouseUp(event);
  }

  onDidMount() {
    this.node.addEventListener("mousedown", this._onMouseDown);
    this.node.addEventListener("mouseup", this._onMouseUp);
  }

  onDidUnmount() {
    this.node.removeEventListener("mousedown", this._onMouseDown);
    this.node.removeEventListener("mouseup", this._onMouseUp);
    document.removeEventListener("mousemove", this._onDrag);
  }

  set borders(borders) {
    this._borders = borders;
    this.node.style.borderWidth = borders ? "1px" : 0;
    this.node.style.borderTopWidth = borders ? "30px" : 0;
  }

  get borders() {
    return this._borders;
  }

  set shadow(shadow) {
    this._shadow = shadow;
    this.node.style.boxShadow = shadow
      ? "1px 1px 3px 0px rgba(0, 0, 0, 0.75)"
      : undefined;
  }

  /**
   * Drag the window when the mouse is moved.
   *
   * @param {Event} event - The native mouse move event
   */
  onDrag(event) {
    this.x += event.clientX - this._dragX;
    this.y += event.clientY - this._dragY;
    this._dragX = event.clientX;
    this._dragY = event.clientY;
  }

  /**
   * Start drag mode.
   *
   * @private
   */
  onMouseDown(event) {
    if (event.button === 0 && !this.fixed) {
      this._dragX = event.clientX;
      this._dragY = event.clientY;
      document.addEventListener("mousemove", this._onDrag);
    }
  }

  /**
   * Stop drag mode.
   *
   * @private
   */
  onMouseUp(event) {
    if (event.button === 0) {
      document.removeEventListener("mousemove", this._onDrag);
    }
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

    this.x = x;
    this.y = y;

    Compositor.add(this);
  }

  /**
   * Close the window and remove it from the UI.
   */
  close() {
    Compositor.remove(this);
  }
}
