import * as Actions from "../actions.js";

import * as Blueprints from "../../app/blueprints.js";
import * as Constants from "../../common/constants.js";

import { generateRandomMap } from "../map-generator.js";

/**
 * Load the map and all objects.
 *
 * @param {object} context
 */
export default function loadMap(context) {
  const map = generateRandomMap();

  context.dispatch(Actions.setMap(map));

  context.dispatch(
    Actions.addDeer({
      id: "deer1",
      path: [{ x: 0, y: 0, timestamp: Date.now() }],
      inventory: 0,
      job: "wood"
    })
  );
  context.dispatch(
    Actions.addDeer({
      id: "deer2",
      path: [{ x: 0, y: 0, timestamp: Date.now() }],
      inventory: 0,
      job: "food"
    })
  );

  setTree(context, "tree1", 2, 5);
  setTree(context, "tree2", 3, 5);
  setTree(context, "tree3", 4, 5);
  setTree(context, "tree4", 5, 5);
}

function setTree(context, id, i, j) {
  const tile = {
    type: Constants.TILE_TREE
  };
  context.dispatch(Actions.updateMap([{ i, j, tile }]));
  context.dispatch(Actions.addTree({ id, i, j }));
}