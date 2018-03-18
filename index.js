"use strict";

/**
 * Initialize global variables that are used throughout the app.
 *
 * This should be better managed. Right now, the map graphics layer is created
 * and added in the file `map.js`.
 */
document.body.appendChild(app.view);

/**
 * Start loading necessary assets
 */
PIXI.loader.add(Array.from(assets)).load(setup);

/**
 * At this point, all assets are loaded. Add stuff to the app.
 */
function setup() {
  initUI();

  app.ticker.add(gameloop);
}

/**
 * Proceed the game logic and render the current state.
 * @param {number} delta The weight of the latest frame.
 */
function gameloop(delta) {
  renderMap(state.map);

  for (let deer of Object.values(state.deers)) {
    move_deer(deer, delta);
    const frame = getAnimationFrame(deer.currentAnimation, deer.animationTime);
    deer.sprite.texture = PIXI.loader.resources[frame].texture;

    const [relX, relY] = cart2rel(deer.x, deer.y);
    deer.sprite.x = relX + DEER_OFFSET_X;
    deer.sprite.y = relY + DEER_OFFSET_Y;
  }

  for (let tree of Object.values(state.trees)) {
    tree.animationTime += delta * 0.66;
    const frame = getAnimationFrame(tree.currentAnimation, tree.animationTime);
    tree.sprite.texture = PIXI.loader.resources[frame].texture;

    const [relX, relY] = tile2rel(tree.i, tree.j);
    tree.sprite.x = relX - 60;
    tree.sprite.y = relY - 175;
  }

  renderUI();
}
