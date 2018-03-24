"use strict";

let serverMap = [];

/**
 * Send a request to the server.
 *
 * Apply an user action to the server. This will possably trigger a STATE
 * change by the server. This will be replaced by a real server.
 * @param {objext} request
 */
function serverRequest(request) {
  switch (request.type) {
    case "PLACE_BUILDING": {
      const { i, j, blueprintName } = request;
      placeBuilding(i, j, blueprintName);
    }
  }
}

/**
 * Create a new building.
 *
 * TODO: verify, that the building can be placed.
 * @param {number} i
 * @param {number} j
 * @param {string} blueprintName
 */
function placeBuilding(i, j, blueprintName) {
  const blueprint = BLUEPRINTS[blueprintName];
  if (!blueprint) throw Error(`unknown blueprint: ${blueprintName}`);

  if (STATE.storage.wood < blueprint.wood) {
    throw Error("not enough wood");
  }

  // reduce resources
  updateState(
    Actions.updateStorage({
      wood: STATE.storage.wood - blueprint.wood
    })
  );

  // update map
  const mapUpdates = [];
  for (let k = i - blueprint.height + 1; k <= i; k++) {
    for (let l = j - blueprint.width + 1; l <= j; l++) {
      mapUpdates.push({
        i: k,
        j: l,
        tile: {
          type: TILE_GRASS,
          shade: rgb2hexColor(0, 0, 0),
          passable: false,
          buildable: false
        }
      });
    }
  }

  // dispatch map updates
  updateState(Actions.updateMap(mapUpdates));
}

/**
 * Start the server emulation.
 *
 * This registers a task, that is executed periodically and issues STATE
 * updates. This will eventually be replaced by a real server implementation.
 */
function startServer() {
  const treeTile = [7, 10];
  const foodTile = [9, 13];
  const storageTile = [3, 3];

  generateRandomMap();

  APPLICATION.ticker.add(server);

  let counter = 0;
  function server(delta) {
    counter += delta;
    if (counter < 20) return;

    counter -= 20;

    for (let deer of Object.values(STATE.deers)) {
      const deerTile = cart2tile(deer.x, deer.y);

      if (deer.job === "wood") {
        // job: wood
        if (deer.inventory < 20) {
          if (deerTile[0] === treeTile[0] && deerTile[1] === treeTile[1]) {
            const inventory = Math.min(deer.inventory + 1, 20);
            updateState(
              Actions.updateDeer({ id: deer.id, inventory, item: "wood" })
            );
          } else if (!deer.path) {
            const path = astar(deerTile, treeTile);
            updateState(Actions.updateDeer({ id: deer.id, path }));
          }
        } else {
          updateState(Actions.updateDeer({ id: deer.id, job: "storage" }));
        }
      } else if (deer.job === "food") {
        // job: food
        if (deer.inventory < 20) {
          if (deerTile[0] === foodTile[0] && deerTile[1] === foodTile[1]) {
            const inventory = Math.min(deer.inventory + 1, 20);
            updateState(
              Actions.updateDeer({ id: deer.id, inventory, item: "food" })
            );
          } else if (!deer.path) {
            const path = astar(deerTile, foodTile);
            updateState(Actions.updateDeer({ id: deer.id, path }));
          }
        } else {
          updateState(Actions.updateDeer({ id: deer.id, job: "storage" }));
        }
      } else if (deer.job === "storage") {
        // job: storage
        if (deer.inventory > 0) {
          if (
            deerTile[0] === storageTile[0] &&
            deerTile[1] === storageTile[1]
          ) {
            updateState(
              Actions.updateStorage({
                [deer.item]: STATE.storage[deer.item] + deer.inventory
              })
            );
            updateState(Actions.updateDeer({ id: deer.id, inventory: 0 }));
          } else if (!deer.path) {
            const path = astar(deerTile, storageTile);
            updateState(Actions.updateDeer({ id: deer.id, path }));
          }
        } else {
          updateState(
            Actions.updateDeer({ id: deer.id, job: deer.profession })
          );
        }
      } else {
        // no job
        updateState(Actions.updateDeer({ id: deer.id, job: deer.profession }));
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
  // TODO: implement random function with settable seed
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
    const typeline = [];
    for (let j = 0; j < MAP_HEIGHT; j++) {
      line.push({
        type: TILE_GRASS,
        shade: rgb2hexColor(rNoiseMap[i][j], 255, bNoiseMap[i][j]),
        passable: true,
        buildable: true
      });
      typeline.push(TILE_GRASS);
      //line.push({ type: TILE_GRASS, shade: rgb2hexColor(rNoiseMap[i][j], gNoiseMap[i][j], bNoiseMap[i][j]), passable: true, buildable: true });
      //line.push({ type: TILE_GRASS, shade: shade2hexColor(noiseMap[i][j]), passable: true, buildable: true });
    }
    map.push(line);
    serverMap.push(typeline);
  }

  map[7][10].shade = "0x000000";
  map[7][10].buildable = false;
  map[9][13].shade = "0x000000";
  map[9][13].buildable = false;
  map[3][3].shade = "0x551A8B";
  map[3][3].buildable = false;

  updateState(Actions.setMap(map));

  updateState(
    Actions.addDeer({
      id: "deer1",
      x: 0,
      y: 0,
      inventory: 0,
      profession: "wood"
    })
  );
  updateState(
    Actions.addDeer({
      id: "deer2",
      x: 0,
      y: 50,
      inventory: 0,
      profession: "food"
    })
  );

  setTree("tree1", 2, 10);
  setTree("tree2", 4, 9);
  setTree("tree3", 2, 12);
  setTree("tree4", 5, 11);
}

function setTree(id, i, j) {
  const tile = {
    type: TILE_GRASS,
    shade: "0x269a41",
    passable: false,
    buildable: false
  };
  updateState(Actions.updateMap([{ i, j, tile }]));
  updateState(Actions.addTree({ id, i, j }));
}
