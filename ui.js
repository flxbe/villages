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

  UI_ELEMENTS.description = new PIXI.Text("", style);
  SELECTION_LAYER.addChild(UI_ELEMENTS.description);
  UI_ELEMENTS.description.position.set(10, HEIGHT - 14 * 1 - 5);

  // menu buttons, just tmp
  function createButton(color, blueprintName) {
    const button = new PIXI.Graphics();
    button.hitArea = new PIXI.Rectangle(
      0,
      0,
      BUILDMENU_TILESIZE,
      BUILDMENU_TILESIZE
    );
    button.interactive = true;

    button.on("mouseup", event => {
      UI_STATE.mode = "build";
      UI_STATE.blueprintName = blueprintName;
      event.stopPropagation();
    });

    button.on("mousemove", event => {
      UI_STATE.hoveredElement = { type: "button", tooltip: blueprintName };
      event.stopPropagation();
    });

    renderBuildmenuTile(button, color, 0, 0);

    return button;
  }

  UI_ELEMENTS.houseButton = createButton("0x561f00", "house");
  UI_CONTAINER.addChild(UI_ELEMENTS.houseButton);
  UI_ELEMENTS.houseButton.position.set(WIDTH - BUILDMENU_TILESIZE - 10, 10);

  UI_ELEMENTS.barnButton = createButton("0x450e00", "barn");
  UI_CONTAINER.addChild(UI_ELEMENTS.barnButton);
  UI_ELEMENTS.barnButton.position.set(
    WIDTH - BUILDMENU_TILESIZE - 10,
    20 + BUILDMENU_TILESIZE
  );

  UI_ELEMENTS.roadButton = createButton("0x999999", "road");
  UI_CONTAINER.addChild(UI_ELEMENTS.roadButton);
  UI_ELEMENTS.roadButton.position.set(
    WIDTH - BUILDMENU_TILESIZE - 10,
    30 + 2 * BUILDMENU_TILESIZE
  );

  UI_ELEMENTS.tooltip = new PIXI.Text("", style);
  UI_CONTAINER.addChild(UI_ELEMENTS.tooltip);
  UI_ELEMENTS.tooltip.position.set(0, 0);
}

function renderUI() {
  UI_ELEMENTS.storage.text = [
    "Storage",
    `Food: ${STATE.storage.food}`,
    `Wood: ${STATE.storage.wood}`
  ].join("\n");

  // show tooltip, if there is any
  const { hoveredElement } = UI_STATE;
  if (hoveredElement && hoveredElement.tooltip) {
    UI_ELEMENTS.tooltip.visible = true;
    UI_ELEMENTS.tooltip.text = hoveredElement.tooltip;
    UI_ELEMENTS.tooltip.position.x = UI_STATE.mouseIsoX;
    UI_ELEMENTS.tooltip.position.y = UI_STATE.mouseIsoY + 20;
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

function renderCircle(target, color, x, y) {
  const h_2 = TILE_HEIGHT / 2;

  target.lineStyle(1, color, 1);
  target.moveTo(x, y);
  target.lineTo(x + TILE_WIDTH, y + h_2);
  target.lineTo(x, y + TILE_HEIGHT);
  target.lineTo(x - TILE_WIDTH, y + h_2);
  target.lineTo(x, y);
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
