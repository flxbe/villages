import { create, update } from "./state.js";

describe("State", () => {
  let state;

  beforeEach(() => {
    state = create();
  });

  describe("update", () => {
    describe("SET_MAP", () => {
      test("should set the map", () => {
        const map = [];
        const action = { type: "SET_MAP", map };

        update(state, action);

        expect(state.map).toBe(map);
      });
    });

    describe("ADD_DEER", () => {
      test("shold add a new deer", () => {
        const deer = { id: "deer1" };
        const action = { type: "ADD_DEER", deer };

        update(state, action);

        expect(state.deers).toMatchObject({ [deer.id]: deer });
      });
    });

    describe("REMOVE_DEER", () => {
      test("shold remove a deer", () => {
        const deer = { id: "deer1" };

        update(state, { type: "ADD_DEER", deer });
        update(state, { type: "REMOVE_DEER", id: deer.id });

        expect(state.deers).not.toMatchObject({ [deer.id]: deer });
      });
    });

    describe("array of actions", () => {
      function addDeer(id) {
        return { type: "ADD_DEER", deer: { id } };
      }

      test("should execute all actions", () => {
        const actions = [addDeer("deer1"), addDeer("deer2")];

        update(state, actions);
        expect(Object.keys(state.deers).length).toBe(2);
      });
    });
  });
});
