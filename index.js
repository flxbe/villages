"use strict";

/**
 * Initialize global variables that are used throughout the app.
 *
 * This should be better managed. Right now, the map graphics layer is created
 * and added in the file `map.js`.
 */
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

document.body.appendChild(app.view);

/**
 * Start loading necessary assets
 */
PIXI.loader.add(Array.from(assets)).load(setup);

/**
 * At this point, all assets are loaded. Add stuff to the app.
 */
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

/**
 * Proceed the game logic and render the current state.
 * @param {number} delta The weight of the latest frame.
 */
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
