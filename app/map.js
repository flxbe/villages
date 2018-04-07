import State from "./state.js";
import UiState from "./ui-state.js";
import {
  tile2abs,
  tile2rel,
  cart2rel,
  isTileOnMap,
  isBuildableTile,
  isAreaFreeForBuilding,
  sufficientResources
} from "./util.js";
import { serverRequest } from "./mock-server/server.js";
import {
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
import { setObjectSound } from "./sound.js";

export default (Map = new PIXI.Container());

const renderer = PIXI.autoDetectRenderer();
const deerSprites = {};
const treeSprites = {};

// internal sscrolling state
let clickStartX;
let clickStartY;
let scrolling = false;

/**
 * Initialize the Map by creating the map layers and by registering the input
 * events.
 *
 * TODO: input
 */
Map.init = function () {
  Map.texture = PIXI.RenderTexture.create();
  Map.sprite = new PIXI.Sprite(Map.texture);
  Map.sprite.interactive = true;
  Map.addChild(Map.sprite);

  Map.gridTexture = PIXI.RenderTexture.create();
  Map.gridSprite = new PIXI.Sprite(Map.gridTexture);
  Map.addChild(Map.gridSprite);

  Map.decorations = new PIXI.Graphics();
  Map.addChild(Map.decorations);

  Map.selection = new PIXI.Graphics();
  Map.addChild(Map.selection);

  Map.objects = new PIXI.Container();
  Map.addChild(Map.objects);

  Map.hitAreas = new PIXI.Graphics();
  Map.addChild(Map.hitAreas);

  Map.sprite.on("rightdown", event => {
    scrolling = true;

    clickStartX = event.data.global.x;
    clickStartY = event.data.global.y;
  });

  Map.sprite.on("rightupoutside", event => {
    scrolling = false;
  });

  Map.sprite.on("rightup", event => {
    scrolling = false;
  });

  Map.sprite.on("rightclick", event => {
    const clickEndX = event.data.global.x;
    const clickEndY = event.data.global.y;
    const movedSignificantly =
      Math.abs(clickStartX - clickEndX) + Math.abs(clickStartY - clickEndY) >=
      10;

    if (!movedSignificantly) {
      UiState.reset();
      event.stopPropagation();
      return;
    }
  });

  // update hovered tile
  Map.sprite.on("mousemove", event => {
    if (scrolling) {
      UiState.offsetX += event.data.global.x - UiState.mouseIsoX;
      UiState.offsetY += event.data.global.y - UiState.mouseIsoY;
      event.stopPropagation();
      return;
    }

    const [i, j] = getActiveTile();

    if (isTileOnMap(i, j)) {
      UiState.hoveredElement = { type: "tile", i, j };
      event.stopPropagation();
    }
  });

  // handle tile click
  Map.sprite.on("mouseup", event => {
    const [i, j] = getActiveTile();

    if (!isTileOnMap(i, j)) {
      UiState.selection = null;
      return;
    }

    // select tile in normal mode
    if (UiState.mode === "normal") {
      UiState.selection = { type: "tile", i, j };
      event.stopPropagation();
      return;
    }

    // try to place a building in build mode
    if (UiState.mode === "build") {
      const { blueprintName } = UiState;
      const blueprint = BLUEPRINTS[blueprintName];

      if (isAreaFreeForBuilding(i, j, blueprint.height, blueprint.width)) {
        if (sufficientResources(blueprint)) {
          serverRequest({ type: "PLACE_BUILDING", i, j, blueprintName });

          if (!UiState.ctrlDown) {
            UiState.mode = "normal";
          }
        } else {
          console.log("not enough resources");
        }
      } else {
        console.log("cannot build");
      }

      UiState.selection = null;
      event.stopPropagation();
      return;
    }
  });
};

Map.addDeer = function (deer) {
  const sprite = new PIXI.Sprite();
  sprite.hitArea = DEER_HIT_AREA;
  sprite.interactive = true;

  sprite.on("mouseup", event => {
    UiState.selection = { type: "deer", id: deer.id };
    event.stopPropagation();
  });
  sprite.on("mousemove", event => {
    UiState.hoveredElement = { type: "deer", id: deer.id };
    event.stopPropagation();
  });

  setAnimation(sprite, "STAND");
  Map.objects.addChild(sprite);
  deerSprites[deer.id] = sprite;
};

Map.addTree = function (tree) {
  const sprite = new PIXI.Sprite();
  sprite.hitArea = PALM_HIT_AREA;
  sprite.interactive = true;

  sprite.on("mouseup", event => {
    UiState.selection = { type: "tree", id: tree.id };
    event.stopPropagation();
  });
  sprite.on("mousemove", event => {
    UiState.hoveredElement = { type: "tree", id: tree.id };
    event.stopPropagation();
  });

  setAnimation(sprite, "PINE_TREE");
  Map.objects.addChild(sprite);
  treeSprites[tree.id] = sprite;
};

/**
 * Render the next map frame.
 */
Map.render = function (delta) {
  const timestamp = Date.now();

  const { mode, mapOffsetX, offsetX, offsetY, grid } = UiState;

  Map.sprite.position.x = offsetX - mapOffsetX;
  Map.sprite.position.y = offsetY;

  Map.gridSprite.position.x = offsetX - mapOffsetX;
  Map.gridSprite.position.y = offsetY;
  Map.gridSprite.visible = grid;

  decorations: {
    if (mode !== "build") {
      Map.decorations.visible = false;
      break decorations;
    }

    const { hoveredElement } = UiState;

    if (!hoveredElement || hoveredElement.type !== "tile") {
      Map.decorations.visible = false;
      break decorations;
    }

    Map.decorations.visible = true;
    Map.decorations.clear();

    const { i: mouseI, j: mouseJ } = hoveredElement;
    const { blueprintName } = UiState;
    const blueprint = BLUEPRINTS[blueprintName];

    for (let i = mouseI - blueprint.height + 1; i <= mouseI; i++) {
      for (let j = mouseJ - blueprint.width + 1; j <= mouseJ; j++) {
        if (!isTileOnMap(i, j)) continue;
        const tile = State.get().map[i][j];
        const color = isBuildableTile(tile.type) ? "0xff0000" : "0x990000";
        const [relX, relY] = tile2rel(i, j);
        renderTile(Map.decorations, color, relX, relY);
      }
    }
  }

  selection: {
    if (mode !== "normal") {
      Map.selection.visible = false;
      break selection;
    }

    const { selection } = UiState;

    if (!selection) {
      Map.selection.visible = false;
      break selection;
    }

    Map.selection.visible = true;
    Map.selection.clear();

    let relX = 0;
    let relY = 0;
    switch (selection.type) {
      case "tile":
        [relX, relY] = tile2rel(selection.i, selection.j);
        Map.selection.alpha = 0.25;
        renderTile(Map.selection, "0xffffff", relX, relY);
        break;
      case "deer": {
        const deer = State.get().deers[selection.id];
        const { x: cartX, y: cartY } = getPosition(deer.path, timestamp);
        [relX, relY] = cart2rel(cartX - 10, cartY - 10);
        Map.selection.alpha = 0.5;
        renderCircle(Map.selection, "0xffffff", relX, relY);
        break;
      }
      case "tree":
        [relX, relY] = tile2rel(
          State.get().trees[selection.id].i,
          State.get().trees[selection.id].j
        );
        Map.selection.alpha = 0.5;
        renderCircle(Map.selection, "0xffffff", relX, relY);
        break;
      default:
        throw Error(`Unknown selection type: ${selection}`);
    }
  }

  objects: {
    const { renderHitAreas } = UiState;

    if (renderHitAreas) {
      Map.hitAreas.visible = true;
      Map.hitAreas.clear();
    } else {
      Map.hitAreas.visible = false;
    }

    for (let deer of Object.values(State.get().deers)) {
      const sprite = deerSprites[deer.id];
      const position = getPosition(deer.path, Date.now());

      let action;
      if (!position.direction) action = "STAND";
      else if (isNorth(position.direction)) action = "GO_N";
      else if (isNorthEast(position.direction)) action = "GO_NE";
      else if (isEast(position.direction)) action = "GO_E";
      else if (isSouthEast(position.direction)) action = "GO_SE";
      else if (isSouth(position.direction)) action = "GO_S";
      else if (isSouthWest(position.direction)) action = "GO_SW";
      else if (isWest(position.direction)) action = "GO_W";
      else if (isNorthWest(position.direction)) action = "GO_NW";
      else action = "STAND";

      setObjectSound(deer.id, action);
      setAnimation(sprite, action);
      animate(sprite, delta);

      const [relX, relY] = cart2rel(position.x, position.y);
      sprite.zIndex = relY;
      sprite.x = relX + DEER_OFFSET_X;
      sprite.y = relY + DEER_OFFSET_Y;

      if (renderHitAreas) renderHitBox(sprite);
    }

    for (let tree of Object.values(State.get().trees)) {
      const sprite = treeSprites[tree.id];

      animate(sprite, delta);

      const [relX, relY] = tile2rel(tree.i, tree.j);
      sprite.zIndex = relY;
      sprite.x = relX + PALM_OFFSET_X;
      sprite.y = relY + PALM_OFFSET_Y;

      if (renderHitAreas) renderHitBox(sprite);
    }

    Map.objects.children.sort((c1, c2) => c1.zIndex - c2.zIndex);
  }
};

/**
 * Render the map and the map grid to a texture.
 *
 * This should only be executed, when a complete new map is loaded!
 *
 * The map's origin is in the top center of the texture. One must therefore
 * add the half of the width as an offset. The same offset must be substracted
 * when rendering the map.
 */
Map.renderTexture = function () {
  // calculate texture size
  const xDim = State.get().map.length;
  const yDim = State.get().map[0].length;
  const height = (xDim + yDim) * TILE_HEIGHT / 2.0;
  const width = (xDim + yDim) * TILE_WIDTH;
  const offsetX = width / 2.0;

  // update state
  const uiState = UiState;
  uiState.mapHeight = height;
  uiState.mapWidth = width;
  uiState.mapOffsetX = width / 2.0;
  Map.texture.resize(width, height);
  Map.gridTexture.resize(width, height);

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

  APPLICATION.renderer.render(map, Map.texture);
  APPLICATION.renderer.render(mapGrid, Map.gridTexture);
};

/**
 * Update the map texture by re-drawing the changed tiles.
 *
 * @param {MapUpdate[]} updates - the updated tiles
 */
Map.updateTexture = function (updates) {
  const map = new PIXI.Graphics();
  map.fillAlpha = 0;
  const offsetX = UiState.mapOffsetX;

  for (let update of updates) {
    const { i, j, tile } = update;
    const [absX, absY] = tile2abs(i, j);
    renderTile(map, tile.shade, offsetX + absX, absY);
  }

  APPLICATION.renderer.clearBeforeRender = false;
  APPLICATION.renderer.render(map, Map.texture);
  APPLICATION.renderer.clearBeforeRender = true;
};

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

function renderHitBox(sprite) {
  if (!sprite.hitArea) return;

  const x = sprite.x + sprite.hitArea.x;
  const y = sprite.y + sprite.hitArea.y;
  const w = sprite.hitArea.width;
  const h = sprite.hitArea.height;

  Map.hitAreas.lineStyle(1, "0xffffff", 1);
  Map.hitAreas.moveTo(x, y);
  Map.hitAreas.lineTo(x + w, y);
  Map.hitAreas.lineTo(x + w, y + h);
  Map.hitAreas.lineTo(x, y + h);
  Map.hitAreas.lineTo(x, y);
}
