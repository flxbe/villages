import {
  abs2tile,
  rel2abs,
  isTileOnMap,
  isAreaFreeForBuilding,
  sufficientResources
} from "./util.js";
import context from "./context.js";
import { toggleBuildMenu } from "./windows/build-menu.js";

window.onresize = function resize() {
  const height = window.innerHeight;
  const width = window.innerWidth;

  context.update({ type: "SET_APPLICATION_SIZE", height, width });
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
        context.update({ type: "SET_CTRL_context", value: true });
        break;
      case 37:
        context.update({ type: "MOVE_CAMERA", dX: 20 });
        break;
      case 38:
        context.update({ type: "MOVE_CAMERA", dY: 20 });
        break;
      case 39:
        context.update({ type: "MOVE_CAMERA", dX: -20 });
        break;
      case 40:
        context.update({ type: "MOVE_CAMERA", dY: -20 });
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
        toggleBuildMenu();
        break;
      case "g": {
        context.update({ type: "TOGGLE_GRID" });
        break;
      }
      case "h": {
        context.update({ type: "TOGGLE_HIT_AREAS" });
        break;
      }
    }
  },
  false
);

document.addEventListener("keyup", event => {
  if (event.keyCode == 17) {
    context.update({ type: "SET_CTRL_context", value: false });
  }
});

document.addEventListener("mousemove", event => {
  context.update({
    type: "UPDATE_MOSE_POSITION",
    x: event.clientX,
    y: event.clientY
  });
});

document.addEventListener("contextmenu", event => {
  event.preventDefault();
});
