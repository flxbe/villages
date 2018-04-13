export default class Paragraph extends PIXI.Text {
  setText(text) {
    this.text = text;
    this.update();
  }

  update() {
    this.emit("updated");
  }
}
