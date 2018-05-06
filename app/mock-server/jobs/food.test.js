import State from "../../state.js";
import * as Actions from "../actions.js";

import * as FoodJob from "./food.js";

const { expect } = chai;

describe("FoodJob", () => {
  beforeEach(() => {
    State.reset();
  });

  function getContext() {
    return {
      timestamp: Date.now(),
      getState: State.get,
      pushUpdate: State.update
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
      const deer = addDeer(context);
      FoodJob.start(context, deer);
      expect(State.get().deers[deer.id].target).to.equal("food");
    });

    it("should set the path", () => {
      const context = getContext();
      const deer = addDeer(context);
      FoodJob.start(context, deer);
      expect(State.get().deers[deer.id].path).to.exist();
    });
  });
});
