import astar from "./astar.js";
import * as Constants from "../common/constants.js";
import { getTileCenter, cart2tile, isWalkableTile } from "../app/util.js";

const { expect } = require("chai");

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

  it("path should start at 'start'", () => {
    const path = astar(map, start, target);
    const pathStart = path[0];
    expect([pathStart.x, pathStart.y]).to.deep.equal(
      getTileCenter(start[0], start[1])
    );
  });

  it("path should end at 'target'", () => {
    const path = astar(map, start, target);
    const pathEnd = path[path.length - 1];
    expect([pathEnd.x, pathEnd.y]).to.deep.equal(
      getTileCenter(target[0], target[1])
    );
  });

  it("path should only include walkable tiles", () => {
    const path = astar(map, start, target);
    expect(
      path.every(node => {
        const [i, j] = cart2tile(node.x, node.y);
        return isWalkableTile(map[i][j].type);
      })
    ).to.be.true;
  });
});
