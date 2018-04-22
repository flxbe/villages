export default class Widget extends PIXI.Container {
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

    const onUpdate = () => this.update();

    child.on("updated", onUpdate);
    child.once("removed", () => child.removeListener("updated", onUpdate));

    this.addChild(child);
    this.update();
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

    this.removeChild(child);
    this.update();
  }

  update() {
    this.updated();
  }

  updated() {
    this.emit("updated");
  }
}
