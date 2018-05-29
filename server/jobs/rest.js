import * as Actions from "../actions.js";

import * as util from "./util.js";
import assert from "../../common/assert.js";

function wasResting(deer) {
  return deer.state === "resting";
}

export function finish(context, deer) {
  assert(deer.job === "rest");
  if (wasResting(deer))
    context.dispatch(Actions.increaseVillagerNeeds(deer.id));
}

export function start(context, deer) {
  if (deer.job !== "rest") {
    util.goToBuilding(context, deer, "house");
    util.startJob(context, deer, "rest");
    return;
  }

  assert(deer.target === "house");
  if (util.isWalking(context, deer)) return;
  else if (!wasResting(deer)) {
    context.dispatch(Actions.setVillagerState(deer.id, "resting"));
  }
}
