import State from "./state.js";
import {
  tile2abs,
  tile2rel,
  cart2rel,
  isTileOnMap,
  isBuildableTile
} from "./util.js";

/**
 * cart coordinates: virtual map
 * iso coordinates:
 *   - rel: screen
 *   - abs: canvas
 */

/**
 * Render the complete map by iterating over the two dimensional tile array.
 * Render the map overlays like the mouse position or blueprints.
 *
 * TODO: only re-render, when something has changed.
 */
export function renderMapDecoration() {
  MAP_DECORATION_LAYER.clear();

  // only decorate in build mode
  if (UI_STATE.mode !== "build") return;

  // only decorate hovered tiles
  const { hoveredElement } = UI_STATE;
  if (!hoveredElement || hoveredElement.type !== "tile") return;

  const { i: mouseI, j: mouseJ } = hoveredElement;
  const blueprint = BLUEPRINTS[UI_STATE.blueprintName];

  for (let i = mouseI - blueprint.height + 1; i <= mouseI; i++) {
    for (let j = mouseJ - blueprint.width + 1; j <= mouseJ; j++) {
      if (!isTileOnMap(i, j)) continue;
      const tile = State.get().map[i][j];
      const color = isBuildableTile(tile.type) ? "0xff0000" : "0x990000";
      const [relX, relY] = tile2rel(i, j);
      renderTile(MAP_DECORATION_LAYER, color, relX, relY);
    }
  }
}

/**
 * Render the object or tile selection on the map.
 */
export function renderSelectionDecoration() {
  SELECTION_LAYER.clear();

  if (!UI_STATE.selection) return;

  let relX = 0;
  let relY = 0;
  switch (UI_STATE.selection.type) {
    case "tile":
      [relX, relY] = tile2rel(UI_STATE.selection.i, UI_STATE.selection.j);
      SELECTION_LAYER.alpha = 0.25;
      renderTile(SELECTION_LAYER, "0xffffff", relX, relY);
      return;
    case "deer":
      [relX, relY] = cart2rel(
        State.get().deers[UI_STATE.selection.id].x - 10,
        State.get().deers[UI_STATE.selection.id].y - 10
      );
      break;
    case "tree":
      [relX, relY] = tile2rel(
        State.get().trees[UI_STATE.selection.id].i,
        State.get().trees[UI_STATE.selection.id].j
      );
      break;
    default:
      throw Error("Unknown selection type");
  }

  SELECTION_LAYER.alpha = 0.5;
  renderCircle(SELECTION_LAYER, "0xffffff", relX, relY);
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
export function renderMapTexture() {
  // calculate texture size
  const xDim = State.get().map.length;
  const yDim = State.get().map[0].length;
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

  for (let i = 0; i < State.get().map.length; i++) {
    for (let j = 0; j < State.get().map[i].length; j++) {
      const tile = State.get().map[i][j];

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
export function updateMapTexture(updates) {
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

  target.beginFill(color);
  target.lineStyle(1, color, 1);
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

function renderCircle(target, color, x, y) {
  const h_2 = TILE_HEIGHT / 2;

  target.lineStyle(1, color, 1);
  target.moveTo(x, y);
  target.lineTo(x + TILE_WIDTH, y + h_2);
  target.lineTo(x, y + TILE_HEIGHT);
  target.lineTo(x - TILE_WIDTH, y + h_2);
  target.lineTo(x, y);
}
