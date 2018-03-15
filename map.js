"use strict";

/**
 * cart coordinates: virtual map
 * iso coordinates:
 *   - rel: screen
 *   - abs: canvas
 */

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

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

/**
 * Convert cartesian coordinates to tile indices.
 * @param {number} cartX
 * @param {number} cartY
 */
function cart2tile(cartX, cartY) {
  const j = Math.floor(cartX / TILE_WIDTH);
  const i = Math.floor(cartY / TILE_HEIGHT);

  return [i, j];
}

/**
 * Convert tile indices to cartesian coordinates.
 * @param {number} i
 * @param {number} j
 */
function tile2cart(i, j) {
  return [j * TILE_WIDTH, i * TILE_HEIGHT];
}

/**
 * Convert tile indices to relative coordinates.
 * @param {number} i
 * @param {number} j
 */
function tile2rel(i, j) {
  const [cartX, cartY] = tile2cart(i, j);
  const [absX, absY] = cart2abs(cartX, cartY);
  return abs2rel(absX, absY);
}

/**
 * Convert absolute coordinates to tile indices.
 * @param {number} absX
 * @param {number} absY
 */
function abs2tile(absX, absY) {
  const [cartX, cartY] = abs2cart(absX, absY);
  return cart2tile(cartX, cartY);
}

/**
 * Convert relative coordinates to tile indices.
 * @param {number} relX
 * @param {number} relY
 */
function rel2tile(relX, relY) {
  const [absX, absY] = rel2abs(relX, relY);
  return abs2tile(absX, absY);
}

/**
 * Check if tile indices give a tile on the map.
 * @param {number} i
 * @param {number} j
 */
function isTileOnMap(i, j) {
  return j >= 0 && j < MAP_WIDTH && i >= 0 && i < MAP_HEIGHT;
}

/**
 * Return cartesian coordinates of the center of the tile with given indices.
 * @param {number} i
 * @param {number} j
 */
function getTileCenter(i, j) {
  return [(j + 0.5) * TILE_WIDTH, (i + 0.5) * TILE_HEIGHT];
}

/**
 * Check if tile indices give a tile covered by the blueprint.
 * @param {number} i
 * @param {number} j
 */
function isInBlueprint(i, j) {
  const [iMouse, jMouse] = getActiveTile();

  return i <= iMouse && i >= iMouse - 3 && j <= jMouse && j >= jMouse - 3;
}

/**
 * Render the complete map by iterating over the two dimensional tile array.
 * @param {tile[][]} map
 */
function renderMap(map) {
  graphics.clear();

  const [mouse_i, mouse_j] = getActiveTile();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const [relX, relY] = tile2rel(i, j);

      let tileType;
      switch (state.mode) {
        case "normal": {
          tileType = map[i][j];
          break;
        }
        case "build": {
          if (isInBlueprint(i, j)) {
            tileType = TILE_ACTIVE;
          } else {
            tileType = map[i][j];
          }
          break;
        }
        default: {
          throw Error(`unknown mode: ${state.mode}`);
        }
      }

      if (i == mouse_i && j == mouse_j) tileType = TILE_ACTIVE;

      renderTile(tileType, map[i][j].shade, relX, relY);
    }
  }
}

/**
 * Render a tile of type `type` at the specified relative coordinates.
 * The coordinates describe the upper corner of the isometric tile.
 * @param {TILE_TYPE} type
 * @param {string} color - hexadecimal color, e.g. "0xff0000"
 * @param {number} relX
 * @param {number} relY
 */
function renderTile(type, color, relX, relY) {
  if (type === TILE_EMPTY) {
    return;
  }
  if (type === TILE_ACTIVE) {
    color = 0xff0000;
  }

  const h = TILE_HEIGHT;
  const w = TILE_WIDTH;
  const h_2 = h / 2;

  if (
    relX - w > WIDTH ||
    relX + w < 0 ||
    relY > HEIGHT ||
    relY + h < 0
  ) {
    return;
  }

  graphics.beginFill(color);
  graphics.lineStyle(1, color, 1);
  graphics.moveTo(relX, relY);
  graphics.lineTo(relX + w, relY + h_2);
  graphics.lineTo(relX, relY + h);
  graphics.lineTo(relX - w, relY + h_2);
  graphics.lineTo(relX, relY);
  graphics.endFill();
}
