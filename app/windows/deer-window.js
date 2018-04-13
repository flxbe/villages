import State from "../state.js";
import Compositor from "../ui-framework/compositor.js";

import Window from "../ui-framework/window.js";
import Button from "../ui-framework/button.js";
import Paragraph from "../ui-framework/paragraph.js";

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
    width: 300,
    height: 200,
    margin: 10,
    spacing: 10
  });

  const p = new Paragraph();
  p.text = getText(id);
  window.add(p);

  const onUpdateDeer = action => {
    if (action.deer.id !== id) return;
    p.text = getText(id);
  };

  State.on("UPDATE_DEER", onUpdateDeer);
  window.on("removed", () => {
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
