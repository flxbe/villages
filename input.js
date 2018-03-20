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

window.addEventListener(
  "keydown",
  event => {
    switch (event.keyCode) {
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
    }
  },
  false
);

document.addEventListener("mousemove", event => {
  // TODO: difference clientX vs pageX
  const moveX = event.clientX;
  const moveY = event.clientY;

  // move map
  if (UI_STATE.mouseDown) {
    UI_STATE.offsetX += (moveX - UI_STATE.mouseIsoX) * 0.75;
    UI_STATE.offsetY += (moveY - UI_STATE.mouseIsoY) * 0.75;
  }

  UI_STATE.mouseIsoX = event.pageX;
  UI_STATE.mouseIsoY = event.pageY;
});

document.addEventListener("mousedown", start => {
  // TODO: add support to check, whether the building can be placed
  if (UI_STATE.mode === "build") {
    const [i, j] = getActiveTile();
    const blueprintName = UI_STATE.blueprint;
    const blueprint = BLUEPRINTS[UI_STATE.blueprint];

    if (!blueprint) {
      console.log("select a blueprint");
      return;
    }

    if (isAreaFreeForBuilding(i, j, blueprint.height, blueprint.width)) {
      serverRequest({ type: "PLACE_BUILDING", i, j, blueprintName });
    } else {
      console.log("cannot build");
    }
  }

  UI_STATE.mouseDown = true;
});

document.addEventListener("mouseup", () => {
  UI_STATE.mouseDown = false;
});
