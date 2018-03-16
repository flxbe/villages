"use strict";

let mouseIsoX = 0;
let mouseIsoY = 0;
let mouseDown = false;

function getActiveTile() {
  const [absX, absY] = rel2abs(mouseIsoX, mouseIsoY);
  return abs2tile(absX, absY);
}

window.addEventListener(
  "keydown",
  event => {
    switch (event.keyCode) {
      case 37:
        offsetX += 20;
        break;
      case 38:
        offsetY += 20;
        break;
      case 39:
        offsetX -= 20;
        break;
      case 40:
        offsetY -= 20;
        break;
    }

    switch (event.key) {
      case "b": {
        uiState.mode = "build";
        break;
      }
      case "n": {
        uiState.mode = "normal";
        break;
      }
      case "g": {
        uiState.grid = !uiState.grid;
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
  if (mouseDown) {
    offsetX += (moveX - mouseIsoX) * 0.75;
    offsetY += (moveY - mouseIsoY) * 0.75;
  }

  mouseIsoX = event.pageX;
  mouseIsoY = event.pageY;
});

document.addEventListener("mousedown", start => {
  // TODO: add support to check, whether the building can be placed
  if (uiState.mode === "build") {
    const [i, j] = getActiveTile();
    serverRequest({ i, j, type: "PLACE_BUILDING" });
  }

  mouseDown = true;
});

document.addEventListener("mouseup", () => {
  mouseDown = false;
});
