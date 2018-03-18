"use strict";

const uiContainer = new PIXI.Container();
app.stage.addChild(uiContainer);

const uiElements = {};

function initUI() {
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 12,
    fill: "white"
  });

  uiElements.mode = new PIXI.Text("", style);
  uiContainer.addChild(uiElements.mode);
  uiElements.mode.position.set(10, 10);

  uiElements.buildHelp = new PIXI.Text("", style);
  uiContainer.addChild(uiElements.buildHelp);
  uiElements.buildHelp.position.set(10, 30);

  uiElements.storage = new PIXI.Text("", style);
  uiContainer.addChild(uiElements.storage);
  uiElements.storage.position.set(10, 50);

  uiElements.deer1 = new PIXI.Text("", style);
  uiContainer.addChild(uiElements.deer1);
  uiElements.deer1.position.set(150, 50);

  uiElements.deer2 = new PIXI.Text("", style);
  uiContainer.addChild(uiElements.deer2);
  uiElements.deer2.position.set(300, 50);
}

function renderUI() {
  uiElements.mode.text = [
    `mode: ${uiState.mode}`,
    `(n) normal`,
    `(b) build`,
    `(g) toggle grid`
  ].join("    ");

  uiElements.buildHelp.text =
    uiState.mode === "build"
      ? [
          `current building: ${uiState.blueprint}`,
          `(1) house (40 wood)`,
          `(2) barn (100 wood)`
        ].join("    ")
      : "";

  uiElements.storage.text = [
    "Storage",
    `Food: ${state.storage.food}`,
    `Wood: ${state.storage.wood}`
  ].join("\n");

  uiElements.deer1.text = [
    "Deer 1",
    `Inventory: ${state.deers["deer1"].inventory} (${state.deers["deer1"]
      .item || "nothing"})`
  ].join("\n");

  uiElements.deer2.text = [
    "Deer 2",
    `Inventory: ${state.deers["deer2"].inventory} (${state.deers["deer2"]
      .item || "nothing"})`
  ].join("\n");
}
