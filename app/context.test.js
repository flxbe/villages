import context from "./context.js";

const { expect } = require("chai");
const sinon = require("sinon");

describe("context", () => {
  function getMapAction() {
    return { type: "SET_MAP", map: [] };
  }

  beforeEach(() => {
    context.reset();
  });

  describe("reset", () => {
    it("should reset the internal state", () => {
      context.dispatch(getMapAction());
      context.reset();

      expect(context.getState().map).to.equal(undefined);
    });
  });

  describe("on", () => {
    it("should add a new callback", () => {
      const cb = sinon.spy();
      context.on("SET_MAP", cb);
      context.dispatch(getMapAction());
      expect(cb.called);
    });

    it("should only subscribe to the correct event", () => {
      const cb = sinon.spy();
      context.on("ANOTHER_EVENT", cb);
      context.dispatch(getMapAction());
      expect(!cb.called);
    });

    describe("array of actions", () => {
      it("should emit an dispatch for every action", () => {
        const cb = sinon.spy();
        context.on("SET_MAP", cb);
        context.dispatch([getMapAction(), getMapAction()]);
        expect(cb.callCount).to.equal(2);
      });
    });
  });

  describe("off", () => {
    it("should remove a registered callback", () => {
      const cb = sinon.spy();
      context.on("SET_MAP", cb);
      context.off("SET_MAP", cb);
      context.dispatch(getMapAction());
      expect(!cb.called);
    });
  });
});
