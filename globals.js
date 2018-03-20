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

const APPLICATION = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});

const MAP_GRAPHICS_LAYER = new PIXI.Graphics();
APPLICATION.stage.addChild(MAP_GRAPHICS_LAYER);

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
  updateMap: true,

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
