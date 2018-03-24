/**
 * All global variables are defined in here. This should help to manage the
 * code.
 *
 * All global variables will be written in uppercase.
 */

"use strict";

// TODO: window resize
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// sprite specific render offsets
const DEER_OFFSET_X = -50;
const DEER_OFFSET_Y = -70;
const PALM_OFFSET_X = -60;
const PALM_OFFSET_Y = -175;

const MAP_HEIGHT = 100;
const MAP_WIDTH = 100;
const TILE_HEIGHT = 20;
const TILE_WIDTH = 20;

const TILE_GRASS = "TILE_GRASS";
const TILE_DIRT = "TILE_DIRT";
const TILE_WATER = "TILE_WATER";
const TILE_DEEPWATER = "TILE_DEEPWATER";
const TILE_EMPTY = "TILE_EMPTY";
const TILE_ACTIVE = "TILE_ACTIVE";

const APPLICATION = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});

// map
const MAP_TEXTURE = PIXI.RenderTexture.create();
const MAP_SPRITE = new PIXI.Sprite(MAP_TEXTURE);
APPLICATION.stage.addChild(MAP_SPRITE);

// map grid
const MAP_GRID_TEXTURE = PIXI.RenderTexture.create();
const MAP_GRID_SPRITE = new PIXI.Sprite(MAP_GRID_TEXTURE);
APPLICATION.stage.addChild(MAP_GRID_SPRITE);

// renders the mouse and blueprints on the map
const MAP_DECORATION_LAYER = new PIXI.Graphics();
APPLICATION.stage.addChild(MAP_DECORATION_LAYER);

const OBJECT_CONTAINER = new PIXI.Container();
APPLICATION.stage.addChild(OBJECT_CONTAINER);

const UI_CONTAINER = new PIXI.Container();
APPLICATION.stage.addChild(UI_CONTAINER);

// save ui elements
const UI_ELEMENTS = {};

// Server STATE
const STATE = {
  map: undefined,
  storage: {
    food: 500,
    wood: 500
  },
  deers: {},
  trees: {}
};

// UI STATE
const UI_STATE = {
  blueprint: "house",
  mode: "normal",
  grid: false,

  // camera
  offsetX: 200,
  offsetY: 200,

  // mouse state
  mouseIsoX: 0,
  mouseIsoY: 0,
  mouseDown: false
};

// Animation buffer
const ANIMATIONS = {};

// asset buffer
let ASSETS;

// blueprint config
let BLUEPRINTS;
