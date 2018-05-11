import loadMap from "./requests/load-map.js";
import placeBuilding from "./requests/place-building.js";

export default function executeRequest(context, request) {
  switch (request.type) {
    case "LOAD_MAP": {
      loadMap(context);
      break;
    }
    case "PLACE_BUILDING": {
      const { i, j, blueprintName } = request;
      placeBuilding(context, i, j, blueprintName);
      break;
    }
  }
}
