import Window from "../html-gui/window.js";
import Button from "../html-gui/button.js";
import Paragraph from "../html-gui/paragraph.js";

class TestWindow extends Window {
  constructor() {
    super({
      title: "Test Window",
      width: 200,
      margin: 10,
      borders: true,
      shadow: true
    });

    this.p1 = new Paragraph("Some text");
    this.add(this.p1);
    this.p2 = new Paragraph("Some more text");
    this.add(this.p2);
    this.button = new Button("Submit");
    this.add(this.button);
  }
}

export default function openTestWindow(id) {
  const window = new TestWindow();
  window.show(100, 100);
}
