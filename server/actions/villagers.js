import { updateStorage } from "./storage.js";
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

export function storeIventory(id) {
  return (dispatch, getState) => {
    const state = getState();
    const storage = state.storage;
    const { item, inventory } = state.deers[id];

    dispatch(
      updateStorage({
        [item]: storage[item] + inventory
      })
    );
    dispatch(setVillagerInventory(id, item, 0));
  };
}
