import * as Actions from "../actions.js";
import astar from "../astar.js";

import * as util from "./util.js";
import assert from "../../common/assert.js";

export function finish(context, deer) {
  assert(deer.job === "wood");

  if (!util.wasWorking(deer)) return;

  switch (deer.target) {
    case "wood": {
      context.dispatch(Actions.increaseVillagerSkill(deer.id, "woodCutting"));
      util.incInventoryItem(context, deer, "wood", 1);
      break;
    }
    case "barn": {
      context.dispatch(Actions.storeIventory(deer.id));
      break;
    }
    default: {
      throw new Error(`invalid target for job 'wood': ${deer.target}`);
    }
  }
}

export function start(context, deer) {
  if (deer.job !== "wood") {
    util.startJob(context, deer, "wood");
  } else if (util.isWalking(context, deer)) {
    return;
  }

  switch (deer.target) {
    case "wood": {
      if (util.isInventoryFull(deer)) {
        util.goToBuilding(context, deer, "barn");
      } else if (!util.wasWorking(deer)) {
        util.startWorking(context, deer);
      }
      break;
    }
    case "barn": {
      if (util.isInventoryEmpty(deer)) {
        util.goToTree(context, deer);
      } else if (!util.wasWorking(deer)) {
        util.startWorking(context, deer);
      }
      break;
    }
    default: {
      if (util.isInventoryFull(deer)) {
        util.goToBuilding(context, deer, "barn");
      } else {
        util.goToTree(context, deer);
      }
      break;
    }
  }
}
