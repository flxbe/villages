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
      if (!isTileOnMap(k, l) || !isBuildableTile(STATE.map[k][l].type)) return false;
    }
  }
  return true;
}

/**
 * Determine if a tile is walkable by its type.
 * @param {string} type
 */
function isWalkableTile(type) {
  switch (type) {
    case TILE_GRASS: return true;
    case TILE_DIRT: return true;
    case TILE_WATER: return false;
    case TILE_DEEPWATER: return false;
    case TILE_TREE: return false;
    case TILE_BUILDING: return false;
    case TILE_ROAD: return true;
    default: throw Error(`unknown tile type: ${type}`);
  }
}

/**
 * Determine if a tile is buildable by its type.
 * @param {string} type
 */
function isBuildableTile(type) {
  switch (type) {
    case TILE_GRASS: return true;
    case TILE_DIRT: return true;
    case TILE_WATER: return false;
    case TILE_DEEPWATER: return false;
    case TILE_TREE: return false;
    case TILE_BUILDING: return false;
    case TILE_ROAD: return false;
    default: throw Error(`unknown tile type: ${type}`);
  }
}

/**
 * Determine if a tile is acceptable for street building by its type.
 * @param {string} type
 */
function isRoadableTile(type) {
  switch (type) {
    case TILE_GRASS: return true;
    case TILE_DIRT: return true;
    case TILE_WATER: return true;
    case TILE_DEEPWATER: return false;
    case TILE_TREE: return false;
    case TILE_BUILDING: return false;
    case TILE_ROAD: return false;
    default: throw Error(`unknown tile type: ${type}`);
  }
}

/**
 * Render the complete map by iterating over the two dimensional tile array.
 * Render the map overlays like the mouse position or blueprints.
 *
 * TODO: only re-render, when something has changed.
 */
function renderMapDecoration() {
  MAP_DECORATION_LAYER.clear();

  const [mouseI, mouseJ] = getActiveTile();

  if (UI_STATE.mode === "build") {
    const blueprint = BLUEPRINTS[UI_STATE.blueprint];
    for (let i = mouseI - blueprint.height + 1; i <= mouseI; i++) {
      for (let j = mouseJ - blueprint.width + 1; j <= mouseJ; j++) {
        if (!isTileOnMap(i, j)) continue;
        const tile = STATE.map[i][j];
        const color = isBuildableTile(tile.type) ? "0xff0000" : "0x990000";
        const [relX, relY] = tile2rel(i, j);
        renderTile(MAP_DECORATION_LAYER, color, relX, relY);
      }
    }
  } else {
    const [relX, relY] = tile2rel(mouseI, mouseJ);
    renderTile(MAP_DECORATION_LAYER, "0xff0000", relX, relY);
  }
}

/**
 * Render the map and the map grid to a texture.
 *
 * This should only be executed, when a complete new map is loaded!
 *
 * The map's origin is in the top center of the texture. One must therefore
 * add the half of the width as an offset. The same offset must be substracted
 * when rendering the map.
 */
function renderMapTexture() {
  // calculate texture size
  const xDim = STATE.map.length;
  const yDim = STATE.map[0].length;
  const height = (xDim + yDim) * TILE_HEIGHT / 2.0;
  const width = (xDim + yDim) * TILE_WIDTH;
  const offsetX = width / 2.0;

  // update state
  UI_STATE.mapHeight = height;
  UI_STATE.mapWidth = width;
  UI_STATE.mapOffsetX = width / 2.0;
  MAP_TEXTURE.resize(width, height);
  MAP_GRID_TEXTURE.resize(width, height);

  const map = new PIXI.Graphics();
  const mapGrid = new PIXI.Graphics();

  for (let i = 0; i < STATE.map.length; i++) {
    for (let j = 0; j < STATE.map[i].length; j++) {
      const tile = STATE.map[i][j];

      if (tile.type === TILE_EMPTY) {
        continue;
      }

      const [absX, absY] = tile2abs(i, j);
      renderTile(map, tile.shade, offsetX + absX, absY);
      renderTileGrid(mapGrid, offsetX + absX, absY);
    }
  }

  APPLICATION.renderer.render(map, MAP_TEXTURE);
  APPLICATION.renderer.render(mapGrid, MAP_GRID_TEXTURE);
}

/**
 * Update the map texture by re-drawing the changed tiles.
 *
 * @param {MapUpdate[]} updates - the updated tiles
 */
function updateMapTexture(updates) {
  const map = new PIXI.Graphics();
  map.fillAlpha = 0;
  const offsetX = UI_STATE.mapOffsetX;

  for (let update of updates) {
    const { i, j, tile } = update;
    const [absX, absY] = tile2abs(i, j);
    renderTile(map, tile.shade, offsetX + absX, absY);
  }

  APPLICATION.renderer.clearBeforeRender = false;
  APPLICATION.renderer.render(map, MAP_TEXTURE);
  APPLICATION.renderer.clearBeforeRender = true;
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

/**
 * Render the gridlines of a tile.
 * @param {PIXI.Graphics} target
 * @param {number} x
 * @param {number} y
 */
function renderTileGrid(target, x, y) {
  const h_2 = TILE_HEIGHT / 2;

  target.lineStyle(1, "0x444", 1);
  target.moveTo(x, y);
  target.lineTo(x + TILE_WIDTH, y + h_2);
  target.lineTo(x, y + TILE_HEIGHT);
  target.lineTo(x - TILE_WIDTH, y + h_2);
  target.lineTo(x, y);
}
