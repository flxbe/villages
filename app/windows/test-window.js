import Window from "../html-gui/window.js";
import Button from "../html-gui/button.js";
import Paragraph from "../html-gui/paragraph.js";

export default function openTestWindow(id) {
  const window = new Window({
    title: "Test Window",
    width: 200,
    margin: 10,
    borders: true,
    shadow: true
  });

  const p1 = new Paragraph("Some text");
  window.add(p1);
  const p2 = new Paragraph("Some more text");
  window.add(p2);
  const button = new Button("Submit");
  window.add(button);

  window.show(100, 100);
}
