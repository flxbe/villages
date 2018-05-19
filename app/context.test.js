import context from "./context.js";

describe("context", () => {
  function getMapAction() {
    return { type: "SET_MAP", map: [] };
  }

  beforeEach(() => {
    context.reset();
  });

  describe("reset", () => {
    test("should reset the internal state", () => {
      context.dispatch(getMapAction());
      context.reset();

      expect(context.getState().map).toBe(undefined);
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

    describe("array of actions", () => {
      test("should emit an dispatch for every action", () => {
        const cb = jest.fn();
        context.on("SET_MAP", cb);
        context.dispatch([getMapAction(), getMapAction()]);
        expect(cb.mock.calls.length).toBe(2);
      });
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
});
