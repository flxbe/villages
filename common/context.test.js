import Context from "./context.js";

describe("Context", () => {
  let context;

  beforeEach(() => {
    context = new Context();
  });

  function getMapAction(map = []) {
    return {
      type: "SET_MAP",
      map
    };
  }

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
      action = getMapAction(map);
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

        context.dispatch([getMapAction(), getMapAction()]);

        expect(context.getActions().length).toBe(actions + 2);
      });
    });

    describe("thunk", () => {
      test("should call the thunk action", () => {
        const cb = jest.fn();
        context.dispatch(cb);
        expect(cb.mock.calls.length).toBe(1);
      });

      test("should provide dispatch and getState", () => {
        context.dispatch((dispatch, getState) => {
          const map = [];
          dispatch(getMapAction(map));
          expect(getState().map).toBe(map);
        });
      });
    });
  });

  describe("on", () => {
    test("should add a new callback", () => {
      const cb = jest.fn();
      context.on("SET_MAP", cb);
      context.dispatch(getMapAction());
      expect(cb.mock.calls.length).toBe(1);
    });

    test("should only subscribe to the correct event", () => {
      const cb = jest.fn();
      context.on("ANOTHER_EVENT", cb);
      context.dispatch(getMapAction());
      expect(cb.mock.calls.length).toBe(0);
    });

    test("should always emit the 'all' event", () => {
      const cb = jest.fn();
      context.on("all", cb);
      context.dispatch(getMapAction());
      expect(cb.mock.calls.length).toBe(1);
    });
  });

  describe("off", () => {
    test("should remove a registered callback", () => {
      const cb = jest.fn();
      context.on("SET_MAP", cb);
      context.off("SET_MAP", cb);
      context.dispatch(getMapAction());
      expect(cb.mock.calls.length).toBe(0);
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
