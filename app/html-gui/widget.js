import { intToPx, pxToInt } from "./util.js";

export default class Widget extends PIXI.utils.EventEmitter {
  /**
   * The UI widget base class.
   *
   * # Widget Lifecycle
   *
   * ## Constructor
   *
   * The constructor should only be used to create and add other widgets.
   * All interactions with the state (subscriptions, ...) should be delayed
   * until the widget is mounted.
   *
   * ##  `onDidMount`
   * This is called, after the widget was added to the DOM.
   * If a widget is added to a parent, whichc is not yet on the DOM, the method
   * will not be called. After adding the root widget to the DOM, the event is
   * propagated to all children.
   *
   * This hook should be used to subscribe to DOM input events and state
   * changes. The initial widget state like should also be loaded here.
   *
   * ## `onDidUnmount`
   * This is called, after a mounted widget is removed from its parent or if the
   * root widget is removed from the DOM.
   *
   * This hook should be used to unsubscribe from all events.
   *
   * @param {string} name - The widget name.
   * @param {Object} options - The Widget options.
   * @param {bool} [options.isContainer] - If true, the Widget can have children.
   * @param {DOM.Node} [options.node]
   * @param {string = "div"} [options.element]
   * @throws If `name` is undefined.
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
  }

  /**
   * Internally handle the `mounted` event.
   *
   * This event will be propagated to all children.
   */
  _onMount() {
    if (this.mounted) {
      throw new Error(`${this.name}: Widget is already mounted.`);
    }

    this.mounted = true;

    if (this.isContainer) {
      for (let childNode of this.node.children) {
        if (!childNode._owner) continue;
        childNode._owner._onMount();
      }
    }

    if (this.onDidMount) {
      this.onDidMount();
    }
  }

  _onUnmount() {
    if (!this.mounted) {
      throw new Error(`${this.name}: Widget is not mounted.`);
    }

    this.mounted = false;

    if (this.isContainer) {
      for (let childNode of this.node.children) {
        if (!childNode._owner) continue;
        childNode._owner._onUnmount();
      }
    }

    if (this.onDidUnmount) {
      this.onDidUnmount();
    }
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

  set visible(visible) {
    if (visible) {
      this.node.style.display = "block";
    } else {
      this.node.style.display = "none";
    }
  }

  get visible() {
    return this.node.style.display !== "none";
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
    if (this.mounted) {
      child._onMount();
    }
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
    if (this.mounted) {
      child._onUnmount();
    }
  }
}
