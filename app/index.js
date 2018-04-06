import { initUI, renderUI } from "./ui.js";
import { getAssets } from "./assets.js";
import "./input.js";
import Map from "./map.js";
import { startServer } from "./mock-server/server.js";
import { playMusic } from "./sound.js";

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

PIXI.loader.add(getAssets()).load(setup);
/**
 * At this point, all ASSETS are loaded. Add stuff to the app.
 */
function setup() {
  playMusic();
  Map.init();
  APPLICATION.stage.addChild(Map);

  APPLICATION.stage.addChild(UI_CONTAINER);

  APPLICATION.stage.addChild(TOOLTIP_LAYER);
  TOOLTIP_LAYER.position.set(0, 0);

  Map.init();
  startServer();
  initUI();

  APPLICATION.ticker.add(gameloop);
}

/**
 * Proceed the game logic and render the current State.get().
 * @param {number} delta The weight of the latest frame.
 */
function gameloop(delta) {
  Map.render(delta);
  renderUI();
}
