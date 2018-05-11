import * as Actions from "../actions.js";

import * as Blueprints from "../../app/blueprints.js";
import * as Constants from "../../common/constants.js";

/**
 * Create a new building.
 *
 * TODO: verify, that the building can be placed.
 * @param {number} i
 * @param {number} j
 * @param {string} blueprintName
 */
export default function placeBuilding(context, i, j, blueprintName) {
  const blueprint = Blueprints[blueprintName];
  if (!blueprint) throw Error(`unknown blueprint: ${blueprintName}`);

  if (context.getState().storage.wood < blueprint.wood) {
    throw Error("not enough wood");
  }

  // reduce resources
  context.dispatch(
    Actions.updateStorage({
      wood: context.getState().storage.wood - blueprint.wood
    })
  );

  // update map
  const tileType =
    blueprintName === "road" ? Constants.TILE_ROAD : Constants.TILE_BUILDING;
  const mapUpdates = [];
  for (let k = i - blueprint.height + 1; k <= i; k++) {
    for (let l = j - blueprint.width + 1; l <= j; l++) {
      mapUpdates.push({
        i: k,
        j: l,
        tile: { type: tileType }
      });
    }
  }

  // dispatch map updates
  context.dispatch(Actions.updateMap(mapUpdates));
}
