import State from "../state.js";

import Window from "../ui-framework/window.js";
import VerticalLayout from "../ui-framework/vertical-layout.js";
import HorizontalLayout from "../ui-framework/horizontal-layout.js";
import Button from "../ui-framework/button.js";
import Paragraph from "../ui-framework/paragraph.js";

export default function openDeerWindow(id) {
  const window = new Window();
  window.setSize(300, 300);

  const vl = new VerticalLayout(10);
  window.container.addChild(vl);
  vl.x = 10;

  const p = new Paragraph();
  vl.add(p);

  function setText(text) {
    p.text = getText(id);
    vl._recalc();
  }

  State.on("UPDATE_DEER", action => {
    if (action.deer.id !== id) return;
    setText();
  });

  setText();

  window.show();
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
