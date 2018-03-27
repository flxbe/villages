"use strict";

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
  const moveX = event.clientX;
  const moveY = event.clientY;

  // move map
  if (UI_STATE.rightMouseDown) {
    UI_STATE.offsetX += moveX - UI_STATE.mouseIsoX;
    UI_STATE.offsetY += moveY - UI_STATE.mouseIsoY;
  }

  UI_STATE.mouseIsoX = event.pageX;
  UI_STATE.mouseIsoY = event.pageY;

  updateHoveredElement();

  if (UI_ELEMENTS.tooltip) {
    UI_ELEMENTS.tooltip.text = "";
  }
});

document.addEventListener("contextmenu", event => {
  event.preventDefault();
});

let mouseDiffX = 0;
let mouseDiffY = 0;

document.addEventListener("mousedown", event => {
  if (event.which == 1) {
    UI_STATE.leftMouseDown = true;
  } else if (event.which == 3) {
    UI_STATE.rightMouseDown = true;
  }

  mouseDiffX = event.clientX;
  mouseDiffY = event.clientY;
});

document.addEventListener("mouseup", event => {
  if (event.which == 1) {
    UI_STATE.leftMouseDown = false;

    if (Math.abs(mouseDiffX - event.clientX) + Math.abs(mouseDiffY - event.clientY) < 10) {
      const { hoveredElement } = UI_STATE;

      if (!hoveredElement) {
        UI_STATE.selection = null;
        return;
      }

      switch (hoveredElement.type) {
        // click an object
        case "deer":
        case "tree": {
          if (UI_STATE.mode === "build") {
            throw Error(
              `should be imposible to hover in build mode: ${hoveredElement.type}`
            );
          }
          UI_STATE.selection = hoveredElement;
        }

        // click on a tile
        case "tile":
          if (UI_STATE.mode === "build") {
            const { i, j } = hoveredElement;
            const blueprintName = UI_STATE.blueprint;
            const blueprint = BLUEPRINTS[blueprintName];

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
            UI_STATE.selection = hoveredElement;
          }
          break;

        // UI interaction
        case "button":
          UI_STATE.selection = null;
          UI_STATE.blueprint = hoveredElement.blueprintName;
          UI_STATE.mode = "build";
          break;
        default:
          throw Error(`unknown element type: ${hoveredElement.type}`);
      }
    }
  } else if (event.which == 3) {
    UI_STATE.rightMouseDown = false;

    if (Math.abs(mouseDiffX - event.clientX) + Math.abs(mouseDiffY - event.clientY) < 10) {
      UI_STATE.mode = "normal";
      UI_STATE.selection = null;
    }
  }
});

function updateHoveredElement() {
  const { mouseIsoX: mX, mouseIsoY: mY } = UI_STATE;

  // check for build menu interaction
  for (let i = 0; i < BUILDMENU_GRID.length; i++) {
    for (let j = 0; j < BUILDMENU_GRID[i].length; j++) {
      const tile = BUILDMENU_GRID[i][j];
      if (tile.empty) continue;

      const x = j * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_X;
      const y = i * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_Y;
      if (pointInHitbox(x, y, BUILDMENU_TILESIZE, BUILDMENU_TILESIZE, mX, mY)) {
        UI_STATE.hoveredElement = {
          type: "button",
          blueprintName: tile.blueprintName
        };
        return;
      }
    }
  }

  const [i, j] = getActiveTile();

  // check for hovered objects
  if (UI_STATE.mode === "normal") {
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
        UI_STATE.hoveredElement = { type: "deer", id: deer.id };
        maxZ = deer.y;
      }
    }

    for (let tree of Object.values(STATE.trees)) {
      const [_, relY] = tile2rel(tree.i, tree.j);
      if (i == tree.i && j == tree.j && relY > maxZ) {
        UI_STATE.hoveredElement = { type: "tree", id: tree.id };
        maxZ = tree.y;
      }
    }

    if (maxZ !== 0) return;
  }

  // check for hovered tiles
  if (isTileOnMap(i, j)) {
    UI_STATE.hoveredElement = { type: "tile", i, j };
    return;
  }

  UI_STATE.hoveredElement = null;
}
