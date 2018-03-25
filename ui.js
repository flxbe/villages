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

  UI_ELEMENTS.tooltip = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.tooltip);
  UI_ELEMENTS.tooltip.position.set(0, 0);

  renderBuildmenuTexture();
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
        `(2) barn (100 wood)`,
        `(3) road (10 wood)`
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

function renderDecoration() {
  MAP_DECORATION_LAYER.clear();
  UI_DECORATION_LAYER.clear();

  const container = getActiveContainer();

  switch (container) {
    case "map": renderMapDecoration(); break;
    case "buildmenu": renderBuildmenuDecoration(); break;
    default: throw Error("unknown container");
  }
}

const BUILDMENU_GRID = [[{ empty: false, blueprintName: "house", color: "0x561f00" }], [{ empty: false, blueprintName: "barn", color: "0x450e00" }], [{ empty: false, blueprintName: "road", color: "0x999999" }]];
for (let k = 3; k < 5; k++) {
  BUILDMENU_GRID.push([{ empty: true, blueprintName: "", color: "0x000000" }]);
}

function getActiveGridTile() {
  const j = Math.floor((UI_STATE.mouseIsoX - BUILDMENU_OFFSET_X) / BUILDMENU_TILESIZE);
  const i = Math.floor((UI_STATE.mouseIsoY - BUILDMENU_OFFSET_Y) / BUILDMENU_TILESIZE);
  return [i, j];
}

function isOccupiedBuildmenuTile(i, j) {
  return i < BUILDMENU_GRID.length && j < BUILDMENU_GRID[i].length && !BUILDMENU_GRID[i][j].empty;
}

function renderBuildmenuDecoration() {
  const [mouseI, mouseJ] = getActiveGridTile();
  if (isOccupiedBuildmenuTile(mouseI, mouseJ)) {
    const x = mouseJ * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_X;
    const y = mouseI * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_Y;

    renderBuildmenuTile(UI_DECORATION_LAYER, "0xff0000", x, y);
  }
}

function renderBuildmenuTexture() {
  //BUILD_MENU_LAYER.clear();

  for (let i = 0; i < BUILDMENU_GRID.length; i++) {
    for (let j = 0; j < BUILDMENU_GRID[i].length; j++) {
      const tile = BUILDMENU_GRID[i][j];
      const x = j * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_X;
      const y = i * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_Y;

      renderBuildmenuTile(BUILD_MENU_LAYER, tile.color, x, y);
    }
  }
}

function renderBuildmenuTile(target, color, x, y) {
  target.beginFill(color);
  target.lineStyle(1, "0x000000", 1);
  target.moveTo(x, y);
  target.lineTo(x + BUILDMENU_TILESIZE, y);
  target.lineTo(x + BUILDMENU_TILESIZE, y + BUILDMENU_TILESIZE);
  target.lineTo(x, y + BUILDMENU_TILESIZE);
  target.lineTo(x, y);
  target.endFill();
}