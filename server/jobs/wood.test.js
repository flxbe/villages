import Context from "../../common/context.js";
import * as Actions from "../actions.js";
import * as Constants from "../../common/constants.js";
import Point from "../../common/point.js";

import * as woodJob from "./wood.js";

describe("WoodJob", () => {
  let context;

  const map = [
    [
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_GRASS }
    ],

    [
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_WATER },
      { type: Constants.TILE_WATER }
    ],
    [
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_GRASS }
    ]
  ];

  beforeEach(() => {
    context = new Context();
    context.dispatch(Actions.setMap(map));
    context.dispatch(Actions.tick());
    context.dispatch(Actions.addTree({ id: "tree1", i: 2, j: 2 }));
  });

  function addDeer(context, id = "deer1") {
    const deer = {
      id,
      path: [{ x: 0, y: 0, timestamp: context.getState().tickTimestamp }]
    };
    context.dispatch(Actions.addDeer(deer));
    return deer;
  }

  describe("start", () => {
    test("should set the job to 'wood'", () => {
      const deer = addDeer(context);
      woodJob.start(context, deer);
      expect(context.getState().deers[deer.id].job).toBe("wood");
    });

    test("should set target to wood", () => {
      let deer = addDeer(context);

      woodJob.start(context, deer);

      deer = context.getState().deers[deer.id];
      expect(deer.target).toBe("wood");
    });

    test("should set the path next to the tree", () => {
      let deer = addDeer(context);
      const oldPath = deer.path;

      woodJob.start(context, deer);

      deer = context.getState().deers[deer.id];
      const lastNode = deer.path[deer.path.length - 1];
      const p = Point.fromCart(lastNode.x, lastNode.y).toTile();
      expect(p.distance(Point.fromTile(2, 2))).toBe(1);
    });
  });
});
