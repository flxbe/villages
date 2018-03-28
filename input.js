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
      case "b": {
        BUILD_MENU_LAYER.visible = !BUILD_MENU_LAYER.visible;
        UI_STATE.buildmenu = !UI_STATE.buildmenu;
        if (!BUILD_MENU_LAYER.visible) {
          UI_STATE.selection = null;
        }
        break;
      }
      case "g": {
        UI_STATE.grid = !UI_STATE.grid;
        break;
      }
      case "h": {
        UI_STATE.renderHitAreas = !UI_STATE.renderHitAreas;
        break;
      }
      case "1": {
        if (UI_STATE.buildmenu) {
          UI_STATE.selection = { type: "blueprint", id: "house" };
        }
        break;
      }
      case "2": {
        if (UI_STATE.buildmenu) {
          UI_STATE.selection = { type: "blueprint", id: "barn" };
        }
        break;
      }
      case "3": {
        if (UI_STATE.buildmenu) {
          UI_STATE.selection = { type: "blueprint", id: "road" };
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
        UI_STATE.selection = {
          type: "blueprint",
          id: hoveredElement.blueprintName,
          i: hoveredElement.i,
          j: hoveredElement.j
        };
        break;
      default:
        throw Error(`unknown element type: ${hoveredElement.type}`);
    }
  } else if (event.which == 3) {
    UI_STATE.rightMouseDown = false;

    if (movedDistanceSinceMouseDown >= 10) return;

    UI_STATE.selection = null;
  }
});

function updateHoveredElement() {
  const { mouseIsoX: mX, mouseIsoY: mY } = UI_STATE;

  // check for build menu interaction
  if (BUILD_MENU_LAYER.visible) {
    for (let i = 0; i < BUILDMENU_GRID.length; i++) {
      for (let j = 0; j < BUILDMENU_GRID[i].length; j++) {
        const tile = BUILDMENU_GRID[i][j];
        if (tile.empty) continue;

        const x = j * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_X;
        const y = i * BUILDMENU_TILESIZE + BUILDMENU_OFFSET_Y;
        if (
          pointInHitbox(x, y, BUILDMENU_TILESIZE, BUILDMENU_TILESIZE, mX, mY)
        ) {
          UI_STATE.hoveredElement = {
            type: "button",
            blueprintName: tile.blueprintName,
            i: i,
            j: j
          };
          return;
        }
      }
    }
  }

  const [i, j] = getActiveTile();

  // check for hovered objects
  if (!UI_STATE.selection || UI_STATE.selection.type !== "blueprint") {
    let maxZ = 0;

    for (let deer of Object.values(STATE.deers)) {
      if (
        pointInHitbox(
          deer.sprite.x + deer.sprite.hitArea.x,
          deer.sprite.y + deer.sprite.hitArea.y,
          deer.sprite.hitArea.width,
          deer.sprite.hitArea.height,
          UI_STATE.mouseIsoX,
          UI_STATE.mouseIsoY
        ) &&
        maxZ < deer.sprite.zIndex
      ) {
        UI_STATE.hoveredElement = { type: "deer", id: deer.id };
        maxZ = deer.sprite.zIndex;
      }
    }

    for (let tree of Object.values(STATE.trees)) {
      if (
        pointInHitbox(
          tree.sprite.x + tree.sprite.hitArea.x,
          tree.sprite.y + tree.sprite.hitArea.y,
          tree.sprite.hitArea.width,
          tree.sprite.hitArea.height,
          UI_STATE.mouseIsoX,
          UI_STATE.mouseIsoY
        ) &&
        maxZ < tree.sprite.zIndex
      ) {
        UI_STATE.hoveredElement = { type: "tree", id: tree.id };
        maxZ = tree.sprite.zIndex;
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
