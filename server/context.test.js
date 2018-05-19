import Context from "./context.js";

describe("Context", () => {
  let context;

  beforeEach(() => {
    context = new Context();
  });

  describe("constructor", () => {});

  describe("getState", () => {
    test("should return the internal state", () => {
      expect(context.getState()).toBeDefined();
    });
  });

  describe("dispatch", () => {
    let map;
    let action;
    beforeEach(() => {
      map = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];
      action = { type: "SET_MAP", map };
      context.dispatch(action);
    });

    test("should proxy updates to the state", () => {
      expect(context.getState().map).toBe(map);
    });

    test("should save actions in the internal cache", () => {
      expect(context.getActions().length).toBe(1);
      expect(context.getActions()[0]).toBe(action);
    });

    describe("multiple action", () => {
      test("should work with multiple actions", () => {
        const actions = context.getActions().length;

        context.dispatch([
          { type: "SET_MAP", map: [] },
          { type: "SET_MAP", map: [] }
        ]);

        expect(context.getActions().length).toBe(actions + 2);
      });
    });
  });

  describe("clearActions", () => {
    test("shoul clear the internal action cache", () => {
      context.dispatch({ type: "SET_MAP", map: [] });
      expect(context.getActions().length).toBe(1);
      context.clearActions();
      expect(context.getActions().length).toBe(0);
    });
  });
});
