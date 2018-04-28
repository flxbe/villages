import Widget from "./widget.js";

export default class Button extends Widget {
  constructor(value) {
    super("Button", { element: "input" });

    this.node.value = value;
    this.node.setAttribute("type", "button");
  }
}
