PIXI.loader.add(deerAssets).load(setup);

function setup() {
  deer.sprite = new PIXI.Sprite();

  setAnimation("STAND");

  app.stage.addChild(deer.sprite);
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

  move(deer, delta);

  if (deer.sprite) {
    const frame = getAnimationFrame(deer);
    deer.sprite.texture = PIXI.loader.resources[frame].texture;

    const [relX, relY] = cart2rel(deer.x, deer.y);
    deer.sprite.x = relX + DEER_OFFSET_X;
    deer.sprite.y = relY + DEER_OFFSET_Y;
  }
});
