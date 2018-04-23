import Compositor from "./compositor.js";
import * as Constants from "../constants.js";
import State from "../state.js";

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

    this.node.classList.add("window");
    this.node.style.position = "absolute";
    this.node.style.backgroundColor = options.backgroundColor || "#ffffff";
    this.node.style.padding = options.margin ? intToPx(options.margin) : "10px";
    this.node.style.borderColor = "#dad9da";
    this.node.style.borderStyle = "solid";
    this.node.style.borderWidth = "1px";
    this.node.style.borderTopWidth = "30px";

    if (options.width) this.width = options.width;
    if (options.height) this.height = options.height;

    this.x = 0;
    this.y = 0;

    this._onDrag = event => this.onDrag(event);
    this._onMouseDown = event => this.onMouseDown(event);
    this._onMouseUp = event => this.onMouseUp(event);

    this.node.addEventListener("mousedown", this._onMouseDown);
    this.node.addEventListener("mouseup", this._onMouseUp);
  }

  set x(x) {
    this._x = x;
    this.node.style.left = intToPx(x);
  }

  get x() {
    return this._x;
  }

  set y(y) {
    this._y = y;
    this.node.style.top = intToPx(y);
  }

  get y() {
    return this._y;
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
    if (event.button === 0) {
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
