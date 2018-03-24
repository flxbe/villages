"use strict";

/**
 * cart coordinates: virtual map
 * iso coordinates:
 *   - rel: screen
 *   - abs: canvas
 */

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
  const [absX, absY] = tile2abs(i, j);
  return abs2rel(absX, absY);
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
 * Convert tile indices to relative coordinates.
 * @param {number} i
 * @param {number} j
 */
function tile2abs(i, j) {
  const [cartX, cartY] = tile2cart(i, j);
  return cart2abs(cartX, cartY);
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
 *
 * TODO: check for blueprint and extract blueprint before.
 *
 * @param {number} i
 * @param {number} j
 */
function isInBlueprint(i, j) {
  if (!UI_STATE.blueprint) return false;

  const blueprint = BLUEPRINTS[UI_STATE.blueprint];
  const [iMouse, jMouse] = getActiveTile();

  return (
    i <= iMouse &&
    i >= iMouse - blueprint.height + 1 &&
    j <= jMouse &&
    j >= jMouse - blueprint.width + 1
  );
}

/**
 * Check, whether a building with the specified width and height can
 * be placed at position i, j.
 * @param {number} i
 * @param {number} j
 * @param {number} height
 * @param {number} width
 */
function isAreaFreeForBuilding(i, j, height, width) {
  for (let k = i; k > i - height; k--) {
    for (let l = j; l > j - width; l--) {
      if (!isTileOnMap(k, l) || !STATE.map[k][l].buildable) return false;
    }
  }
  return true;
}

function renderMapDecoration() {
  MAP_DECORATION_LAYER.clear();

  const [mouseI, mouseJ] = getActiveTile();

  if (UI_STATE.mode === "build") {
    const blueprint = BLUEPRINTS[UI_STATE.blueprint];
    for (let i = mouseI - blueprint.height + 1; i <= mouseI; i++) {
      for (let j = mouseJ - blueprint.width + 1; j <= mouseJ; j++) {
        if (!isTileOnMap(i, j)) continue;
        const tile = STATE.map[i][j];
        const color = tile.buildable ? "0xff0000" : "0x990000";
        const [relX, relY] = tile2rel(i, j);
        renderTile(MAP_DECORATION_LAYER, color, relX, relY);
      }
    }
  } else {
    const color = "0xff0000";
    const [absX, absY] = tile2rel(mouseI, mouseJ);
    renderTile(MAP_DECORATION_LAYER, color, absX, absY);
  }
}

/**
 * Render the complete map by iterating over the two dimensional tile array.
 *
 * TODO: Specialized render functions for normal and build mode. This should
 * avoid the string comparison for every tile.
 */
function renderMap() {
  MAP_GRAPHICS_LAYER.position.x = UI_STATE.offsetX;
  MAP_GRAPHICS_LAYER.position.y = UI_STATE.offsetY;

  if (!UI_STATE.updateMap) return;
  UI_STATE.updateMap = false;

  for (let i = 0; i < STATE.map.length; i++) {
    for (let j = 0; j < STATE.map[i].length; j++) {
      const tile = STATE.map[i][j];

      if (tile.type === TILE_EMPTY) {
        continue;
      }

      const [absX, absY] = tile2abs(i, j);
      renderTile(MAP_GRAPHICS_LAYER, tile.shade, absX, absY);
    }
  }
}

/**
 * Render a tile of type `type` at the specified relative coordinates.
 * The coordinates describe the upper corner of the isometric tile.
 * @param {PIXI.Graphics} target
 * @param {string} color - hexadecimal color, e.g. "0xff0000"
 * @param {number} x
 * @param {number} y
 */
function renderTile(target, color, x, y) {
  const h_2 = TILE_HEIGHT / 2;

  //if (relX - w > WIDTH || relX + w < 0 || relY > HEIGHT || relY + h < 0) {
  //  return;
  //}

  const lineColor = UI_STATE.grid ? "0x444" : color;

  target.beginFill(color);
  target.lineStyle(1, lineColor, 1);
  target.moveTo(x, y);
  target.lineTo(x + TILE_WIDTH, y + h_2);
  target.lineTo(x, y + TILE_HEIGHT);
  target.lineTo(x - TILE_WIDTH, y + h_2);
  target.lineTo(x, y);
  target.endFill();
}
