/**
 * Set the job of a villager.
 *
 * @param {string} id villager id
 * @param {string} job job name
 */
export function setVillagerJob(id, job) {
  return {
    type: "UPDATE_DEER",
    deer: { id, job }
  };
}

export function setVillagerState(id, state) {
  return {
    type: "UPDATE_DEER",
    deer: { id, state }
  };
}

export function setVillagerTarget(id, target, path) {
  return {
    type: "UPDATE_DEER",
    deer: { id, target, path, state: "walking" }
  };
}

export function setVillagerInventory(id, item, amount) {
  return {
    type: "UPDATE_DEER",
    deer: { id, item, inventory: amount }
  };
}
