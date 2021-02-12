let idCounter = 1;

export function addBuilding(blueprintName, i, j) {
  return {
    type: "ADD_BUILDING",
    building: { id: `building${idCounter++}`, blueprintName, i, j }
  };
}
