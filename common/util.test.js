import Context from "./context.js";
import Point from "./point.js";
import * as Actions from "../server/actions.js";

import * as util from "./util.js";

describe("util", () => {
  let context;

  beforeEach(() => {
    context = new Context();
  });

  describe("getNearestBuilding", () => {
    const p = Point.fromTile(0, 0);

    beforeEach(() => {
      context.dispatch(Actions.addBuilding("house", 2, 2));
      context.dispatch(Actions.addBuilding("house", 3, 3));
      context.dispatch(Actions.addBuilding("barn", 1, 1));
    });

    test("should get the nearest house", () => {
      const b = util.getNearestBuilding(context, p, "house");
      expect(b.i).toEqual(2);
      expect(b.j).toEqual(2);
    });

    test("should return undefined for no matching buildings", () => {
      const b = util.getNearestBuilding(context, p, "school");
      expect(b).toBeUndefined();
    });
  });
});
