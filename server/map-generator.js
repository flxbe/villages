import * as Constants from "../common/constants.js";

function noise(width, height, frequency) {
  const sinPhase = Math.floor(Math.random() * 2 * Math.PI);
  const cosPhase = Math.floor(Math.random() * 2 * Math.PI);
  const map = [];
  for (let i = 0; i < width; i++) {
    const line = [];
    for (let j = 0; j < height; j++) {
      line.push(
        Math.sin((2 * Math.PI * frequency[0] * i) / width + sinPhase) *
          Math.cos((2 * Math.PI * frequency[1] * j) / height + cosPhase) +
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
      map[i][j] = Math.floor((map[i][j] * 255) / max);
    }
  }
  return map;
}

function generateNoiseMap(width, height, frequencies, amplitudeFunc, seed) {
  // TODO: implement random function with settable seed
  // Math.random.seed(seed);
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

export function generateRandomMap() {
  const noiseMap = generateRandomNoiseMap(
    Constants.MAP_WIDTH,
    Constants.MAP_HEIGHT
  );

  const map = [];
  for (let i = 0; i < Constants.MAP_WIDTH; i++) {
    const line = [];
    for (let j = 0; j < Constants.MAP_HEIGHT; j++) {
      if (i > 13 && j > 13 && noiseMap[i][j] > 200) {
        line.push({
          type: Constants.TILE_WATER
        });
      } else if (noiseMap[i][j] > 150) {
        line.push({
          type: Constants.TILE_DIRT
        });
      } else {
        line.push({
          type: Constants.TILE_GRASS
        });
      }
    }
    map.push(line);
  }

  map[9][13].type = Constants.TILE_ROAD;

  return map;
}
