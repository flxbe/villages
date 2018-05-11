const ASSETS = new Set();

export function addAssets(a) {
  for (let item of a) {
    ASSETS.add(item);
  }
}

export function getAssets() {
  return Array.from(ASSETS).map(asset => `app/${asset}`);
}
