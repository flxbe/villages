"use strict";

function startServer() {
  const treeTile = [7, 10];
  const foodTile = [9, 13];
  const storageTile = [3, 3];

  generateRandomMap();

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

function generateRandomMap() {
  const rNoiseMap = generateRandomNoiseMap(MAP_WIDTH, MAP_HEIGHT);
  //const gNoiseMap = generateRandomNoiseMap(MAP_WIDTH, MAP_HEIGHT);
  const bNoiseMap = generateRandomNoiseMap(MAP_WIDTH, MAP_HEIGHT);
  //const noiseMap = generateRandomNoiseMap(MAP_WIDTH, MAP_HEIGHT);

  for (let i = 0; i < MAP_WIDTH; i++) {
    const line = [];
    for (let j = 0; j < MAP_HEIGHT; j++) {
      const rval = rNoiseMap[i][j];
      //const gval = gNoiseMap[i][j];
      const bval = bNoiseMap[i][j];
      if (rval < 112) {
        rNoiseMap[i][j] = 63;
      }
      else if (rval < 128) {
        rNoiseMap[i][j] = 127;
      }
      else if (rval < 144) {
        rNoiseMap[i][j] = 191;
      }
      else {
        rNoiseMap[i][j] = 255;
      }
      /*if (gval < 112) {
        gNoiseMap[i][j] = 63;
      }
      else if (gval < 128) {
        gNoiseMap[i][j] = 127;
      }
      else if (gval < 144) {
        gNoiseMap[i][j] = 191;
      }
      else {
        gNoiseMap[i][j] = 255;
      }*/
      if (bval < 112) {
        bNoiseMap[i][j] = 63;
      }
      else if (bval < 128) {
        bNoiseMap[i][j] = 127;
      }
      else if (bval < 144) {
        bNoiseMap[i][j] = 191;
      }
      else {
        bNoiseMap[i][j] = 255;
      }
      /*const val = noiseMap[i][j];
      if (val < 112) {
        noiseMap[i][j] = 63;
      }
      else if (val < 128) {
        noiseMap[i][j] = 127;
      }
      else if (val < 144) {
        noiseMap[i][j] = 191;
      }
      else {
        noiseMap[i][j] = 255;
      }*/
    }
  }
  
  const map = [];
  for(let i = 0; i < MAP_WIDTH; i++) {
    const line = [];
    for(let j = 0; j < MAP_HEIGHT; j++) {
      line.push({ type: TILE_GRASS, shade: rgb2hexColor(rNoiseMap[i][j], 255, bNoiseMap[i][j]), passable: true, buildable: true });
      //line.push({ type: TILE_GRASS, shade: rgb2hexColor(rNoiseMap[i][j], gNoiseMap[i][j], bNoiseMap[i][j]), passable: true, buildable: true });
      //line.push({ type: TILE_GRASS, shade: shade2hexColor(noiseMap[i][j]), passable: true, buildable: true });
    }
    map.push(line);
  }

  map[7][10].shade = "0x000000";
  map[9][13].shade = "0x000000";
  map[3][3].shade = "0x551A8B";

  updateState({ type: "SET_MAP", map });
  updateState({
    type: "ADD_DEER",
    deer: { id: "deer1", x: 0, y: 0, inventory: 0, profession: "wood" }
  });
  updateState({
    type: "ADD_DEER",
    deer: { id: "deer2", x: 0, y: 50, inventory: 0, profession: "food" }
  });
}