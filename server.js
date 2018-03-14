"use strict";

function startServer() {
  const treeTile = [7, 10];
  const foodTile = [9, 13];
  const storageTile = [3, 3];

  const map = generateRandomMap();

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

function generateNoiseMaps(number, width, height, minVal, maxVal, blurRadius, blurCenterWeight, blurWeightGradient) {
  const maps = [];

  for(let n = 0; n < number; n++) {
    const map = [];

    for(let i = 0; i < width; i++) {
      const line = [];
      for (let j = 0; j < height; j++) {
        line.push(Math.floor(Math.random() * (maxVal - minVal) + minVal));
      }
      map.push(line);
    }

    for(let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let val = map[i][j] * blurCenterWeight;
        let valc = blurCenterWeight;
        for(let distX = 1; distX < blurRadius; distX++) {
          for(let distY = 1; distX + distY <= blurRadius; distY++) {
            const factor = blurCenterWeight / ((distX + distY) * blurWeightGradient);
            if(i - distX >= 0) {
              if(j - distY >= 0) {
                val += map[i - distX][j - distY] * factor;
                valc += factor;
              }
              if(j + distY < height) {
                val += map[i - distX][j + distY] * factor;
                valc += factor;
              }
            }
            if(i + distX < width) {
              if(j - distY >= 0) {
                val += map[i + distX][j - distY] * factor;
                valc += factor;
              }
              if(j + distY < height) {
                val += map[i + distX][j + distY] * factor;
                valc += factor;
              }
            }
            map[i][j] = Math.floor(val / valc);
          }
        }
      }
    }

    maps.push(map);
  }

  return maps;
}

function generateRandomMap() {
  const map = [];
  const maps = generateNoiseMaps(1, MAP_WIDTH, MAP_HEIGHT, 0, 255, 4, 16, 2);

  for (let i = 0; i < MAP_WIDTH; i++) {
    const line = [];
    for (let j = 0; j < MAP_HEIGHT; j++) {
      line.push({ type: TILE_NORMAL, shade: shade2hexColor(maps[0][i][j]), passable: true, buildable: true });
    }
    map.push(line);
  }

  map[7][10].shade = "0x000000";
  map[9][13].shade = "0x000000";
  map[3][3].shade = "0x551A8B";

  return map;
}