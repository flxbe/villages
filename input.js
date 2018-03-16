"use strict";

let mouse_isox = 0;
let mouse_isoy = 0;

function getActiveTile() {
  const [absX, absY] = rel2abs(mouse_isox, mouse_isoy);
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
    }
  },
  false
);

document.addEventListener(
  "mousemove",
  event => {
    mouse_isox = event.pageX;
    mouse_isoy = event.pageY;
  },
  false
);

document.addEventListener("mousedown", start => {
  // TODO: add support to check, whether the building can be placed
  if (uiState.mode === "build") {
    const [i, j] = getActiveTile();
    serverRequest({ i, j, type: "PLACE_BUILDING" });
  }

  let startX = start.clientX;
  let startY = start.clientY;

  function moveOffset(mmevent) {
    const moveX = mmevent.clientX;
    const moveY = mmevent.clientY;

    offsetX += (moveX - startX) * 0.75;
    offsetY += (moveY - startY) * 0.75;

    startX = moveX;
    startY = moveY;
  }

  document.addEventListener("mousemove", moveOffset);

  document.addEventListener("mouseup", end => {
    document.removeEventListener("mousemove", moveOffset);
  });
});
