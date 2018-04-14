import {
  abs2tile,
  rel2abs,
  isTileOnMap,
  isAreaFreeForBuilding,
  sufficientResources
} from "./util.js";
import State from "./state.js";
import openBuildWindow from "./windows/build-window.js";

export default {
  init
};

function init() {
  APPLICATION.stage.on("mousemove", event => {
    State.update({ type: "HOVER", element: null });
  });
}

window.onresize = function resize() {
  const height = window.innerHeight;
  const width = window.innerWidth;

  State.update({ type: "SET_APPLICATION_SIZE", height, width });

  APPLICATION.renderer.resize(width, height);
};

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
        State.update({ type: "SET_CTRL_STATE", value: true });
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
      case "b":
        openBuildWindow();
        break;
      case "g": {
        State.update({ type: "TOGGLE_GRID" });
        break;
      }
      case "h": {
        State.update({ type: "TOGGLE_HIT_AREAS" });
        break;
      }
    }
  },
  false
);

document.addEventListener("keyup", event => {
  if (event.keyCode == 17) {
    State.update({ type: "SET_CTRL_STATE", value: false });
  }
});

document.addEventListener("mousemove", event => {
  State.update({
    type: "UPDATE_MOSE_POSITION",
    x: event.clientX,
    y: event.clientY
  });
});

document.addEventListener("contextmenu", event => {
  event.preventDefault();
});
