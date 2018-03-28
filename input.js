"use strict";

function getActiveTile() {
  const [absX, absY] = rel2abs(UI_STATE.mouseIsoX, UI_STATE.mouseIsoY);
  return abs2tile(absX, absY);
}

// nothing under the mouse
APPLICATION.stage.on("mousemove", event => {
  UI_STATE.hoveredElement = null;
});

// nothing under the mouse
APPLICATION.stage.on("mouseup", event => {
  UI_STATE.selection = null;
});

// update hovered tile
MAP_SPRITE.on("mousemove", event => {
  const [i, j] = getActiveTile();

  if (!isTileOnMap(i, j)) return;

  UI_STATE.hoveredElement = { type: "tile", i, j };
  event.stopPropagation();
});

// handle tile click
MAP_SPRITE.on("mouseup", event => {
  const [i, j] = getActiveTile();

  if (!isTileOnMap(i, j)) return;

  // select tile in normal mode
  if (UI_STATE.mode === "normal") {
    UI_STATE.selection = { type: "tile", i, j };
    event.stopPropagation();
    return;
  }

  // try to place a building in build mode
  if (UI_STATE === "build") {
    const blueprintName = UI_STATE.blueprint;
    const blueprint = BLUEPRINTS[blueprintName];

    if (isAreaFreeForBuilding(i, j, blueprint.height, blueprint.width)) {
      if (sufficientResources(blueprint)) {
        serverRequest({ type: "PLACE_BUILDING", i, j, blueprintName });

        if (!UI_STATE.ctrlDown) {
          UI_STATE.mode = "normal";
        }
      } else {
        console.log("not enough resources");
      }
    } else {
      console.log("cannot build");
    }

    UI_STATE.selection = null;
    event.stopPropagation();
    return;
  }
});

window.addEventListener(
  "keydown",
  event => {
    switch (event.keyCode) {
      case 17:
        UI_STATE.ctrlDown = true;
        break;
      case 37:
        UI_STATE.offsetX += 20;
        break;
      case 38:
        UI_STATE.offsetY += 20;
        break;
      case 39:
        UI_STATE.offsetX -= 20;
        break;
      case 40:
        UI_STATE.offsetY -= 20;
        break;
    }

    switch (event.key) {
      case "g": {
        UI_STATE.grid = !UI_STATE.grid;
        break;
      }
      case "h": {
        UI_STATE.renderHitAreas = !UI_STATE.renderHitAreas;
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
  const newX = event.clientX;
  const newY = event.clientY;

  if (newX === UI_STATE.mouseIsoX && newY === UI_STATE.mouseIsoY) return;

  if (UI_STATE.rightMouseDown) {
    UI_STATE.offsetX += newX - UI_STATE.mouseIsoX;
    UI_STATE.offsetY += newY - UI_STATE.mouseIsoY;
  }

  UI_STATE.mouseIsoX = newX;
  UI_STATE.mouseIsoY = newY;

  // updateHoveredElement();
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
  const movedDistanceSinceMouseDown =
    Math.abs(mouseDiffX - event.clientX) + Math.abs(mouseDiffY - event.clientY);

  if (event.which == 1) {
    UI_STATE.leftMouseDown = false;

    if (movedDistanceSinceMouseDown >= 10) return;

    const { hoveredElement } = UI_STATE;

    if (!hoveredElement) {
      UI_STATE.selection = null;
      return;
    }

    switch (hoveredElement.type) {
      // click an object
      case "deer":
      case "tree":
      case "tile":
        return;

      // UI interaction
      case "button":
        UI_STATE.selection = null;
        UI_STATE.blueprint = hoveredElement.blueprintName;
        UI_STATE.mode = "build";
        break;
      default:
        throw Error(`unknown element type: ${hoveredElement.type}`);
    }
  } else if (event.which == 3) {
    UI_STATE.rightMouseDown = false;

    if (movedDistanceSinceMouseDown >= 10) return;

    UI_STATE.mode = "normal";
    UI_STATE.selection = null;
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
