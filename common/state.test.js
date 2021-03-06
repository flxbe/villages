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

    describe("UPDATE_DEER", () => {
      const deer = {
        id: "deer1",
        needs: {
          food: 100,
          sleep: 100
        }
      };

      function addDeer() {
        update(state, {
          type: "ADD_DEER",
          deer
        });
      }

      test("should update the needs", () => {
        addDeer();
        const updatedDeer = {
          id: "deer1",
          needs: {
            food: 90,
            sleep: 80
          }
        };
        const action = {
          type: "UPDATE_DEER",
          deer: updatedDeer
        };

        update(state, action);
        expect(state.deers[deer.id]).toEqual(updatedDeer);
      });
    });

    describe("REMOVE_DEER", () => {
      test("should remove a deer", () => {
        const deer = { id: "deer1" };

        update(state, { type: "ADD_DEER", deer });
        update(state, { type: "REMOVE_DEER", id: deer.id });

        expect(state.deers).not.toMatchObject({ [deer.id]: deer });
      });
    });
  });
});
