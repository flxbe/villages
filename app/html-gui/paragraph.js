import { intToPx, pxToInt } from "./util.js";
import Widget from "./widget.js";

export default class Paragraph extends Widget {
  constructor(text) {
    super("Paragraph", { element: "p" });

    this.node.innerText = text;
  }

  set text(text) {
    this.node.innerText = text;
  }

  get text() {
    return this.node.text;
  }

  set marginTop(m) {
    this.node.style.marginTop = intToPx(m);
  }

  get marginTop() {
    return pxToInt(this.node.style.marginTop);
  }
}
