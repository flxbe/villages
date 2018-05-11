import context from "./context.js";

const inBrowser = typeof window !== "undefined";
const chai = inBrowser ? window.chai : require("chai");
const sinon = inBrowser ? window.sinon : require("sinon");
const { expect } = chai;

describe("context", () => {
  function getMapAction() {
    return { type: "SET_MAP", map: [] };
  }

  beforeEach(() => {
    context.reset();
  });

  describe("reset", () => {
    it("should reset the internal state", () => {
      context.update(getMapAction());
      context.reset();

      expect(context.get().map).to.equal(undefined);
    });
  });

  describe("on", () => {
    it("should add a new callback", () => {
      const cb = sinon.spy();
      context.on("SET_MAP", cb);
      context.update(getMapAction());
      expect(cb.called);
    });

    it("should only subscribe to the correct event", () => {
      const cb = sinon.spy();
      context.on("ANOTHER_EVENT", cb);
      context.update(getMapAction());
      expect(!cb.called);
    });

    describe("array of actions", () => {
      it("should emit an update for every action", () => {
        const cb = sinon.spy();
        context.on("SET_MAP", cb);
        context.update([getMapAction(), getMapAction()]);
        expect(cb.callCount).to.equal(2);
      });
    });
  });

  describe("off", () => {
    it("should remove a registered callback", () => {
      const cb = sinon.spy();
      context.on("SET_MAP", cb);
      context.off("SET_MAP", cb);
      context.update(getMapAction());
      expect(!cb.called);
    });
  });
});
