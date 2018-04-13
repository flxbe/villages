export default class LinearLayout extends PIXI.Container {
  constructor(options = {}) {
    super();

    this.margin = options.margin || 0;
    this.spacing = options.spacing || 0;
    this.horizontal = options.horizontal || false;
  }

  add(child) {
    const onUpdate = () => this.update();

    child.on("updated", onUpdate);
    child.once("removed", () => {
      child.removeListener("updated", onUpdate);
    });

    this.addChild(child);
    this.update();
  }

  remove(child) {
    this.removeChild(child);
    this.update();
  }

  update() {
    let x = this.margin;
    let y = this.margin;

    for (let child of this.children) {
      child.x = x;
      child.y = y;
      if (this.horizontal) x += child.width + this.spacing;
      else y += child.height + this.spacing;
    }

    this.emit("updated");
  }
}
