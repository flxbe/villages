import Window from "../ui-framework/window.js";
import Button from "../ui-framework/button.js";
import Paragraph from "../ui-framework/paragraph.js";

export default function openTestWindow(id) {
  const window = new Window({
    title: "Test Window",
    width: 300,
    height: 400,
    margin: 10,
    spacing: 10
  });

  const textBuffer = [];

  const p = new Paragraph("", {
    wordWrap: true,
    wordWrapWidth: 250
  });
  window.add(p);

  const button = new Button("Add a line of text");
  button.on("click", () => {
    textBuffer.push("A new line of text. Very long.");
    p.setText(textBuffer.join("\n"));
  });
  window.add(button);

  window.show(100, 100);
}
