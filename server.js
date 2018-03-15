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

function noise(width, height, frequency) {
  const sinPhase = Math.floor(Math.random() * 2 * Math.PI);
  const cosPhase = Math.floor(Math.random() * 2 * Math.PI);
  const map = [];
  for (let i = 0; i < width; i++) {
    const line = [];
    for (let j = 0; j < height; j++) {
      line.push(
        Math.sin(2 * Math.PI * frequency[0] * i / width + sinPhase) *
          Math.cos(2 * Math.PI * frequency[1] * j / height + cosPhase) +
          1
      );
    }
    map.push(line);
  }
  return map;
}

function weightedSum(width, height, amplitudes, noises) {
  const map = [];
  let max = 0;
  for (let i = 0; i < width; i++) {
    const line = [];
    for (let j = 0; j < height; j++) {
      let val = 0;
      for (let n = 0; n < noises.length; n++) {
        val += noises[n][i][j] * amplitudes[n];
      }
      if (max < val) {
        max = val;
      }
      line.push(val);
    }
    map.push(line);
  }
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      map[i][j] = Math.floor(map[i][j] * 255 / max);
    }
  }
  return map;
}

function generateNoiseMap(width, height, frequencies, amplitudeFunc, seed) {
  //Math.random.seed(seed);
  const amplitudes = [];
  const noises = [];
  for (let i = 0; i < frequencies.length; i++) {
    amplitudes.push(amplitudeFunc(frequencies[i]));
    noises.push(noise(width, height, frequencies[i]));
  }
  return weightedSum(width, height, amplitudes, noises);
}

function generateRandomNoiseMap(width, height) {
  const seed = Math.floor(Math.random() * 16384 + 1);
  const frequencies = [];
  for (let f = 1; f <= 32; f *= 2) {
    frequencies.push([f, f]);
  }
  return generateNoiseMap(
    width,
    height,
    frequencies,
    function([f, g]) {
      return (1 / f + 1 / g) / 2;
    },
    seed
  );
}

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
      } else if (rval < 128) {
        rNoiseMap[i][j] = 127;
      } else if (rval < 144) {
        rNoiseMap[i][j] = 191;
      } else {
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
      } else if (bval < 128) {
        bNoiseMap[i][j] = 127;
      } else if (bval < 144) {
        bNoiseMap[i][j] = 191;
      } else {
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
  for (let i = 0; i < MAP_WIDTH; i++) {
    const line = [];
    for (let j = 0; j < MAP_HEIGHT; j++) {
      line.push({
        type: TILE_GRASS,
        shade: rgb2hexColor(rNoiseMap[i][j], 255, bNoiseMap[i][j]),
        passable: true,
        buildable: true
      });
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
  updateState({
    type: "ADD_TREE",
    tree: { id: "tree1", i: 2, j: 10 }
  });
  updateState({
    type: "ADD_TREE",
    tree: { id: "tree2", i: 4, j: 9 }
  });
  updateState({
    type: "ADD_TREE",
    tree: { id: "tree3", i: 2, j: 12 }
  });
  updateState({
    type: "ADD_TREE",
    tree: { id: "tree4", i: 5, j: 11 }
  });
}
