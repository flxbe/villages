import * as Constants from "../constants.js";
import { isWalkableTile, getTileCenter } from "../util.js";

const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
];

function isTileOnMap(height, width, [i, j]) {
  return j >= 0 && j < width && i >= 0 && i < height;
}

function manhattan(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    this.content.push(element);
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    const first = this.content[0];
    const last = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = last;
      this.sinkDown(0);
    }
    return first;
  },

  size: function() {
    return this.content.length;
  },

  remove: function(node) {
    let i = 0;
    while (i < this.size() && this.content[i] != node) {
      i++;
    }
    if (i == this.size() - 1) return;
    const last = this.content.pop();
    this.content[i] = last;
    this.bubbleUp(i);
    this.sinkDown(i);
  },

  bubbleUp: function(i) {
    const element = this.content[i];
    const score = this.scoreFunction(element);
    while (i > 0) {
      const parentInd = Math.floor((i + 1) / 2) - 1;
      const parent = this.content[parentInd];
      if (score >= this.scoreFunction(parent)) break;
      this.content[parentInd] = element;
      this.content[i] = parent;
      i = parentInd;
    }
  },

  sinkDown: function(i) {
    const element = this.content[i];
    const elementScore = this.scoreFunction(element);

    while (true) {
      const child2Ind = (i + 1) * 2;
      const child1Ind = child2Ind - 1;
      let swap = null;

      if (child1Ind < this.size()) {
        const child1 = this.content[child1Ind];
        const child1Score = this.scoreFunction(child1);
        if (child1Score < elementScore) {
          swap = child1Ind;
        }

        if (child2Ind < this.size()) {
          const child2 = this.content[child2Ind];
          const child2Score = this.scoreFunction(child2);
          if (child2Score < (swap == null ? elementScore : child1Score)) {
            swap = child2Ind;
          }
        }
      }

      if (swap == null) break;
      this.content[i] = this.content[swap];
      this.content[swap] = element;
      i = swap;
    }
  },

  rescoreElement: function(element) {
    this.sinkDown(this.content.indexOf(element));
  }
};

/**
 * Compute a path from the start to the target tile.
 *
 * @param {Tile[][]} map
 * @param {Point} start
 * @param {Point} target
 */
export default function astar(map, [si, sj], [ti, tj]) {
  let compMap = [];

  const weightFunction = function(i, j) {
    if (map[i][j].type == Constants.TILE_ROAD) return 1;
    return 2;
  };

  const height = map.length;
  const width = map[0].length;
  for (let i = 0; i < height; i++) {
    let line = [];
    for (let j = 0; j < width; j++) {
      line.push({
        i: i,
        j: j,
        walkable: isWalkableTile(map[i][j].type),
        visited: false,
        closed: false,
        pred: null,
        f: undefined,
        g: undefined
      });
    }
    compMap.push(line);
  }

  let heap = new BinaryHeap(node => node.f);

  let start = compMap[si][sj];
  start.g = 0;
  start.f = manhattan(si, sj, ti, tj);

  heap.push(start);

  while (heap.size() > 0) {
    let current = heap.pop();

    if (current.i == ti && current.j == tj) {
      let path = [];
      while (current) {
        path.push(getTileCenter(current.i, current.j));
        current = current.pred;
      }

      // return new format
      let time = Date.now();
      return path.reverse().map(([x, y]) => {
        const result = { x, y, timestamp: time };
        time += 1000;
        return result;
      });
    }

    current.closed = true;

    for (let dir of directions) {
      const ni = current.i + dir[0];
      const nj = current.j + dir[1];

      if (!isTileOnMap(height, width, [ni, nj])) continue;
      const neighbour = compMap[ni][nj];
      const neighbourTile = map[ni][nj];

      if (neighbour.closed) continue;
      if (!isWalkableTile(neighbourTile.type)) continue;

      const nCost = weightFunction(ni, nj);
      const g =
        ni != current.i && nj != current.j
          ? current.g + nCost * 1.5
          : current.g + nCost;

      if (neighbour.visited && g >= neighbour.g) continue;
      neighbour.pred = current;
      neighbour.g = g;
      neighbour.f = g + manhattan(ni, nj, ti, tj);

      if (!neighbour.visited) {
        neighbour.visited = true;
        heap.push(neighbour);
      } else {
        heap.rescoreElement(neighbour);
      }
    }
  }

  return [];
}
