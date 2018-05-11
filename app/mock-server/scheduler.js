import * as wood from "./jobs/wood.js";
import * as food from "./jobs/food.js";

const jobMap = {
  wood,
  food
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
    const scheduler = getJobScheduler(deer.job);
    scheduler.finish(context, deer);
    scheduler.start(context, deer);
  }
}
