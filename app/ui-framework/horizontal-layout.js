export default class HorizontalLayout extends PIXI.Container {
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
    let x = this.margin;
    for (let child of this.children) {
      child.x = x;
      child.y = 0;
      x += child.width + this.margin;
    }
  }
}
