import Widget from "./widget.js";

export default class Paragraph extends Widget {
  /**
   * A text paragraph widget.
   *
   * @param {string} text - The paragraph text.
   * @param {object} style - The text style.
   */
  constructor(text, style) {
    super("Paragraph");

    this._textContainer = new PIXI.Text(text, style);
    this.addChild(this._textContainer);
  }

  /**
   * Update the widget text.
   *
   * @param {string} text - The new widget text.
   */
  setText(text) {
    this._textContainer.text = text;
    this.update();
  }
}
