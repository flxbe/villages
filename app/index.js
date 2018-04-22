import State from "./state.js";
import { getAssets } from "./assets.js";
import { startServer } from "./mock-server/server.js";

import Input from "./input.js";
import Map from "./map.js";
import UiContainer from "./ui.js";
import Compositor from "./ui-framework/compositor.js";
import Tooltips from "./tooltips.js";

import openTestWindow from "./windows/test-window.js";

/**
 * Set PIXI default settings.
 *
 * The `resolution` allows for high-density displays like on a macbook.
 * The `scale_mode` parameter forces the textures to stay pixelated when scaled
 * up.
 */
PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

/**
 * The inital loading step of the application.
 */
function load() {
  State.reset();

  const height = window.innerHeight;
  const width = window.innerWidth;
  APPLICATION = new PIXI.Application({
    width,
    height,
    autoResize: true
  });
  APPLICATION.stage.interactive = true;
  APPLICATION.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);
  APPLICATION.renderer.backgroundColor = "0x1099bb";
  document.body.appendChild(APPLICATION.view);

  State.update({ type: "SET_APPLICATION_SIZE", height, width });
  PIXI.loader.add(getAssets()).load(setup);
}

/**
 * At this point, all ASSETS are loaded. Add stuff to the app.
 */
function setup() {
  Input.init();
  Map.init();
  UiContainer.init();
  Tooltips.init();

  APPLICATION.stage.addChild(Map);
  APPLICATION.stage.addChild(UiContainer);
  APPLICATION.stage.addChild(Compositor.get());
  APPLICATION.stage.addChild(Tooltips);

  startServer();

  openTestWindow();

  APPLICATION.ticker.add(gameloop);
}

/**
 * Proceed the game logic and render the current State.get().
 * @param {number} delta The weight of the latest frame.
 */
function gameloop(delta) {
  State.update({ type: "MOVE", timestamp: Date.now(), delta });
}

load();
