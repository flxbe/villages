"use strict";

// TODO: add global state object
// TODO: add server actions to update state
let inventory = 0;
let storage = 0;

// TODO: create UI
let style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 20,
  fill: "white",
  strokeThickness: 4
});

const storageText = new PIXI.Text("", style);
const inventoryText = new PIXI.Text("", style);

PIXI.loader.add(deerAssets).load(setup);

function setup() {
  deer.sprite = new PIXI.Sprite();
  setAnimation("STAND");
  app.stage.addChild(deer.sprite);

  app.stage.addChild(storageText);
  app.stage.addChild(inventoryText);
  inventoryText.position.set(10, 40);
  storageText.position.set(10, 10);
}

const app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

function renderMap(map) {
  graphics.clear();

  const [mouse_i, mouse_j] = getActiveTile();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const [relX, relY] = tile2rel(i, j);

      const tileType = i == mouse_i && j == mouse_j ? TILE_ACTIVE : map[i][j];
      renderTile(tileType, relX, relY);
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

app.ticker.add(delta => {
  renderMap(map);
  move(deer, delta * 5);

  if (deer.sprite) {
    const frame = getAnimationFrame(deer);
    deer.sprite.texture = PIXI.loader.resources[frame].texture;

    const [relX, relY] = cart2rel(deer.x, deer.y);
    deer.sprite.x = relX + DEER_OFFSET_X;
    deer.sprite.y = relY + DEER_OFFSET_Y;
  }

  storageText.text = `Storage: ${storage}`;
  inventoryText.text = `Inventory: ${Math.floor(inventory)}`;
});
