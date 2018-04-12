import State from "./state.js";
import { getAssets } from "./assets.js";
import { startServer } from "./mock-server/server.js";

import Input from "./input.js";
import Map from "./map.js";
import UiContainer from "./ui.js";
import WindowManager from "./window-manager.js";
import Tooltips from "./tooltips.js";

function load() {
  State.reset();

  const height = window.innerHeight;
  const width = window.innerWidth;
  APPLICATION = new PIXI.Application({ width, height });
  APPLICATION.stage.interactive = true;
  APPLICATION.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);
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
  APPLICATION.stage.addChild(WindowManager);
  APPLICATION.stage.addChild(Tooltips);

  startServer();

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
