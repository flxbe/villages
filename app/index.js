import State from "./state.js";
import { getAssets } from "./assets.js";
import server from "./server.js";

import "./input.js";
import Map from "./map.js";
import UiContainer from "./ui.js";
import Compositor from "./html-gui/compositor.js";
import Tooltips from "./tooltips.js";

/**
 * Set PIXI default settings.
 *
 * The `resolution` allows for high-density displays like on a macbook.
 * The `scale_mode` parameter forces the textures to stay pixelated when scaled
 * up.
 */
PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// TODO: re-add the exact hover input method.

/**
 * The inital loading step of the application.
 */
async function load() {
  State.reset();

  server.on("update", update => State.update(update));
  await server.connect();

  const height = window.innerHeight;
  const width = window.innerWidth;
  APPLICATION = new PIXI.Application({
    width,
    height,
    autoResize: true
  });
  APPLICATION.renderer.plugins.interaction.moveWhenInside = true;
  APPLICATION.stage.interactive = true;
  APPLICATION.renderer.backgroundColor = "0x1099bb";

  State.on("SET_APPLICATION_SIZE", ({ height, width }) => {
    APPLICATION.renderer.resize(width, height);
    APPLICATION.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);
  });

  const windowLayer = document.getElementById("window-layer");
  Compositor.mount(windowLayer);

  document.body.insertBefore(APPLICATION.view, windowLayer);

  State.update({ type: "SET_APPLICATION_SIZE", height, width });
  PIXI.loader.add(getAssets()).load(setup);
}

/**
 * At this point, all ASSETS are loaded. Add stuff to the app.
 */
function setup() {
  Map.init();
  UiContainer.init();
  Tooltips.init();

  APPLICATION.stage.addChild(Map);
  APPLICATION.stage.addChild(UiContainer);
  APPLICATION.stage.addChild(Tooltips);

  server.request({ type: "LOAD_MAP" });

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
