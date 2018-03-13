"use strict";

function startServer() {
  const treeTile = [7, 10];
  const foodTile = [9, 13];
  const storageTile = [3, 3];

  const map = [];
  for (let i = 0; i < MAP_HEIGHT; i++) {
    const line = [];
    for (let j = 0; j < MAP_WIDTH; j++) {
      let type;
      switch (Math.floor(Math.random() * 3 + 1)) {
        case 1:
          type = TILE_DIRT;
          break;
        case 2:
          type = TILE_GRASS; // TILE_WATER;
          break;
        case 3:
          type = TILE_GRASS;
          break;
      }
      line.push(type);
    }
    map.push(line);
  }

  map[3][3] = TILE_STORAGE;
  map[7][10] = TILE_TREE;
  map[9][13] = TILE_TREE;

  updateState({ type: "SET_MAP", map });
  updateState({
    type: "ADD_DEER",
    deer: { id: "deer1", x: 0, y: 0, inventory: 0, profession: "wood" }
  });
  updateState({
    type: "ADD_DEER",
    deer: { id: "deer2", x: 0, y: 50, inventory: 0, profession: "food" }
  });

  app.ticker.add(server);

  let counter = 0;
  function server(delta) {
    counter += delta;
    if (counter < 20) return;

    counter -= 20;

    for (let deer of Object.values(state.deers)) {
      const deerTile = cart2tile(deer.x, deer.y);

      if (deer.job === "wood") {
        // job: wood
        if (deer.inventory < 20) {
          if (deerTile[0] === treeTile[0] && deerTile[1] === treeTile[1]) {
            const inventory = Math.min(deer.inventory + 1, 20);
            updateState({
              type: "UPDATE_DEER",
              deer: { id: deer.id, inventory, item: "wood" }
            });
          } else if (!deer.path) {
            const path = astar(deerTile, treeTile);
            updateState({
              type: "UPDATE_DEER",
              deer: { id: deer.id, path }
            });
          }
        } else {
          updateState({
            type: "UPDATE_DEER",
            deer: { id: deer.id, job: "storage" }
          });
        }
      } else if (deer.job === "food") {
        // job: food
        if (deer.inventory < 20) {
          if (deerTile[0] === foodTile[0] && deerTile[1] === foodTile[1]) {
            const inventory = Math.min(deer.inventory + 1, 20);
            updateState({
              type: "UPDATE_DEER",
              deer: { id: deer.id, inventory, item: "food" }
            });
          } else if (!deer.path) {
            const path = astar(deerTile, foodTile);
            updateState({
              type: "UPDATE_DEER",
              deer: { id: deer.id, path }
            });
          }
        } else {
          updateState({
            type: "UPDATE_DEER",
            deer: { id: deer.id, job: "storage" }
          });
        }
      } else if (deer.job === "storage") {
        // job: storate
        if (deer.inventory > 0) {
          if (
            deerTile[0] === storageTile[0] &&
            deerTile[1] === storageTile[1]
          ) {
            updateState({
              type: "UPDATE_STORAGE",
              storage: {
                [deer.item]: state.storage[deer.item] + deer.inventory
              }
            });
            updateState({
              type: "UPDATE_DEER",
              deer: { id: deer.id, inventory: 0 }
            });
          } else if (!deer.path) {
            const path = astar(deerTile, storageTile);
            updateState({
              type: "UPDATE_DEER",
              deer: { id: deer.id, path }
            });
          }
        } else {
          updateState({
            type: "UPDATE_DEER",
            deer: { id: deer.id, job: deer.profession }
          });
        }
      } else {
        // no job
        updateState({
          type: "UPDATE_DEER",
          deer: { id: deer.id, job: deer.profession }
        });
      }
    }
  }
}

startServer();
