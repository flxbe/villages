import {
  abs2tile,
  rel2abs,
  isTileOnMap,
  isAreaFreeForBuilding,
  sufficientResources
} from "./util.js";
import UiState from "./ui-state.js";
import { playMusic, stopMusic } from "./sound.js";

// nothing under the mouse
APPLICATION.stage.on("mousemove", event => {
  UiState.hoveredElement = null;
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
        UiState.ctrlDown = true;
        break;
      case 37:
        UiState.offsetX += 20;
        break;
      case 38:
        UiState.offsetY += 20;
        break;
      case 39:
        UiState.offsetX -= 20;
        break;
      case 40:
        UiState.offsetY -= 20;
        break;
      case 122:
        if (
          (document.fullScreenElement && document.fullScreenElement !== null) ||
          (document.mozFullScreen || document.webkitIsFullScreen)
        ) {
          exitFullscreen();
        } else {
          enterFullscreen();
        }
        event.preventDefault();
        break;
    }

    switch (event.key) {
      case "s":
        if(UiState.currentMusicTitle) stopMusic();
        else playMusic();
        break;
      case "g": {
        UiState.grid = !UiState.grid;
        break;
      }
      case "h": {
        UiState.renderHitAreas = !UiState.renderHitAreas;
        break;
      }
      case "1": {
        if (UiState.buildmenu) {
          UiState.selection = { type: "blueprint", id: "house" };
        }
        break;
      }
      case "2": {
        if (UiState.buildmenu) {
          UiState.selection = { type: "blueprint", id: "barn" };
        }
        break;
      }
      case "3": {
        if (UiState.buildmenu) {
          UiState.selection = { type: "blueprint", id: "road" };
        }
        break;
      }
    }
  },
  false
);

document.addEventListener("keyup", event => {
  if (event.keyCode == 17) {
    UiState.ctrlDown = false;
  }
});

document.addEventListener("mousemove", event => {
  UiState.mouseIsoX = event.clientX;
  UiState.mouseIsoY = event.clientY;
});

document.addEventListener("contextmenu", event => {
  event.preventDefault();
});

document.addEventListener("mousedown", event => {
  if (event.which == 1) {
    UiState.leftMouseDown = true;
  } else if (event.which == 3) {
    UiState.rightMouseDown = true;
  }
});

document.addEventListener("mouseup", event => {
  if (event.which == 1) {
    UiState.leftMouseDown = false;
  } else if (event.which == 3) {
    UiState.rightMouseDown = false;
  }
});
