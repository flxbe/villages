import context from "../context.js";
import Compositor from "../html-gui/compositor.js";

import Window from "../html-gui/window.js";
import Button from "../html-gui/button.js";
import Paragraph from "../html-gui/paragraph.js";

class DeerWindow extends Window {
  constructor(name, id) {
    super({
      name,
      title: `Deer '${id}'`,
      margin: 5,
      width: 200,
      borders: true,
      shadow: true
    });

    this.id = id;

    this._onClose = () => this.close();
    this._onUpdateDeer = action => this.onUpdateDeer(action);

    this.p = new Paragraph();
    this.p.marginTop = 0;
    this.add(this.p);

    this.closeButton = new Button("Close");
    this.add(this.closeButton);
  }

  onDidMount() {
    super.onDidMount();

    this.setText();
    this.closeButton.node.addEventListener("click", this._onClose);
    context.on("UPDATE_DEER", this._onUpdateDeer);
  }

  onDidUnmount() {
    super.onDidUnmount();

    this.closeButton.node.removeEventListener("click", this._onClose);
    context.off("UPDATE_DEER", this._onUpdateDeer);
  }

  onUpdateDeer(action) {
    if (action.deer.id !== this.id) return;

    this.setText();
  }

  setText() {
    const deer = context.getState().deers[this.id];

    this.p.text = [
      `id: ${deer.id}`,
      `job: ${deer.job}`,
      `target: ${deer.target}`,
      "",
      "INVENTORY",
      `${deer.item} (${deer.inventory})`,
      "",
      "NEEDS",
      `food: ${deer.needs.food.toFixed(1)}`,
      `sleep: ${deer.needs.sleep.toFixed(1)}`,
      "",
      "SKILLS",
      `Harvesting: ${deer.skills.harvesting.toFixed(2)}`,
      `Wood Cutting: ${deer.skills.woodCutting.toFixed(2)}`
    ].join("\n");
  }
}

export default function openDeerWindow(id) {
  const name = `deer_${id}`;
  let window = Compositor.getWindow(name);

  if (window) {
    Compositor.pushToFront(window);
    return;
  }

  window = new DeerWindow(name, id);
  window.show(100, 100);
}
