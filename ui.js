"use strict";

function initUI() {
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 12,
    fill: "white"
  });

  UI_ELEMENTS.help = new PIXI.Text(
    "(g) toggle grid    (b) toggle buildmenu    (h) toggle hitboxes",
    style
  );
  UI_CONTAINER.addChild(UI_ELEMENTS.help);
  UI_ELEMENTS.help.position.set(100, 10);

  UI_ELEMENTS.storage = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.storage);
  UI_ELEMENTS.storage.position.set(10, 10);

  UI_ELEMENTS.tooltip = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.tooltip);
  UI_ELEMENTS.tooltip.position.set(0, 0);

  UI_ELEMENTS.decoration = new PIXI.Graphics();
  SELECTION_LAYER.addChild(UI_ELEMENTS.decoration);

  UI_ELEMENTS.description = new PIXI.Text("", style);
  SELECTION_LAYER.addChild(UI_ELEMENTS.description);
  UI_ELEMENTS.description.position.set(10, HEIGHT - 14 * 1 - 5);

  renderBuildmenuTexture();
  BUILD_MENU_LAYER.visible = false;
}

function renderUI() {
  UI_ELEMENTS.mode.text = [
    `mode: ${UI_STATE.mode}`,
    `(g) toggle grid`,
    `(h) toggle hit areas`
  ].join("    ");

  UI_ELEMENTS.storage.text = [
    "Storage",
    `Food: ${STATE.storage.food}`,
    `Wood: ${STATE.storage.wood}`
  ].join("\n");

  // only decorate hovered buttons
  const { hoveredElement } = UI_STATE;
  if (hoveredElement && hoveredElement.type === "button") {
    UI_ELEMENTS.tooltip.visible = true;
    UI_ELEMENTS.tooltip.text = hoveredElement.blueprintName;
    UI_ELEMENTS.tooltip.position.x = UI_STATE.mouseIsoX - 40;
    UI_ELEMENTS.tooltip.position.y = UI_STATE.mouseIsoY;
  } else {
    UI_ELEMENTS.tooltip.visible = false;
  }

  // set description
  function obj2array(obj) {
    const array = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        array.push(`${p}: ${obj[p]} `);
      }
    }
    return array;
  }

  let array = [];
  if (UI_STATE.selection) {
    switch (UI_STATE.selection.type) {
      case "deer":
        array = obj2array(STATE.deers[UI_STATE.selection.id]);
        break;
      case "tree":
        array = obj2array(STATE.trees[UI_STATE.selection.id]);
        break;
      case "tile":
        array = obj2array(UI_STATE.selection);
        array.push(
          `tileType: ${
            STATE.map[UI_STATE.selection.i][UI_STATE.selection.j].type
          }`
        );
        break;
      case "blueprint":
        array = obj2array(UI_STATE.selection);
        array = array.concat(obj2array(BLUEPRINTS[UI_STATE.selection.id]));
        break;
    }
  }

  UI_ELEMENTS.description.text = array.join("\n");
  UI_ELEMENTS.description.position.set(10, HEIGHT - 14 * array.length - 5);
}

function renderSelectionDecoration() {
  UI_ELEMENTS.decoration.clear();

  if (UI_STATE.selection) {
    let relX, relY;
    UI_ELEMENTS.decoration.alpha = 0.25;

    switch (UI_STATE.selection.type) {
      case "tile":
        [relX, relY] = tile2rel(UI_STATE.selection.i, UI_STATE.selection.j);
        renderTile(UI_ELEMENTS.decoration, "0xffffff", relX, relY);
        return;
      case "deer":
        [relX, relY] = cart2rel(
          STATE.deers[UI_STATE.selection.id].x - 10,
          STATE.deers[UI_STATE.selection.id].y - 10
        );
        break;
      case "tree":
        [relX, relY] = tile2rel(
          STATE.trees[UI_STATE.selection.id].i,
          STATE.trees[UI_STATE.selection.id].j
        );
        break;
      case "blueprint":
        renderBuildmenuTile(
          UI_ELEMENTS.decoration,
          "0xffffff",
          UI_STATE.selection.j * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_X,
          UI_STATE.selection.i * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_Y
        );
        return;
      default:
        throw Error("Unknown selection type");
    }
    UI_ELEMENTS.decoration.alpha = 0.5;
    renderCircle(UI_ELEMENTS.decoration, "0xffffff", relX, relY);
  }
}

function renderCircle(target, color, x, y) {
  const h_2 = TILE_HEIGHT / 2;

  target.lineStyle(1, color, 1);
  target.moveTo(x, y);
  target.lineTo(x + TILE_WIDTH, y + h_2);
  target.lineTo(x, y + TILE_HEIGHT);
  target.lineTo(x - TILE_WIDTH, y + h_2);
  target.lineTo(x, y);
}

const BUILDMENU_GRID = [
  [{ empty: false, blueprintName: "house", color: "0x561f00" }],
  [{ empty: false, blueprintName: "barn", color: "0x450e00" }],
  [{ empty: false, blueprintName: "road", color: "0x999999" }]
];
for (let k = 3; k < 5; k++) {
  BUILDMENU_GRID.push([{ empty: true, blueprintName: "", color: "0x000000" }]);
}

function getActiveGridTile() {
  const j = Math.floor(
    (UI_STATE.mouseIsoX - BUILDMENU_OFFSET_X) / BUILDMENU_TILESIZE
  );
  const i = Math.floor(
    (UI_STATE.mouseIsoY - BUILDMENU_OFFSET_Y) / BUILDMENU_TILESIZE
  );
  return [i, j];
}

function isOccupiedBuildmenuTile(i, j) {
  return (
    i < BUILDMENU_GRID.length &&
    j < BUILDMENU_GRID[i].length &&
    !BUILDMENU_GRID[i][j].empty
  );
}

function renderBuildmenuDecoration() {
  UI_DECORATION_LAYER.clear();

  // only decorate hovered buttons
  const { hoveredElement } = UI_STATE;
  if (!hoveredElement || hoveredElement.type !== "button") return;

  const x = hoveredElement.j * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_X;
  const y = hoveredElement.i * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_Y;
  UI_DECORATION_LAYER.alpha = 0.25;
  renderBuildmenuTile(UI_DECORATION_LAYER, "0xffffff", x, y);
}

function renderBuildmenuTexture() {
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
