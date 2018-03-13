"use strict";

let mouseDown = false;
let mouse_isox = 0;
let mouse_isoy = 0;

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
      case "a":
        dir = [-1, 1];
        setAnimation("GO_W");
        break;
      case "w":
        dir = [-2, -2];
        setAnimation("GO_N");
        break;
      case "d":
        dir = [1, -1];
        setAnimation("GO_E");
        break;
      case "s":
        dir = [2, 2];
        setAnimation("GO_S");
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
  mouseDown = true;
});

document.addEventListener("mouseup", event => {
  mouseDown = false;
});
