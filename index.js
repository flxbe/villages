"use strict";

// TODO: window resize
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const TILE_HEIGHT = 20;
const TILE_WIDTH = 20;

let offset_x = 0;
let offset_y = 0;

let mouseDown = false;
let mouse_isox = 0;
let mouse_isoy = 0;

window.addEventListener(
  "keydown",
  event => {
    switch (event.keyCode) {
      case 37:
        offset_x += 20;
        break;
      case 38:
        offset_y += 20;
        break;
      case 39:
        offset_x -= 20;
        break;
      case 40:
        offset_y -= 20;
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
    if (mouseDown) updateMap();
  },
  false
);

document.addEventListener("mousedown", event => {
  mouseDown = true;
});

document.addEventListener("mouseup", event => {
  mouseDown = false;
});

function updateMap() {
  const [i, j] = getActiveTile();
  if (i >= 0 && i < 100 && j >= 0 && j < 100) {
    map[i][j] = TILE_WATER;
  }
}

const app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT,
  clearBeforeRender: true
});
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

const TILE_GRASS = "TILE_GRASS";
const TILE_DIRT = "TILE_DIRT";
const TILE_WATER = "TILE_WATER";
const TILE_EMPTY = "TILE_EMPTY";
const TILE_ACTIVE = "TILE_ACTIVE";

const TILE_STATS = {
  TILE_GRASS: {
    backgroundColor: 0x80cf5a,
    borderColor: 0x339900
  },
  TILE_DIRT: {
    backgroundColor: 0x96712f,
    borderColor: 0x403014
  },
  TILE_WATER: {
    backgroundColor: 0x85b9bb,
    borderColor: 0x476263
  },
  TILE_ACTIVE: {
    backgroundColor: 0xff0000,
    borderColor: 0xff0000
  }
};

const map = [];
for (let i = 0; i < 100; i++) {
  const line = [];
  for (let j = 0; j < 100; j++) {
    let type;
    switch (Math.floor(Math.random() * 3 + 1)) {
      case 1:
        type = TILE_DIRT;
        break;
      case 2:
        type = TILE_WATER;
        break;
      case 3:
        type = TILE_GRASS;
        break;
    }
    line.push(type);
  }
  map.push(line);
}

function getActiveTile() {
  const mouse_real_isox = mouse_isox - offset_x;
  const mouse_real_isoy = mouse_isoy - offset_y;
  const mousex = (2 * mouse_real_isoy + mouse_real_isox) / 2;
  const mousey = (2 * mouse_real_isoy - mouse_real_isox) / 2;

  const mxi = Math.floor(mousex / TILE_WIDTH);
  const myi = Math.floor(mousey / TILE_HEIGHT);

  return [myi, mxi];
}

function renderMap(map) {
  graphics.clear();

  const [mouse_i, mouse_j] = getActiveTile();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      // cartesian 2D coordinate
      const x = j * TILE_WIDTH;
      const y = i * TILE_HEIGHT;

      // iso coordinate
      const isoX = x - y;
      const isoY = (x + y) / 2;

      const tileType = i == mouse_i && j == mouse_j ? TILE_ACTIVE : map[i][j];
      renderTile(tileType, offset_x + isoX, offset_y + isoY);
    }
  }
}

function renderTile(type, x, y) {
  if (type == TILE_EMPTY) {
    return;
  }
  const { backgroundColor, borderColor } = TILE_STATS[type];
  const h = TILE_HEIGHT;
  const w = TILE_WIDTH;
  const h_2 = h / 2;

  if (x > WIDTH || x + 2 * w < 0 || y - h_2 > HEIGHT || y + h_2 < 0) {
    return;
  }

  graphics.beginFill(backgroundColor);
  graphics.lineStyle(1, borderColor, 1);
  graphics.moveTo(x, y);
  graphics.lineTo(x + w, y + h_2);
  graphics.lineTo(x, y + h);
  graphics.lineTo(x - w, y + h_2);
  graphics.lineTo(x, y);
  graphics.endFill();
}

app.ticker.add(() => renderMap(map));
