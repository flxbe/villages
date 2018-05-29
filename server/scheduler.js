import * as Actions from "./actions.js";
import * as wood from "./jobs/wood.js";
import * as food from "./jobs/food.js";
import * as rest from "./jobs/rest.js";

const jobMap = {
  wood,
  food,
  rest
};

function getJobScheduler(name) {
  const jobScheduler = jobMap[name];

  if (!jobScheduler) {
    throw new Error(`Unknown job name: ${name}`);
  }

  return jobScheduler;
}

export default function scheduleJobs(context) {
  for (let deer of Object.values(context.getState().deers)) {
    context.dispatch(Actions.decreaseVillagerNeeds(deer.id));

    let scheduler;

    if (deer.job) {
      let scheduler = getJobScheduler(deer.job);
      scheduler.finish(context, deer);
    }

    if (
      deer.needs.sleep < 25 ||
      (deer.needs.sleep < 100 && deer.job === "rest")
    )
      scheduler = rest;
    else scheduler = getJobScheduler(deer.profession);

    scheduler.start(context, deer);
  }
}
