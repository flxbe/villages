"use strict";

/**
 * Initialize global variables that are used throughout the app.
 *
 * This should be better managed. Right now, the map MAP_GRAPHICS_LAYER layer is created
 * and added in the file `map.js`.
 */
document.body.appendChild(APPLICATION.view);

/**
 * Start loading necessary ASSETS
 */
PIXI.loader.add(Array.from(ASSETS)).load(setup);

/**
 * At this point, all ASSETS are loaded. Add stuff to the app.
 */
function setup() {
  initUI();

  APPLICATION.ticker.add(gameloop);
}

/**
 * Proceed the game logic and render the current STATE.
 * @param {number} delta The weight of the latest frame.
 */
function gameloop(delta) {
  // map
  MAP_SPRITE.position.x = UI_STATE.offsetX - UI_STATE.mapOffsetX;
  MAP_SPRITE.position.y = UI_STATE.offsetY;

  // map grid
  MAP_GRID_SPRITE.position.x = UI_STATE.offsetX - UI_STATE.mapOffsetX;
  MAP_GRID_SPRITE.position.y = UI_STATE.offsetY;
  MAP_GRID_SPRITE.visible = UI_STATE.grid;

  renderMapDecoration();
  renderSelectionDecoration();
  renderUI();

  HITBOX_CONTAINER.clear();

  for (let deer of Object.values(STATE.deers)) {
    move_deer(deer, delta);
    const frame = getAnimationFrame(deer.currentAnimation, deer.animationTime);
    deer.sprite.texture = PIXI.loader.resources[frame].texture;
    deer.sprite.zIndex = deer.y;

    const [relX, relY] = cart2rel(deer.x, deer.y);
    deer.sprite.x = relX + DEER_OFFSET_X;
    deer.sprite.y = relY + DEER_OFFSET_Y;

    if (UI_STATE.renderHitAreas) renderHitBox(deer);
  }

  for (let tree of Object.values(STATE.trees)) {
    tree.animationTime += delta * 0.66;
    const frame = getAnimationFrame(tree.currentAnimation, tree.animationTime);
    tree.sprite.texture = PIXI.loader.resources[frame].texture;

    const [relX, relY] = tile2rel(tree.i, tree.j);
    tree.sprite.x = relX + PALM_OFFSET_X;
    tree.sprite.y = relY + PALM_OFFSET_Y;

    if (UI_STATE.renderHitAreas) renderHitBox(tree);
  }

  OBJECT_CONTAINER.children.sort(
    (child1, child2) => child1.zIndex - child2.zIndex
  );
}

function renderHitBox({ sprite }) {
  if (!sprite.hitArea) return;

  const x = sprite.x + sprite.hitArea.x;
  const y = sprite.y + sprite.hitArea.y;
  const w = sprite.hitArea.width;
  const h = sprite.hitArea.height;

  HITBOX_CONTAINER.lineStyle(1, "0xffffff", 1);
  HITBOX_CONTAINER.moveTo(x, y);
  HITBOX_CONTAINER.lineTo(x + w, y);
  HITBOX_CONTAINER.lineTo(x + w, y + h);
  HITBOX_CONTAINER.lineTo(x, y + h);
  HITBOX_CONTAINER.lineTo(x, y);
}
