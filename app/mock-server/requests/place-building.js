import * as Actions from "../actions.js";

import State from "../../state.js";
import * as Blueprints from "../../blueprints.js";
import * as Constants from "../../constants.js";

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

  if (State.get().storage.wood < blueprint.wood) {
    throw Error("not enough wood");
  }

  // reduce resources
  context.pushUpdate(
    Actions.updateStorage({
      wood: State.get().storage.wood - blueprint.wood
    })
  );

  // update map
  const mapUpdates = [];
  for (let k = i - blueprint.height + 1; k <= i; k++) {
    for (let l = j - blueprint.width + 1; l <= j; l++) {
      mapUpdates.push({
        i: k,
        j: l,
        tile: {
          type:
            blueprintName == "road"
              ? Constants.TILE_ROAD
              : Constants.TILE_BUILDING,
          shade: blueprintName == "road" ? "0x999999" : "0x000000"
        }
      });
    }
  }

  // dispatch map updates
  context.pushUpdate(Actions.updateMap(mapUpdates));
}
