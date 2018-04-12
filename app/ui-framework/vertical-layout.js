export default class VerticalLayout extends PIXI.Container {
  constructor(margin) {
    super();
    this.margin = margin;
  }

  add(child) {
    this.addChild(child);
    this._recalc();
  }

  remove(child) {
    this.removeChild(child);
    this._recalc();
  }

  _recalc() {
    let y = this.margin;
    for (let child of this.children) {
      child.x = 0;
      child.y = y;
      y += child.height + this.margin;
    }
  }
}
