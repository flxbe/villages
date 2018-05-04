import * as Actions from "../actions.js";
import astar from "../astar.js";

import * as util from "./util.js";

export function finish(context, deer) {
  if (!util.wasWorking(deer)) return;

  switch (deer.target) {
    case "food": {
      const inventory = Math.min(deer.inventory + 1, 20);
      context.pushUpdate(
        Actions.updateDeer({
          id: deer.id,
          item: "food",
          inventory
        })
      );
      break;
    }
    case "storage": {
      context.pushUpdate(
        Actions.updateStorage({
          [deer.item]: context.getState().storage[deer.item] + deer.inventory
        })
      );
      context.pushUpdate(
        Actions.updateDeer({
          id: deer.id,
          job: "food",
          target: "storage",
          inventory: 0
        })
      );
      break;
    }
    default: {
      throw new Error(`invalid target for job 'food': ${deer.target}`);
    }
  }
}

export function start(context, deer) {
  const deerTile = util.getTile(context, deer);

  if (util.isWalking(context, deer)) return;

  switch (deer.target) {
    case "food": {
      if (util.isInventoryFull(deer)) {
        const path = astar(deerTile, util.getStorageTile(context));
        context.pushUpdate(
          Actions.updateDeer({
            id: deer.id,
            job: "food",
            target: "storage",
            state: "walking",
            path
          })
        );
      } else if (!util.wasWorking(deer)) {
        context.pushUpdate(
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
        const path = astar(deerTile, util.getFoodTile(context));
        context.pushUpdate(
          Actions.updateDeer({
            id: deer.id,
            job: "food",
            target: "food",
            state: "walking",
            path
          })
        );
      } else if (!util.wasWorking(deer)) {
        context.pushUpdate(
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
        const path = astar(deerTile, util.getStorageTile(context));
        context.pushUpdate(
          Actions.updateDeer({
            id: deer.id,
            job: "food",
            target: "storage",
            state: "walking",
            path
          })
        );
      } else {
        const path = astar(deerTile, util.getFoodTile(context));
        context.pushUpdate(
          Actions.updateDeer({
            id: deer.id,
            job: "food",
            target: "food",
            state: "walking",
            path
          })
        );
      }

      break;
    }
  }
}
