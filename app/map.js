import * as Constants from "./constants.js";
import * as Blueprints from "../common/blueprints.js";
import context from "./context.js";
import server from "./server.js";
import { setAnimation, animate } from "./animations.js";

import {
  getMovement,
  canBuildingBePlaced,
  sufficientResources,
  isBuildableTile,
  distance,
  getDirection,
  isNorth,
  isNorthEast,
  isEast,
  isSouthEast,
  isSouth,
  isSouthWest,
  isWest,
  isNorthWest
} from "../common/util.js";

import Point from "../common/point.js";

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

  context.on("SET_APPLICATION_SIZE", resizeMapHitArea);
  context.on("SET_MAP", renderTexture);
  context.on("UPDATE_MAP", ({ mapUpdates }) => updateTexture(mapUpdates));
  context.on("ADD_DEER", addDeer);
  context.on("ADD_TREE", addTree);
  context.on("MOVE", move);
  context.on("ENTER_BUILD_MODE", () => {
    objectLayer.interactiveChildren = false;
  });
  context.on("RESET_MODE", () => {
    objectLayer.interactiveChildren = true;
  });
};

// internal scrolling context
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
    context.dispatch({ type: "RESET_MODE" });
    return;
  }
}

function onMouseMove(event) {
  if (!scrolling) return;

  const { mouseIsoX, mouseIsoY } = context.getState();

  context.dispatch({
    type: "MOVE_CAMERA",
    dX: event.data.global.x - mouseIsoX,
    dY: event.data.global.y - mouseIsoY
  });
}

function onMouseMapMove(event) {
  const tile = getHoveredTile();

  if (tile.isOnMap(context)) {
    const { i, j } = tile;
    context.dispatch({ type: "HOVER", element: { type: "tile", i, j } });
  } else {
    context.dispatch({ type: "HOVER", element: null });
  }
}

async function onMouseMapUp(event) {
  const tile = getHoveredTile();

  if (!tile.isOnMap(context)) {
    context.dispatch({ type: "SELECT", element: null });
    return;
  }

  const { i, j } = tile;
  const { mode } = context.getState();

  if (mode === "normal") {
    context.dispatch({ type: "SELECT", element: { type: "tile", i, j } });
  } else if (mode === "build") {
    const { blueprintName, ctrlDown } = context.getState();
    const blueprint = Blueprints[blueprintName];

    if (canBuildingBePlaced(context, blueprint, Point.fromTile(i, j))) {
      if (sufficientResources(context, blueprint)) {
        await server.request({ type: "PLACE_BUILDING", i, j, blueprintName });

        if (!ctrlDown) {
          context.dispatch({ type: "RESET_MODE" });
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
  const { applicationHeight, applicationWidth } = context.getState();
  const hitArea = new PIXI.Rectangle(0, 0, applicationWidth, applicationHeight);
  Map.hitArea = hitArea;
}

function createSprite({ hitArea, element, animation }) {
  const sprite = new PIXI.Sprite();
  sprite.hitArea = hitArea;
  sprite.interactive = true;

  sprite.on("mouseup", event => {
    context.dispatch({ type: "SELECT", element });
  });
  sprite.on("mousemove", event => {
    context.dispatch({ type: "HOVER", element });
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
 * @param {Action} action - The context update
 */
function move({ delta }) {
  const state = context.getState();
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
        const p = Point.fromTile(i, j);
        if (!p.isOnMap(context)) continue;
        const tile = state.map[i][j];
        const color = isBuildableTile(tile.type) ? "0xff0000" : "0x990000";
        const { x, y } = Point.fromTile(i, j).toRel(context);
        renderTile(decorationLayer, color, x, y);
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
      case "tile": {
        const { i, j } = selectedElement;
        const { x, y } = Point.fromTile(i, j).toRel(context);
        selectionLayer.alpha = 0.25;
        renderTile(selectionLayer, "0xffffff", x, y);
        break;
      }
      case "deer": {
        const deer = state.deers[selectedElement.id];
        const { position } = getMovement(deer.path, timestamp);
        position.sub(10).toRel(context);
        selectionLayer.alpha = 0.5;
        renderCircle(selectionLayer, "0xffffff", position.x, position.y);
        break;
      }
      case "tree": {
        const tree = state.trees[selectedElement.id];
        const { i, j } = tree;
        const { x, y } = Point.fromTile(i, j).toRel(context);
        selectionLayer.alpha = 0.5;
        renderCircle(selectionLayer, "0xffffff", x, y);
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
      const { position, direction } = getMovement(deer.path, timestamp);

      let animation;
      if (!direction) animation = "STAND";
      else if (isNorth(direction)) animation = "GO_N";
      else if (isNorthEast(direction)) animation = "GO_NE";
      else if (isEast(direction)) animation = "GO_E";
      else if (isSouthEast(direction)) animation = "GO_SE";
      else if (isSouth(direction)) animation = "GO_S";
      else if (isSouthWest(direction)) animation = "GO_SW";
      else if (isWest(direction)) animation = "GO_W";
      else if (isNorthWest(direction)) animation = "GO_NW";
      else animation = "STAND";

      setAnimation(sprite, animation);
      animate(sprite, delta);

      position.toRel(context);
      sprite.zIndex = position.y;
      sprite.x = position.x + Constants.DEER_OFFSET_X;
      sprite.y = position.y + Constants.DEER_OFFSET_Y;

      if (renderHitAreas) renderHitBox(sprite);
    }

    for (let tree of Object.values(state.trees)) {
      const sprite = treeSprites[tree.id];

      animate(sprite, delta);

      const { i, j } = tree;
      const { x, y } = Point.fromTile(i, j).toRel(context);
      sprite.zIndex = y;
      sprite.x = x + Constants.PALM_OFFSET_X;
      sprite.y = y + Constants.PALM_OFFSET_Y;

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
  const xDim = context.getState().map.length;
  const yDim = context.getState().map[0].length;
  const height = (xDim + yDim) * Constants.TILE_HEIGHT / 2.0;
  const width = (xDim + yDim) * Constants.TILE_WIDTH;
  const offsetX = width / 2.0;

  // update context
  context.dispatch({ type: "UPDATE_MAP_SIZE", height, width });
  mapTexture.resize(width, height);
  gridTexture.resize(width, height);

  const map = new PIXI.Graphics();
  const mapGrid = new PIXI.Graphics();

  for (let i = 0; i < context.getState().map.length; i++) {
    for (let j = 0; j < context.getState().map[i].length; j++) {
      const tile = context.getState().map[i][j];

      if (tile.type === Constants.TILE_EMPTY) {
        continue;
      }

      const [absX, absY] = Point.fromTile(i, j)
        .toAbs()
        .toArray();
      renderTile(map, getTileColor(tile.type), offsetX + absX, absY);
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
  const offsetX = context.getState().mapOffsetX;

  for (let update of updates) {
    const { i, j, tile } = update;
    const [absX, absY] = Point.fromTile(i, j)
      .toAbs()
      .toArray();
    renderTile(map, getTileColor(tile.type), offsetX + absX, absY);
  }

  _renderer.clearBeforeRender = false;
  _renderer.render(map, mapTexture);
  _renderer.clearBeforeRender = true;
}

function getTileColor(type) {
  switch (type) {
    case Constants.TILE_WATER:
      return "0x000550";
    case Constants.TILE_DIRT:
      return "0x561f00";
    case Constants.TILE_GRASS:
      return "0x005111";
    case Constants.TILE_TREE:
      return "0x269a41";
    case Constants.TILE_ROAD:
      return "0x999999";
    case Constants.TILE_BUILDING:
      return "0x000000";
    default:
      throw new Error(`unknown tile type: ${type}`);
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

function getHoveredTile() {
  const { mouseIsoX, mouseIsoY } = context.getState();
  return Point.fromRel(mouseIsoX, mouseIsoY).toTile(context);
}
