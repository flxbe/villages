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

document.addEventListener("mousedown", event => {
  const mouseTile = getActiveTile();
});
