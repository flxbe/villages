import State from "../state.js";
import Compositor from "../html-gui/compositor.js";

import Window from "../html-gui/window.js";
import Button from "../html-gui/button.js";
import Paragraph from "../html-gui/paragraph.js";

export default function openDeerWindow(id) {
  const name = `deer_${id}`;
  let window = Compositor.getWindow(name);

  if (window) {
    Compositor.pushToFront(window);
    return;
  }

  window = new Window({
    name,
    title: `Deer '${id}'`,
    margin: 10
  });

  const p = new Paragraph(getText(id));
  window.add(p);

  const closeButton = new Button("Close");
  closeButton.node.addEventListener("click", () => window.close());
  window.add(closeButton);

  const onUpdateDeer = action => {
    if (action.deer.id !== id) return;
    p.text = getText(id);
  };

  State.on("UPDATE_DEER", onUpdateDeer);
  window.once("unmounted", () => {
    State.off("UPDATE_DEER", onUpdateDeer);
  });

  window.show(100, 100);
}

function getText(id) {
  const deer = State.get().deers[id];

  return [
    `id: ${deer.id}`,
    `job: ${deer.job}`,
    `profession: ${deer.profession}`,
    `inventory: ${deer.item} (${deer.inventory})`
  ].join("\n");
}
