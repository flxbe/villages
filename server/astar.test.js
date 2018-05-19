import astar from "./astar.js";
import * as Constants from "../common/constants.js";
import Point from "../common/point.js";
import { isWalkableTile } from "../common/util.js";

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

  test("path should start at 'start'", () => {
    const path = astar(map, start, target);
    const pathStart = path[0];
    const center = Point.fromTile(start[0], start[1]).getCenter();
    expect([pathStart.x, pathStart.y]).toEqual([center.x, center.y]);
  });

  test("path should end at 'target'", () => {
    const path = astar(map, start, target);
    const pathEnd = path[path.length - 1];
    const center = Point.fromTile(target[0], target[1]).getCenter();
    expect([pathEnd.x, pathEnd.y]).toEqual([center.x, center.y]);
  });

  test("path should only include walkable tiles", () => {
    const path = astar(map, start, target);
    expect(
      path.every(node => {
        const { i, j } = Point.fromCart(node.x, node.y).toTile();
        return isWalkableTile(map[i][j].type);
      })
    ).toBe(true);
  });
});
