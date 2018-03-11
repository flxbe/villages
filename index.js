"use strict";

const WIDTH = window.innerWidth; //700;
const HEIGHT = window.innerHeight; //300;
const TILE_HEIGHT = 20;
const TILE_WIDTH = 20;

const app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

const TILE_GRASS = "TILE_GRASS";
const TILE_DIRT = "TILE_DIRT";
const TILE_WATER = "TILE_WATER";
const TILE_EMPTY = "TILE_EMPTY";

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

function renderMap(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      // cartesian 2D coordinate
      const x = j * TILE_WIDTH;
      const y = i * TILE_HEIGHT;

      // iso coordinate
      const isoX = x - y;
      const isoY = (x + y) / 2;

      const tileType = map[i][j];
      const offset = WIDTH / 2;
      renderTile(tileType, offset + isoX, isoY);
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

  graphics.beginFill(backgroundColor);
  graphics.lineStyle(1, borderColor, 1);
  graphics.moveTo(x, y);
  graphics.lineTo(x + w, y + h_2);
  graphics.lineTo(x, y + h);
  graphics.lineTo(x - w, y + h_2);
  graphics.lineTo(x, y);
  graphics.endFill();
}

renderMap(map);
