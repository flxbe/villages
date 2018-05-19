import Context from "../context.js";
import * as Actions from "../actions.js";
import * as Constants from "../../common/constants.js";

import * as FoodJob from "./food.js";

describe("FoodJob", () => {
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
    // State.update(Actions.addFoodSource())
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
    test("should set the job to 'food'", () => {
      const deer = addDeer(context);
      FoodJob.start(context, deer);
      expect(context.getState().deers[deer.id].job).toBe("food");
    });

    test("should set target to food", () => {
      let deer = addDeer(context);

      FoodJob.start(context, deer);

      deer = context.getState().deers[deer.id];
      expect(deer.target).toBe("food");
    });

    test("should set the path", () => {
      let deer = addDeer(context);
      const oldPath = deer.path;

      FoodJob.start(context, deer);

      deer = context.getState().deers[deer.id];
      expect(deer.path).toBeDefined();
      expect(deer.path).not.toBe(oldPath);
    });
  });
});
