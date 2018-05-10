import State from "./state.js";

const inBrowser = typeof window !== "undefined";
const chai = inBrowser ? window.chai : require("chai");
const sinon = inBrowser ? window.sinon : require("sinon");
const { expect } = chai;

describe("State", () => {
  beforeEach(() => {
    State.reset();
  });

  describe("reset", () => {
    it("should reset the internal STATE", () => {
      State.update({ type: "SET_MAP", map: [] });
      State.reset();

      expect(State.get().map).to.equal(undefined);
    });
  });

  describe("on", () => {
    it("should add a new callback", () => {
      const cb = sinon.spy();
      State.on("TEST_EVENT", cb);
      State.update({ type: "TEST_EVENT" });
      expect(cb.called);
    });

    it("should only subscribe to the correct event", () => {
      const cb = sinon.spy();
      State.on("TEST_EVENT", cb);
      State.update({ type: "OTHER_EVENT" });
      expect(!cb.called);
    });
  });

  describe("off", () => {
    it("should remove a registered callback", () => {
      const cb = sinon.spy();
      State.on("TEST_EVENT", cb);
      State.off("TEST_EVENT", cb);
      State.update({ type: "TEST_EVENT" });
      expect(!cb.called);
    });
  });

  describe("update", () => {
    describe("SET_MAP", () => {
      it("should set the map", () => {
        const map = [];
        const action = { type: "SET_MAP", map };

        State.update(action);

        expect(State.get().map).to.equal(map);
      });
    });

    describe("ADD_DEER", () => {
      it("shold add a new deer", () => {
        const deer = { id: "deer1" };
        const action = { type: "ADD_DEER", deer };

        State.update(action);

        expect(State.get().deers).to.include({ [deer.id]: deer });
      });
    });

    describe("REMOVE_DEER", () => {
      it("shold remove a deer", () => {
        const deer = { id: "deer1" };

        State.update({ type: "ADD_DEER", deer });
        State.update({ type: "REMOVE_DEER", id: deer.id });

        expect(State.get().deers).to.not.contain({ [deer.id]: deer });
      });
    });
  });
});
