"use strict";

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

function nodeId([x, y]) {
  return `${x};${y}`;
}

function manhattan(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function astar([fX, fY], [tX, tY]) {
  let closedSet = [];
  let openSetIndex = [];
  let openSet = [[fX, fY]];

  const startId = nodeId([fX, fY]);
  const targetId = nodeId([tX, tY]);
  const source = {};
  const fScore = { [startId]: manhattan(fX, fY, tX, tY) };
  const gScore = { [startId]: 0 };

  while (openSet.length > 0) {
    openSet = openSet.sort((n1, n2) => fScore[nodeId(n2)] - fScore[nodeId(n1)]);
    const node = openSet.pop();
    const id = nodeId(node);

    if (id === targetId) {
      const path = [];
      let currentNode = targetId;
      while (currentNode !== startId) {
        path.push(currentNode);
        currentNode = source[currentNode];
      }
      return path.map(i => {
        const parts = i.split(";");
        const res = [parseInt(parts[0]), parseInt(parts[1])];
        return getTileCenter(res[0], res[1]);
      });
    }

    closedSet.push(id);

    for (let dir of directions) {
      const nX = node[0] + dir[0];
      const nY = node[1] + dir[1];
      const neighborId = nodeId([nX, nY]);

      if (!isTileOnMap(nX, nY)) continue;
      if (closedSet.includes(neighborId)) continue;
      // TODO: use better reference to the map. This currently uses the client
      // map, but the algorithm will be executed on the server.
      if (!STATE.map[nX][nY].passable) continue;

      if (!openSetIndex.includes(neighborId)) {
        openSetIndex.push(neighborId);
        openSet.push([nX, nY]);
      }

      const compGScore = gScore[id] + 1;
      if (gScore[neighborId] && compGScore >= gScore[neighborId]) {
        continue;
      }

      source[neighborId] = id;
      gScore[neighborId] = compGScore;
      fScore[neighborId] = compGScore + manhattan(nX, nY, tX, tY);
    }
  }
}
