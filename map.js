"use strict";

/**
 * cart coordinates: virtual map
 * iso coordinates:
 *   - rel: screen
 *   - abs: canvas
 */

const MAP_HEIGHT = 100;
const MAP_WIDTH = 100;
const TILE_HEIGHT = 20;
const TILE_WIDTH = 20;

const TILE_GRASS = "TILE_GRASS";
const TILE_DIRT = "TILE_DIRT";
const TILE_WATER = "TILE_WATER";
const TILE_STORAGE = "TILE_STORAGE";
const TILE_TREE = "TILE_TREE";
const TILE_EMPTY = "TILE_EMPTY";
const TILE_ACTIVE = "TILE_ACTIVE";

const TILE_STATS = {
  TILE_GRASS: {
    backgroundColor: 0x80cf5a,
    borderColor: 0x339900
  },
  TILE_DIRT: {
    backgroundColor: 0x96712f,
    borderColor: 0x403014
  },
  TILE_WATER: {
    backgroundColor: 0x85b9bb,
    borderColor: 0x476263
  },
  TILE_STORAGE: {
    backgroundColor: 0x6f42c2,
    borderColor: 0x6f42c2
  },
  TILE_TREE: {
    backgroundColor: 0x000000,
    borderColor: 0x000000
  },
  TILE_ACTIVE: {
    backgroundColor: 0xff0000,
    borderColor: 0xff0000
  }
};

function cart2tile(cartX, cartY) {
  const j = Math.floor(cartX / TILE_WIDTH);
  const i = Math.floor(cartY / TILE_HEIGHT);

  return [i, j];
}

function tile2cart(i, j) {
  return [j * TILE_WIDTH, i * TILE_HEIGHT];
}

function tile2rel(i, j) {
  const [cartX, cartY] = tile2cart(i, j);
  const [absX, absY] = cart2abs(cartX, cartY);
  return abs2rel(absX, absY);
}

function abs2tile(absX, absY) {
  const [cartX, cartY] = abs2cart(absX, absY);
  return cart2tile(cartX, cartY);
}

function rel2tile(relX, relY) {
  const [absX, absY] = rel2abs(relX, relY);
  return abs2tile(absX, absY);
}

function isTileOnMap(i, j) {
  return j >= 0 && j < MAP_WIDTH && i >= 0 && i < MAP_HEIGHT;
}

function getTileCenter(i, j) {
  return [(j + 0.5) * TILE_WIDTH, (i + 0.5) * TILE_HEIGHT];
}

const map = [];
for (let i = 0; i < MAP_HEIGHT; i++) {
  const line = [];
  for (let j = 0; j < MAP_WIDTH; j++) {
    let type;
    switch (Math.floor(Math.random() * 3 + 1)) {
      case 1:
        type = TILE_DIRT;
        break;
      case 2:
        type = TILE_WATER;
        break;
      case 3:
        type = TILE_GRASS;
        break;
    }
    line.push(type);
  }
  map.push(line);
}

map[3][3] = TILE_STORAGE;
map[7][10] = TILE_TREE;
