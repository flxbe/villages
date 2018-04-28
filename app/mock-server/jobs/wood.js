import State from "../../state.js";
import * as Actions from "../actions.js";

import astar from "../astar.js";

import * as util from "./util.js";

const treeTile = [7, 10];
const foodTile = [9, 13];
const storageTile = [3, 3];

export function finish(context, deer) {
  if (!util.wasWorking(deer)) return;

  switch (deer.target) {
    case "wood": {
      const inventory = Math.min(deer.inventory + 1, 20);
      context.pushUpdate(
        Actions.updateDeer({
          id: deer.id,
          item: "wood",
          inventory
        })
      );
      break;
    }
    case "storage": {
      context.pushUpdate(
        Actions.updateStorage({
          [deer.item]: State.get().storage[deer.item] + deer.inventory
        })
      );
      context.pushUpdate(
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

  if (util.isWalking(context, deer)) return;

  switch (deer.target) {
    case "wood": {
      if (util.isInventoryFull(deer)) {
        const path = astar(deerTile, storageTile);
        context.pushUpdate(
          Actions.updateDeer({
            id: deer.id,
            job: "wood",
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
        const path = astar(deerTile, treeTile);
        context.pushUpdate(
          Actions.updateDeer({
            id: deer.id,
            job: "wood",
            target: "wood",
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
        const path = astar(deerTile, storageTile);
        context.pushUpdate(
          Actions.updateDeer({
            id: deer.id,
            job: "wood",
            target: "storage",
            state: "walking",
            path
          })
        );
      } else {
        const path = astar(deerTile, treeTile);
        context.pushUpdate(
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