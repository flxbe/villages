"use strict";

let mouseDiffX = 0;
let mouseDiffY = 0;

function addOffsetX(delta) {
  UI_STATE.offsetX += delta;
  UI_STATE.updateMap = true;
}

function addOffsetY(delta) {
  UI_STATE.offsetY += delta;
  UI_STATE.updateMap = true;
}

function getActiveTile() {
  const [absX, absY] = rel2abs(UI_STATE.mouseIsoX, UI_STATE.mouseIsoY);
  return abs2tile(absX, absY);
}

function getActiveContainer() {
  if (
    UI_STATE.mouseIsoX < BUILDMENU_OFFSET_X ||
    UI_STATE.mouseIsoY < BUILDMENU_OFFSET_Y ||
    UI_STATE.mouseIsoX > BUILDMENU_OFFSET_X + BUILDMENU_WIDTH ||
    UI_STATE.mouseIsoY > BUILDMENU_OFFSET_Y + BUILDMENU_HEIGHT
  ) {
    return "map";
  }
  return "buildmenu";
}

window.addEventListener(
  "keydown",
  event => {
    switch (event.keyCode) {
      case 17:
        UI_STATE.ctrlDown = true;
        break;
      case 37:
        addOffsetX(20);
        break;
      case 38:
        addOffsetY(20);
        break;
      case 39:
        addOffsetX(-20);
        break;
      case 40:
        addOffsetY(-20);
        break;
    }

    switch (event.key) {
      case "b": {
        UI_STATE.mode = "build";
        break;
      }
      case "n": {
        UI_STATE.mode = "normal";
        break;
      }
      case "g": {
        UI_STATE.grid = !UI_STATE.grid;
        break;
      }
      case "1": {
        if (UI_STATE.mode === "build") {
          UI_STATE.blueprint = "house";
        }
        break;
      }
      case "2": {
        if (UI_STATE.mode === "build") {
          UI_STATE.blueprint = "barn";
        }
        break;
      }
      case "3": {
        if (UI_STATE.mode === "build") {
          UI_STATE.blueprint = "road";
        }
        break;
      }
    }
  },
  false
);

document.addEventListener("keyup", event => {
  if (event.keyCode == 17) {
    UI_STATE.ctrlDown = false;
  }
});

document.addEventListener("mousemove", event => {
  UI_STATE.mouseIsoX = event.pageX;
  UI_STATE.mouseIsoY = event.pageY;

  if (UI_ELEMENTS.tooltip) {
    UI_ELEMENTS.tooltip.text = "";
  }

  const container = getActiveContainer();

  switch (container) {
    case "map":
      const moveX = event.clientX;
      const moveY = event.clientY;

      // move map
      if (UI_STATE.mouseDown) {
        UI_STATE.offsetX += (moveX - UI_STATE.mouseIsoX) * 0.75;
        UI_STATE.offsetY += (moveY - UI_STATE.mouseIsoY) * 0.75;
      }
      break;

    case "buildmenu":
      const [mouseI, mouseJ] = getActiveGridTile();
      if (isOccupiedBuildmenuTile(mouseI, mouseJ)) {
        if (UI_ELEMENTS.tooltip) {
          UI_ELEMENTS.tooltip.text =
            BUILDMENU_GRID[mouseI][mouseJ].blueprintName;
          UI_ELEMENTS.tooltip.position.set(
            UI_STATE.mouseIsoX - 40,
            UI_STATE.mouseIsoY
          );
        }
      }
      break;
  }
});

document.addEventListener("mousedown", event => {
  const container = getActiveContainer();

  if (container == "map") {
    mouseDiffX = event.pageX;
    mouseDiffY = event.pageY;
  }

  UI_STATE.mouseDown = true;
});

document.addEventListener("mouseup", event => {
  const container = getActiveContainer();

  switch (container) {
    case "map":
      mouseDiffX -= event.pageX;
      mouseDiffY -= event.pageY;
      if (Math.abs(mouseDiffX) + Math.abs(mouseDiffY) < 10) {
        mapClick();
      }
      break;

    case "buildmenu":
      buildmenuClick();
      break;
  }

  UI_STATE.mouseDown = false;
});

function buildmenuClick() {
  const [mouseI, mouseJ] = getActiveGridTile();
  if (isOccupiedBuildmenuTile(mouseI, mouseJ)) {
    UI_STATE.blueprint = BUILDMENU_GRID[mouseI][mouseJ].blueprintName;
    UI_STATE.mode = "build";
    UI_STATE.selection = { type: "blueprint", i: mouseI, j: mouseJ };
  } else {
    UI_STATE.mode = "normal";
    UI_STATE.selection = null;
  }
}

function mapClick() {
  const [i, j] = getActiveTile();
  if (UI_STATE.mode === "build") {
    const blueprintName = UI_STATE.blueprint;
    const blueprint = BLUEPRINTS[UI_STATE.blueprint];

    if (!blueprint) {
      console.log("select a blueprint");
      return;
    }

    if (isAreaFreeForBuilding(i, j, blueprint.height, blueprint.width)) {
      if (sufficientResources(blueprint)) {
        serverRequest({ type: "PLACE_BUILDING", i, j, blueprintName });

        if (!UI_STATE.ctrlDown) {
          UI_STATE.mode = "normal";
          UI_STATE.selection = null;
        }
      } else {
        console.log("not enough resources");
      }
    } else {
      console.log("cannot build");
    }
  } else {
    let maxZ = 0;

    for (let deer of Object.values(STATE.deers)) {
      const [relX, relY] = cart2rel(deer.x, deer.y);
      if (
        UI_STATE.mouseIsoX < relX + TILE_WIDTH / 2 &&
        UI_STATE.mouseIsoX >= relX - TILE_WIDTH / 2 &&
        UI_STATE.mouseIsoY < relY + 15 &&
        UI_STATE.mouseIsoY >= relY - 35 &&
        relY > maxZ
      ) {
        UI_STATE.selection = { type: "deer", id: deer.id };
        maxZ = deer.y;
      }
    }
    for (let tree of Object.values(STATE.trees)) {
      const [_, relY] = tile2rel(tree.i, tree.j);
      if (i == tree.i && j == tree.j && relY > maxZ) {
        UI_STATE.selection = { type: "tree", id: tree.id };
        maxZ = tree.y;
      }
    }
    if (maxZ == 0) {
      if (isTileOnMap(i, j)) {
        UI_STATE.selection = { type: "tile", i: i, j: j };
      } else {
        UI_STATE.selection = null;
      }
    }
  }
}
