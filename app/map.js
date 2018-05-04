import * as Constants from "./constants.js";
import * as Blueprints from "./blueprints.js";
import State from "./state.js";
import server from "./server.js";
import {
  tile2abs,
  tile2rel,
  cart2rel,
  isTileOnMap,
  isBuildableTile,
  isAreaFreeForBuilding,
  sufficientResources,
  distance,
  getDirection,
  isNorth,
  isNorthEast,
  isEast,
  isSouthEast,
  isSouth,
  isSouthWest,
  isWest,
  isNorthWest,
  getActiveTile
} from "./util.js";
import { getPosition } from "./movement.js";
import { setAnimation, animate } from "./animations.js";

import openDeerWindow from "./windows/deer-window.js";

let _renderer;
const deerSprites = {};
const treeSprites = {};

const Map = new PIXI.Container();
export default Map;

/**
 * Create layers.
 */
const mapTexture = PIXI.RenderTexture.create();
const mapSprite = new PIXI.Sprite(mapTexture);

const gridTexture = PIXI.RenderTexture.create();
const gridSprite = new PIXI.Sprite(gridTexture);

const decorationLayer = new PIXI.Graphics();
const selectionLayer = new PIXI.Graphics();
const objectLayer = new PIXI.Container();
const hitAreaLayer = new PIXI.Graphics();

Map.init = function(renderer) {
  _renderer = renderer;

  Map.addChild(mapSprite);
  Map.addChild(gridSprite);
  Map.addChild(decorationLayer);
  Map.addChild(selectionLayer);
  Map.addChild(objectLayer);
  Map.addChild(hitAreaLayer);

  resizeMapHitArea();

  Map.interactive = true;
  Map.on("rightdown", onRightDown);
  Map.on("rightupoutside", onRightUp);
  Map.on("rightup", onRightUp);
  Map.on("rightclick", onRightClick);
  Map.on("mousemove", onMouseMove);

  mapSprite.interactive = true;
  mapSprite.on("mousemove", onMouseMapMove);
  mapSprite.on("mouseup", onMouseMapUp);

  State.on("SET_APPLICATION_SIZE", resizeMapHitArea);
  State.on("SET_MAP", renderTexture);
  State.on("UPDATE_MAP", ({ mapUpdates }) => updateTexture(mapUpdates));
  State.on("ADD_DEER", addDeer);
  State.on("ADD_TREE", addTree);
  State.on("MOVE", move);
  State.on("ENTER_BUILD_MODE", () => {
    objectLayer.interactiveChildren = false;
  });
  State.on("RESET_MODE", () => {
    objectLayer.interactiveChildren = true;
  });
};

// internal scrolling state
let clickStartX;
let clickStartY;
let scrolling = false;

function onRightDown(event) {
  scrolling = true;

  clickStartX = event.data.global.x;
  clickStartY = event.data.global.y;
}

function onRightUp(event) {
  scrolling = false;
}

function onRightClick(event) {
  const clickEndX = event.data.global.x;
  const clickEndY = event.data.global.y;
  const movedSignificantly =
    Math.abs(clickStartX - clickEndX) + Math.abs(clickStartY - clickEndY) >= 10;

  if (!movedSignificantly) {
    State.update({ type: "RESET_MODE" });
    return;
  }
}

function onMouseMove(event) {
  if (!scrolling) return;

  const { mouseIsoX, mouseIsoY } = State.get();

  State.update({
    type: "MOVE_CAMERA",
    dX: event.data.global.x - mouseIsoX,
    dY: event.data.global.y - mouseIsoY
  });
}

function onMouseMapMove(event) {
  const [i, j] = getActiveTile();

  if (isTileOnMap(i, j)) {
    State.update({ type: "HOVER", element: { type: "tile", i, j } });
  } else {
    State.update({ type: "HOVER", element: null });
  }
}

async function onMouseMapUp(event) {
  const [i, j] = getActiveTile();

  if (!isTileOnMap(i, j)) {
    State.update({ type: "SELECT", element: null });
    return;
  }

  const { mode } = State.get();

  if (mode === "normal") {
    State.update({ type: "SELECT", element: { type: "tile", i, j } });
  } else if (mode === "build") {
    const { blueprintName, ctrlDown } = State.get();
    const blueprint = Blueprints[blueprintName];

    if (isAreaFreeForBuilding(i, j, blueprint.height, blueprint.width)) {
      if (sufficientResources(blueprint)) {
        await server.request({ type: "PLACE_BUILDING", i, j, blueprintName });

        if (!ctrlDown) {
          State.update({ type: "RESET_MODE" });
        }
      } else {
        console.log("not enough resources");
      }
    } else {
      console.log("cannot build");
    }
  }
}

function resizeMapHitArea() {
  const { applicationHeight, applicationWidth } = State.get();
  const hitArea = new PIXI.Rectangle(0, 0, applicationWidth, applicationHeight);
  Map.hitArea = hitArea;
}

function createSprite({ hitArea, element, animation }) {
  const sprite = new PIXI.Sprite();
  sprite.hitArea = hitArea;
  sprite.interactive = true;

  sprite.on("mouseup", event => {
    State.update({ type: "SELECT", element });
  });
  sprite.on("mousemove", event => {
    State.update({ type: "HOVER", element });
  });

  setAnimation(sprite, animation);
  objectLayer.addChild(sprite);

  return sprite;
}

function addDeer({ deer }) {
  const sprite = createSprite({
    hitArea: Constants.DEER_HIT_AREA,
    animation: "STAND",
    element: { type: "deer", id: deer.id, tooltip: deer.id }
  });
  sprite.on("click", () => openDeerWindow(deer.id));

  deerSprites[deer.id] = sprite;
}

function addTree({ tree }) {
  const sprite = createSprite({
    hitArea: Constants.PALM_HIT_AREA,
    animation: "PINE_TREE",
    element: { type: "tree", id: tree.id, tooltip: tree.id }
  });

  treeSprites[tree.id] = sprite;
}

/**
 * Update the map UI elements and animate all objects.
 *
 * @param {Action} action - The state update
 */
function move({ delta }) {
  const state = State.get();
  const { timestamp, mode, mapOffsetX, offsetX, offsetY } = state;

  mapSprite.position.x = offsetX - mapOffsetX;
  mapSprite.position.y = offsetY;

  gridSprite.position.x = offsetX - mapOffsetX;
  gridSprite.position.y = offsetY;
  gridSprite.visible = state.renderGrid;

  decorations: {
    if (mode !== "build") {
      decorationLayer.visible = false;
      break decorations;
    }

    const { hoveredElement } = state;

    if (!hoveredElement || hoveredElement.type !== "tile") {
      decorationLayer.visible = false;
      break decorations;
    }

    decorationLayer.visible = true;
    decorationLayer.clear();

    const { i: mouseI, j: mouseJ } = hoveredElement;
    const { blueprintName } = state;
    const blueprint = Blueprints[blueprintName];

    for (let i = mouseI - blueprint.height + 1; i <= mouseI; i++) {
      for (let j = mouseJ - blueprint.width + 1; j <= mouseJ; j++) {
        if (!isTileOnMap(i, j)) continue;
        const tile = state.map[i][j];
        const color = isBuildableTile(tile.type) ? "0xff0000" : "0x990000";
        const [relX, relY] = tile2rel(i, j);
        renderTile(decorationLayer, color, relX, relY);
      }
    }
  }

  selection: {
    if (mode !== "normal") {
      selectionLayer.visible = false;
      break selection;
    }

    const { selectedElement } = state;

    if (!selectedElement) {
      selectionLayer.visible = false;
      break selection;
    }

    selectionLayer.visible = true;
    selectionLayer.clear();

    let relX = 0;
    let relY = 0;
    switch (selectedElement.type) {
      case "tile":
        [relX, relY] = tile2rel(selectedElement.i, selectedElement.j);
        selectionLayer.alpha = 0.25;
        renderTile(selectionLayer, "0xffffff", relX, relY);
        break;
      case "deer": {
        const deer = state.deers[selectedElement.id];
        const { x: cartX, y: cartY } = getPosition(deer.path, timestamp);
        [relX, relY] = cart2rel(cartX - 10, cartY - 10);
        selectionLayer.alpha = 0.5;
        renderCircle(selectionLayer, "0xffffff", relX, relY);
        break;
      }
      case "tree": {
        const tree = state.trees[selectedElement.id];
        [relX, relY] = tile2rel(tree.i, tree.j);
        selectionLayer.alpha = 0.5;
        renderCircle(selectionLayer, "0xffffff", relX, relY);
        break;
      }
      default:
        throw Error(`Unknown selection type: ${selection}`);
    }
  }

  objects: {
    const { renderHitAreas } = state;

    if (renderHitAreas) {
      hitAreaLayer.visible = true;
      hitAreaLayer.clear();
    } else {
      hitAreaLayer.visible = false;
    }

    for (let deer of Object.values(state.deers)) {
      const sprite = deerSprites[deer.id];
      const position = getPosition(deer.path, Date.now());

      let animation;
      if (!position.direction) animation = "STAND";
      else if (isNorth(position.direction)) animation = "GO_N";
      else if (isNorthEast(position.direction)) animation = "GO_NE";
      else if (isEast(position.direction)) animation = "GO_E";
      else if (isSouthEast(position.direction)) animation = "GO_SE";
      else if (isSouth(position.direction)) animation = "GO_S";
      else if (isSouthWest(position.direction)) animation = "GO_SW";
      else if (isWest(position.direction)) animation = "GO_W";
      else if (isNorthWest(position.direction)) animation = "GO_NW";
      else animation = "STAND";

      setAnimation(sprite, animation);
      animate(sprite, delta);

      const [relX, relY] = cart2rel(position.x, position.y);
      sprite.zIndex = relY;
      sprite.x = relX + Constants.DEER_OFFSET_X;
      sprite.y = relY + Constants.DEER_OFFSET_Y;

      if (renderHitAreas) renderHitBox(sprite);
    }

    for (let tree of Object.values(state.trees)) {
      const sprite = treeSprites[tree.id];

      animate(sprite, delta);

      const [relX, relY] = tile2rel(tree.i, tree.j);
      sprite.zIndex = relY;
      sprite.x = relX + Constants.PALM_OFFSET_X;
      sprite.y = relY + Constants.PALM_OFFSET_Y;

      if (renderHitAreas) renderHitBox(sprite);
    }

    objectLayer.children.sort((c1, c2) => c1.zIndex - c2.zIndex);
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
function renderTexture() {
  // calculate texture size
  const xDim = State.get().map.length;
  const yDim = State.get().map[0].length;
  const height = (xDim + yDim) * Constants.TILE_HEIGHT / 2.0;
  const width = (xDim + yDim) * Constants.TILE_WIDTH;
  const offsetX = width / 2.0;

  // update state
  State.update({ type: "UPDATE_MAP_SIZE", height, width });
  mapTexture.resize(width, height);
  gridTexture.resize(width, height);

  const map = new PIXI.Graphics();
  const mapGrid = new PIXI.Graphics();

  for (let i = 0; i < State.get().map.length; i++) {
    for (let j = 0; j < State.get().map[i].length; j++) {
      const tile = State.get().map[i][j];

      if (tile.type === Constants.TILE_EMPTY) {
        continue;
      }

      const [absX, absY] = tile2abs(i, j);
      renderTile(map, tile.shade, offsetX + absX, absY);
      renderTileGrid(mapGrid, offsetX + absX, absY);
    }
  }

  _renderer.render(map, mapTexture);
  _renderer.render(mapGrid, gridTexture);
}

/**
 * Update the map texture by re-drawing the changed tiles.
 *
 * @param {MapUpdate[]} updates - the updated tiles
 */
function updateTexture(updates) {
  const map = new PIXI.Graphics();
  map.fillAlpha = 0;
  const offsetX = State.get().mapOffsetX;

  for (let update of updates) {
    const { i, j, tile } = update;
    const [absX, absY] = tile2abs(i, j);
    renderTile(map, tile.shade, offsetX + absX, absY);
  }

  _renderer.clearBeforeRender = false;
  _renderer.render(map, mapTexture);
  _renderer.clearBeforeRender = true;
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
  const h_2 = Constants.TILE_HEIGHT / 2;

  target.beginFill(color);
  target.lineStyle(1, color, 1);
  target.moveTo(x, y);
  target.lineTo(x + Constants.TILE_WIDTH, y + h_2);
  target.lineTo(x, y + Constants.TILE_HEIGHT);
  target.lineTo(x - Constants.TILE_WIDTH, y + h_2);
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
  const h_2 = Constants.TILE_HEIGHT / 2;

  target.lineStyle(1, "0x444", 1);
  target.moveTo(x, y);
  target.lineTo(x + Constants.TILE_WIDTH, y + h_2);
  target.lineTo(x, y + Constants.TILE_HEIGHT);
  target.lineTo(x - Constants.TILE_WIDTH, y + h_2);
  target.lineTo(x, y);
}

function renderCircle(target, color, x, y) {
  const h_2 = Constants.TILE_HEIGHT / 2;

  target.lineStyle(1, color, 1);
  target.moveTo(x, y);
  target.lineTo(x + Constants.TILE_WIDTH, y + h_2);
  target.lineTo(x, y + Constants.TILE_HEIGHT);
  target.lineTo(x - Constants.TILE_WIDTH, y + h_2);
  target.lineTo(x, y);
}

function renderHitBox(sprite) {
  if (!sprite.hitArea) return;

  const x = sprite.x + sprite.hitArea.x;
  const y = sprite.y + sprite.hitArea.y;
  const w = sprite.hitArea.width;
  const h = sprite.hitArea.height;

  hitAreaLayer.lineStyle(1, "0xffffff", 1);
  hitAreaLayer.moveTo(x, y);
  hitAreaLayer.lineTo(x + w, y);
  hitAreaLayer.lineTo(x + w, y + h);
  hitAreaLayer.lineTo(x, y + h);
  hitAreaLayer.lineTo(x, y);
}
