"use strict";

app.ticker.add(server);

const treeTile = [7, 10];
const storageTile = [3, 3];
let job = "wood";
function server(delta) {
  const deerTile = cart2tile(deer.x, deer.y);

  if (job === "wood") {
    if (inventory < 20) {
      if (deerTile[0] === treeTile[0] && deerTile[1] === treeTile[1]) {
        inventory += delta * 0.1;
        inventory = Math.min(inventory, 20);
      } else if (!deer.path) {
        setPath(deer, astar(deerTile, treeTile));
      }
    } else {
      job = "storage";
    }
  }

  if (job === "storage") {
    if (inventory > 0) {
      if (deerTile[0] === storageTile[0] && deerTile[1] === storageTile[1]) {
        storage += inventory;
        inventory = 0;
      } else if (!deer.path) {
        setPath(deer, astar(deerTile, storageTile));
      }
    } else {
      job = "wood";
    }
  }
}
