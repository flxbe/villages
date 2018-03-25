BLUEPRINTS = {
  house: {
    height: 4,
    width: 4,
    wood: 40
  },
  barn: {
    height: 6,
    width: 4,
    wood: 100
  }
};

function sufficientResources(blueprint) {
  return STATE.storage.wood >= blueprint.wood;
}