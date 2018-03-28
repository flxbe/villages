/**
 * Defines the current STATE of the complete game.
 */

"use strict";

/**
 * Update the current STATE by applying an update from the server.
 *
 * @param {object} action
 */
function updateState(action) {
  console.log(`STATE: ${action.type}`);

  switch (action.type) {
    case "SET_MAP": {
      STATE.map = action.map;
      renderMapTexture();
      break;
    }
    case "UPDATE_MAP": {
      for (let update of action.mapUpdates) {
        STATE.map[update.i][update.j] = update.tile;
      }
      updateMapTexture(action.mapUpdates);
    }
    case "UPDATE_STORAGE": {
      Object.assign(STATE.storage, action.storage);
      break;
    }
    case "ADD_DEER": {
      const deer = action.deer;
      deer.sprite = new PIXI.Sprite();
      deer.sprite.hitArea = DEER_HIT_AREA;
      deer.sprite.zIndex = deer.y;
      setAnimation(deer, "STAND");
      OBJECT_CONTAINER.addChild(deer.sprite);
      STATE.deers[deer.id] = deer;
      break;
    }
    case "UPDATE_DEER": {
      Object.assign(STATE.deers[action.deer.id], action.deer);
      break;
    }
    case "REMOVE_DEER": {
      const deer = STATE.deers[action.id];
      OBJECT_CONTAINER.removeChild(deer.sprite);
      delete STATE.deers[action.id];
      break;
    }
    case "ADD_TREE": {
      const tree = action.tree;
      tree.sprite = new PIXI.Sprite();
      tree.sprite.hitArea = PALM_HIT_AREA;
      const [_, relY] = getTileCenter(tree.i, tree.j);
      tree.sprite.zIndex = relY;
      setAnimation(tree, "PINE_TREE");
      OBJECT_CONTAINER.addChild(tree.sprite);
      STATE.trees[tree.id] = tree;
      break;
    }
  }
}
