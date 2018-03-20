"use strict";

function initUI() {
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 12,
    fill: "white"
  });

  UI_ELEMENTS.mode = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.mode);
  UI_ELEMENTS.mode.position.set(10, 10);

  UI_ELEMENTS.buildHelp = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.buildHelp);
  UI_ELEMENTS.buildHelp.position.set(10, 30);

  UI_ELEMENTS.storage = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.storage);
  UI_ELEMENTS.storage.position.set(10, 50);

  UI_ELEMENTS.deer1 = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.deer1);
  UI_ELEMENTS.deer1.position.set(150, 50);

  UI_ELEMENTS.deer2 = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.deer2);
  UI_ELEMENTS.deer2.position.set(300, 50);
}

function renderUI() {
  UI_ELEMENTS.mode.text = [
    `mode: ${UI_STATE.mode}`,
    `(n) normal`,
    `(b) build`,
    `(g) toggle grid`
  ].join("    ");

  UI_ELEMENTS.buildHelp.text =
    UI_STATE.mode === "build"
      ? [
          `current building: ${UI_STATE.blueprint}`,
          `(1) house (40 wood)`,
          `(2) barn (100 wood)`
        ].join("    ")
      : "";

  UI_ELEMENTS.storage.text = [
    "Storage",
    `Food: ${STATE.storage.food}`,
    `Wood: ${STATE.storage.wood}`
  ].join("\n");

  UI_ELEMENTS.deer1.text = [
    "Deer 1",
    `Inventory: ${STATE.deers["deer1"].inventory} (${STATE.deers["deer1"]
      .item || "nothing"})`
  ].join("\n");

  UI_ELEMENTS.deer2.text = [
    "Deer 2",
    `Inventory: ${STATE.deers["deer2"].inventory} (${STATE.deers["deer2"]
      .item || "nothing"})`
  ].join("\n");
}
