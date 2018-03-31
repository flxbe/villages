/**
 * All global variables are defined in here. This should help to manage the
 * code.
 *
 * All global variables will be written in uppercase.
 */

"use strict";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// sprite specific render offsets
const DEER_OFFSET_X = -50;
const DEER_OFFSET_Y = -70;
const DEER_HIT_AREA = new PIXI.Rectangle(38, 35, 24, 40);

const PALM_OFFSET_X = -60;
const PALM_OFFSET_Y = -175;
const PALM_HIT_AREA = new PIXI.Rectangle(45, 165, 30, 30);

// UI layer "buildmenu"
const BUILDMENU_TILESIZE = 50;

const MAP_HEIGHT = 100;
const MAP_WIDTH = 100;
const TILE_HEIGHT = 20;
const TILE_WIDTH = 20;

const TILE_GRASS = "TILE_GRASS";
const TILE_DIRT = "TILE_DIRT";
const TILE_WATER = "TILE_WATER";
const TILE_DEEPWATER = "TILE_DEEPWATER";
const TILE_TREE = "TILE_TREE";
const TILE_BUILDING = "TILE_BUILDING";
const TILE_ROAD = "TILE_ROAD";
const TILE_EMPTY = "TILE_EMPTY";
const TILE_ACTIVE = "TILE_ACTIVE";

const APPLICATION = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
APPLICATION.stage.interactive = true;
APPLICATION.stage.hitArea = new PIXI.Rectangle(0, 0, WIDTH, HEIGHT);
APPLICATION.renderer.plugins.interaction.moveWhenInside = true;

/**
 * UI layers
 */
const UI_CONTAINER = new PIXI.Container();

/**
 * tooltip layer
 */
const tooltipStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 12,
  fill: "white"
});

const TOOLTIP_LAYER = new PIXI.Text("", tooltipStyle);

// blueprint config
const BLUEPRINTS = {
  house: {
    height: 4,
    width: 4,
    wood: 40
  },
  barn: {
    height: 6,
    width: 4,
    wood: 100
  },
  road: {
    height: 1,
    width: 1,
    wood: 10
  }
};
