const textStyle = {
  fontFamily: "Arial",
  fontSize: 12,
  fill: "black"
};

export default class Paragraph extends PIXI.Text {
  constructor(text) {
    super(text, textStyle);
  }
}
