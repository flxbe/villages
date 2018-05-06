import astar from "./astar.js";
import * as Constants from "../constants.js";
import { getTileCenter } from "../util.js";

const { expect } = chai;

describe("astar", () => {
  const start = [0, 0];
  const target = [2, 2];
  const map = [
    [
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_GRASS }
    ],

    [
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_WATER },
      { type: Constants.TILE_WATER }
    ],
    [
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_GRASS },
      { type: Constants.TILE_GRASS }
    ]
  ];

  it("should compute a path from 'start' to 'target'", () => {
    const path = astar(map, start, target);
    console.log(path);
    const pathStart = path[0];
    expect([pathStart.x, pathStart.y]).to.deep.equal(
      getTileCenter(start[0], start[1])
    );
  });
});
