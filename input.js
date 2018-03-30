"use strict";

function getActiveTile() {
  const [absX, absY] = rel2abs(UI_STATE.mouseIsoX, UI_STATE.mouseIsoY);
  return abs2tile(absX, absY);
}

// nothing under the mouse
APPLICATION.stage.on("mousemove", event => {
  UI_STATE.hoveredElement = null;
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

  if (!isTileOnMap(i, j)) {
    UI_STATE.selection = null;
    return;
  }

  // select tile in normal mode
  if (UI_STATE.mode === "normal") {
    UI_STATE.selection = { type: "tile", i, j };
    event.stopPropagation();
    return;
  }

  // try to place a building in build mode
  if (UI_STATE.mode === "build") {
    const { blueprintName } = UI_STATE;
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
    function enterFullscreen() {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    }

    function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }

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
      case 122:
        if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen)) {
          exitFullscreen();
        } else {
          enterFullscreen();
        }
        event.preventDefault();
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
});

document.addEventListener("contextmenu", event => {
  event.preventDefault();
});

document.addEventListener("mousedown", event => {
  UI_STATE.clickStartX = event.clientX;
  UI_STATE.clickStartY = event.clientY;

  if (event.which == 1) {
    UI_STATE.leftMouseDown = true;
  } else if (event.which == 3) {
    UI_STATE.rightMouseDown = true;
  }
});

document.addEventListener("mouseup", event => {
  const movedSignificantly = Math.abs(UI_STATE.clickStartX - UI_STATE.mouseIsoX) + Math.abs(UI_STATE.clickStartY - UI_STATE.mouseIsoY) >= 10;

  if (event.which == 1) {
    UI_STATE.leftMouseDown = false;
  } else if (event.which == 3) {
    UI_STATE.rightMouseDown = false;
    if (!movedSignificantly) {
      resetUI_STATE();
    }
  }
});
