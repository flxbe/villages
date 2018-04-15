import Widget from "./widget.js";

const NORMAL_BACKGROUND = "0xffffff";
const DOWN_BACKGROUND = "0x297adb";

const textStyle = {
  fontFamily: "Arial",
  fontSize: 12,
  fill: "black"
};

export default class Button extends Widget {
  constructor(text) {
    super("Button");

    this.buttonMode = true;

    this._backgroundColor = NORMAL_BACKGROUND;

    this._background = new PIXI.Graphics();
    this.addChild(this._background);

    this._textContainer = new PIXI.Text("", textStyle);
    this.addChild(this._textContainer);

    this.setSize(100, 25);
    this.setText(text);

    this.interactive = true;
    this.on("mousedown", () => this.onMouseDown());
    this.on("mouseup", () => this.onMouseUp());
    this.on("mouseout", () => this.onMouseUp());
  }

  onMouseDown() {
    this._backgroundColor = DOWN_BACKGROUND;
    this.render();
  }

  onMouseUp() {
    this._backgroundColor = NORMAL_BACKGROUND;
    this.render();
  }

  setSize(width, height) {
    this._width = width;
    this._height = height;
    this.hitArea = new PIXI.Rectangle(0, 0, width, height);
    this.update();
    this.render();
  }

  setText(text) {
    this._textContainer.text = text;
    this.update();
  }

  update() {
    this._textContainer.x = (this._width - this._textContainer.width) / 2.0;
    this._textContainer.y = (this._height - this._textContainer.height) / 2.0;

    this.updated();
  }

  render() {
    this._background.clear();
    this._background.lineStyle(1, "0x000000");
    this._background.beginFill(this._backgroundColor);
    this._background.drawRect(0, 0, this._width, this._height);
    this._background.endFill();
  }
}
