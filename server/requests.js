import loadState from "./requests/load-state.js";
import placeBuilding from "./requests/place-building.js";

export default function executeRequest(context, request) {
  switch (request.type) {
    case "LOAD_STATE": {
      loadState(context);
      break;
    }
    case "PLACE_BUILDING": {
      const { i, j, blueprintName } = request;
      placeBuilding(context, i, j, blueprintName);
      break;
    }
    default:
      throw new Error(`Unknown request: ${request.type}`);
  }
}
