import assert from "../../common/assert.js";
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

export function increaseVillagerNeeds(id, amount = 4) {
  return (dispatch, getState) => {
    const villager = getState().deers[id];
    assert(villager);

    const { needs } = villager;
    const newNeeds = {
      food: Math.min(100, needs.food + amount),
      sleep: Math.min(100, needs.sleep + amount)
    };
    dispatch({
      type: "UPDATE_DEER",
      deer: { id, needs: newNeeds }
    });
  };
}

export function decreaseVillagerNeeds(id, amount = 0.5) {
  return (dispatch, getState) => {
    const villager = getState().deers[id];
    assert(villager);

    const { needs } = villager;
    const newNeeds = {
      food: Math.max(0, needs.food - amount),
      sleep: Math.max(0, needs.sleep - amount)
    };
    dispatch({
      type: "UPDATE_DEER",
      deer: { id, needs: newNeeds }
    });
  };
}

export function increaseVillagerSkill(id, skill, amount = 0.01) {
  return (dispatch, getState) => {
    const villager = getState().deers[id];
    assert(villager);

    const { skills } = villager;
    const newSkills = Object.assign({}, skills, {
      [skill]: skills[skill] + amount
    });
    dispatch({
      type: "UPDATE_DEER",
      deer: { id, skills: newSkills }
    });
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
