import Context from "../../app/context.js";
import * as Actions from "../actions.js";
import * as Constants from "../../common/constants.js";

import * as FoodJob from "./food.js";

console.log("test");

const { expect } = chai;

describe("FoodJob", () => {
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
    Context.reset();
    Context.update(Actions.setMap(map));
    // State.update(Actions.addFoodSource())
  });

  function getContext() {
    return {
      timestamp: Date.now(),
      getState: Context.get,
      pushUpdate: Context.update
    };
  }

  function addDeer(context, id = "deer1") {
    const deer = {
      id,
      path: [{ x: 0, y: 0, timestamp: context.timestamp }]
    };
    context.pushUpdate(Actions.addDeer(deer));
    return deer;
  }

  describe("start", () => {
    it("should set the job to 'food'", () => {
      const context = getContext();
      const deer = addDeer(context);
      FoodJob.start(context, deer);
      expect(State.get().deers[deer.id].job).to.equal("food");
    });

    it("should set target to food", () => {
      const context = getContext();
      let deer = addDeer(context);

      FoodJob.start(context, deer);

      deer = State.get().deers[deer.id];
      expect(deer.target).to.equal("food");
    });

    it("should set the path", () => {
      const context = getContext();
      let deer = addDeer(context);
      const oldPath = deer.path;

      FoodJob.start(context, deer);

      deer = State.get().deers[deer.id];
      expect(deer.path).to.exist;
      expect(deer.path).to.not.equal(oldPath);
    });
  });
});
