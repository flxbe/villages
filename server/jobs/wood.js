import * as Actions from "../actions.js";
import astar from "../astar.js";

import * as util from "./util.js";
import assert from "../../common/assert.js";

export function finish(context, deer) {
  assert(deer.job === "wood");

  if (!util.wasWorking(deer)) return;

  switch (deer.target) {
    case "wood": {
      const inventory = Math.min(deer.inventory + 1, 20);
      context.dispatch(
        Actions.updateDeer({
          id: deer.id,
          item: "wood",
          inventory
        })
      );
      break;
    }
    case "storage": {
      context.dispatch(
        Actions.updateStorage({
          [deer.item]: context.getState().storage[deer.item] + deer.inventory
        })
      );
      context.dispatch(
        Actions.updateDeer({
          id: deer.id,
          job: "wood",
          target: "storage",
          inventory: 0
        })
      );
      break;
    }
    default: {
      throw new Error(`invalid target for job 'wood': ${deer.target}`);
    }
  }
}

export function start(context, deer) {
  const deerTile = util.getTile(context, deer);
  const state = context.getState();

  if (deer.job === "wood" && util.isWalking(context, deer)) return;

  switch (deer.target) {
    case "wood": {
      if (util.isInventoryFull(deer)) {
        const path = astar(state.map, deerTile, util.getStorageTile(context));
        context.dispatch(
          Actions.updateDeer({
            id: deer.id,
            job: "wood",
            target: "storage",
            state: "walking",
            path
          })
        );
      } else if (!util.wasWorking(deer)) {
        context.dispatch(
          Actions.updateDeer({
            id: deer.id,
            state: "working"
          })
        );
      }
      break;
    }
    case "storage": {
      if (util.isInventoryEmpty(deer)) {
        const path = astar(state.map, deerTile, util.getTreeTile(context));
        context.dispatch(
          Actions.updateDeer({
            id: deer.id,
            job: "wood",
            target: "wood",
            state: "walking",
            path
          })
        );
      } else if (!util.wasWorking(deer)) {
        context.dispatch(
          Actions.updateDeer({
            id: deer.id,
            state: "working"
          })
        );
      }
      break;
    }
    default: {
      if (util.isInventoryFull(deer)) {
        const path = astar(state.map, deerTile, util.getStorageTile(context));
        context.dispatch(
          Actions.updateDeer({
            id: deer.id,
            job: "wood",
            target: "storage",
            state: "walking",
            path
          })
        );
      } else {
        const path = astar(state.map, deerTile, util.getTreeTile(context));
        context.dispatch(
          Actions.updateDeer({
            id: deer.id,
            job: "wood",
            target: "wood",
            state: "walking",
            path
          })
        );
      }

      break;
    }
  }
}
