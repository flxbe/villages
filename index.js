"use strict";

// TODO: create UI
let style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 16,
  fill: "white"
});

const storageFoodText = new PIXI.Text("Storage (Food)", style);
const storageWoodText = new PIXI.Text("Storage (Wood)", style);
const inventoryDeer1Text = new PIXI.Text("", style);
const inventoryDeer2Text = new PIXI.Text("", style);
PIXI.loader.add(Array.from(assets)).load(setup);

function setup() {
  app.stage.addChild(storageFoodText);
  storageFoodText.position.set(10, 10);
  app.stage.addChild(storageWoodText);
  storageWoodText.position.set(10, 30);

  app.stage.addChild(inventoryDeer1Text);
  inventoryDeer1Text.position.set(300, 10);
  app.stage.addChild(inventoryDeer2Text);
  inventoryDeer2Text.position.set(300, 30);

  app.ticker.add(gameloop);
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

function gameloop(delta) {
  renderMap(state.map);

  for (let deer of Object.values(state.deers)) {
    move(deer, delta * 5);
    const frame = getAnimationFrame(deer.currentAnimation, deer.animationTime);
    deer.sprite.texture = PIXI.loader.resources[frame].texture;

    const [relX, relY] = cart2rel(deer.x, deer.y);
    deer.sprite.x = relX + DEER_OFFSET_X;
    deer.sprite.y = relY + DEER_OFFSET_Y;
  }

  storageFoodText.text = `Storage (Food): ${state.storage.food}`;
  storageWoodText.text = `Storage (Wood): ${state.storage.wood}`;
  inventoryDeer1Text.text = `Inventory (Deer1): ${Math.floor(
    state.deers["deer1"].inventory
  )}`;
  inventoryDeer2Text.text = `Inventory (Deer2): ${Math.floor(
    state.deers["deer2"].inventory
  )}`;
}
