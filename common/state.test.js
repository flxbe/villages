import { create, update } from "./state.js";

const { expect } = require("chai");
const sinon = require("sinon");

describe("State", () => {
  let state;

  beforeEach(() => {
    state = create();
  });

  describe("update", () => {
    describe("SET_MAP", () => {
      it("should set the map", () => {
        const map = [];
        const action = { type: "SET_MAP", map };

        update(state, action);

        expect(state.map).to.equal(map);
      });
    });

    describe("ADD_DEER", () => {
      it("shold add a new deer", () => {
        const deer = { id: "deer1" };
        const action = { type: "ADD_DEER", deer };

        update(state, action);

        expect(state.deers).to.include({ [deer.id]: deer });
      });
    });

    describe("REMOVE_DEER", () => {
      it("shold remove a deer", () => {
        const deer = { id: "deer1" };

        update(state, { type: "ADD_DEER", deer });
        update(state, { type: "REMOVE_DEER", id: deer.id });

        expect(state.deers).to.not.contain({ [deer.id]: deer });
      });
    });

    describe("array of actions", () => {
      function addDeer(id) {
        return { type: "ADD_DEER", deer: { id } };
      }

      it("should execute all actions", () => {
        const actions = [addDeer("deer1"), addDeer("deer2")];

        update(state, actions);
        expect(Object.keys(state.deers).length).to.equal(2);
      });
    });
  });
});
