import Widget from "./widget.js";

export default class LinearLayout extends Widget {
  /**
   * A automatic, linear layout widget.
   *
   * @param {Object} options - the widget options.
   * @param {Integer = 0} options.margin - The margin size.
   * @param {Integer = 0} options.spacing - The spacing size.
   * @param {Boolean = false} horizontal - Linear direction.
   */
  constructor(options = {}) {
    super("LinearLayout", { isContainer: true });

    this.margin = options.margin || 0;
    this.spacing = options.spacing || 0;
    this.horizontal = options.horizontal || false;
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

    this.updated();
  }
}
