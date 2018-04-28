import { intToPx, pxToInt } from "./util.js";

export default class Widget extends PIXI.utils.EventEmitter {
  /**
   * The UI widget base class.
   *
   * @param {string} name - The widget name.
   * @param {Object} options - The Widget options.
   * @param {bool} options.isContainer - If true, the Widget can have children.
   * @throws If name is undefined.
   */
  constructor(name, options = {}) {
    super();

    if (!name) throw new Error("The widget name must not be null.");

    this.name = name;
    this.isContainer = options.isContainer || false;

    if (options.node) {
      this.node = options.node;
    } else {
      const nodeType = options.element || "div";
      this.node = document.createElement(nodeType);
    }

    this.node._owner = this;

    this.once("unmounted", () => this.onUnmount);
  }

  set width(width) {
    this.node.style.width = intToPx(width);
  }

  get width() {
    return pxToInt(this.node.style.width);
  }

  set height(height) {
    this.node.style.height = intToPx(height);
  }

  get height() {
    return pxToInt(this.node.style.height);
  }

  assertWidget(child) {
    if (!(child instanceof Widget)) {
      throw new Error(`${this.name}: 'child' must be an instance of 'Widget'.`);
    }
  }

  assertContainer() {
    if (!this.isContainer) {
      throw new Error(
        `${this.name}: widget is no container and cannot contain childs.`
      );
    }
  }

  /**
   * Add a new child widget.
   *
   * @param {Widget} child - The child that should be added.
   * @throws If child is no instance of `Widget`.
   * @throws If `isConstainer` is false.
   */
  add(child) {
    this.assertWidget(child);
    this.assertContainer();

    this.node.appendChild(child.node);
    child.emit("mounted");
  }

  /**
   * Remove a child widget.
   *
   * @param {Widget} child - The child that should be removed.
   * @throws If child is no instance of `Widget`.
   * @throws If `isConstainer` is false.
   */
  remove(child) {
    this.assertWidget(child);
    this.assertContainer();

    this.node.removeChild(child.node);
    child.emit("unmounted");
  }

  onUnmount() {
    while (this.node.children) {
      this.remove(this.node.firstChild._owner);
    }
  }
}
