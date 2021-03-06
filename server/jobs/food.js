import * as Actions from "../actions.js";
import astar from "../astar.js";

import * as util from "./util.js";
import assert from "../../common/assert.js";

/**
 * During the last server tick, the deer had the job `food`. This function
 * should change the deer parameters according to the current target and
 * action during the las tick.
 *
 * 1. If the deer was not working, do nothing.
 * 2. If the deer was working on food, increase the inventory.
 * 3. If the deer was working in storage, unload the inventory and go back to
 * food.
 * 4. Everything else should not be possible.
 */
export function finish(context, deer) {
  assert(deer.job === "food");

  if (!util.wasWorking(deer)) return;

  switch (deer.target) {
    case "food": {
      assert(!deer.item || deer.item === "food");
      context.dispatch(Actions.decreaseVillagerNeeds(deer.id));
      context.dispatch(Actions.increaseVillagerSkill(deer.id, "harvesting"));
      util.incInventoryItem(context, deer, "food", 1);
      break;
    }
    case "storage": {
      context.dispatch(Actions.storeIventory(deer.id));
      break;
    }
    default: {
      throw new Error(`invalid target for job 'food': ${deer.target}`);
    }
  }
}

/**
 * The deer will have the job food during the next server tick.
 *
 * 1. If the job was food the tick before and the deer is currently walking to
 * its target, do nothing.
 * 2. If the target is food, then the deer already had the job food.
 * 2.1. If the inventory is full, the deer should go to the storage.
 * 2.2. If the deer was not working the last tick, it should start now.
 * 3. The target is storage.
 * 3.1. If the inventory is empty, the deer should change target to food.
 * 3.2. If it was not working the last tick, it should start now.
 * 4. Another target. This means, the deer has another job the last tick.
 * 4.1. If the inventory is full, go to the storage.
 * 4.2. If not, go to the food.
 */
export function start(context, deer) {
  if (deer.job !== "food") {
    util.startJob(context, deer, "food");
  } else if (util.isWalking(context, deer)) {
    return;
  }

  switch (deer.target) {
    case "food": {
      if (util.isInventoryFull(deer)) {
        util.goToStorage(context, deer);
      } else if (!util.wasWorking(deer)) {
        util.startWorking(context, deer);
      }
      break;
    }
    case "storage": {
      if (util.isInventoryEmpty(deer)) {
        util.goToFood(context, deer);
      } else if (!util.wasWorking(deer)) {
        util.startWorking(context, deer);
      }
      break;
    }
    default: {
      if (util.isInventoryFull(deer)) {
        util.goToStorage(context, deer);
      } else {
        util.goToFood(context, deer);
      }
      break;
    }
  }
}
