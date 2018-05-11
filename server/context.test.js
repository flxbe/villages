import Context from "./context.js";

const { expect } = require("chai");

describe("Context", () => {
  let context;

  beforeEach(() => {
    context = new Context();
  });

  describe("constructor", () => {});

  describe("getState", () => {
    it("should return the internal state", () => {
      expect(context.getState()).to.exist;
    });
  });

  describe("update", () => {
    let map;
    let action;
    beforeEach(() => {
      map = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];
      action = { type: "SET_MAP", map };
      context.update(action);
    });

    it("should proxy updates to the state", () => {
      expect(context.getState().map).to.equal(map);
    });

    it("should save actions in the internal cache", () => {
      expect(context.getActions().length).to.equal(1);
      expect(context.getActions()[0]).to.equal(action);
    });

    describe("multiple action", () => {
      it("should work with multiple actions", () => {
        const actions = context.getActions().length;

        context.update([
          { type: "SET_MAP", map: [] },
          { type: "SET_MAP", map: [] }
        ]);

        expect(context.getActions().length).to.equal(actions + 2);
      });
    });
  });

  describe("clearActions", () => {
    it("shoul clear the internal action cache", () => {
      context.update({ type: "SET_MAP", map: [] });
      expect(context.getActions().length).to.equal(1);
      context.clearActions();
      expect(context.getActions().length).to.equal(0);
    });
  });
});
