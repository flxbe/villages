import * as Actions from "../actions.js";

import * as Constants from "../../common/constants.js";

export default function loadState(context) {
  context.dispatch(Actions.loadState());
}
