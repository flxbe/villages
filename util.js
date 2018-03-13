"use strict";

// TODO: window resize
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const TILE_HEIGHT = 20;
const TILE_WIDTH = 20;

let offsetX = 0;
let offsetY = 0;

function cart2iso(x, y) {
  const isoX = x - y;
  const isoY = (x + y) / 2;
  return [isoX, isoY];
}

function iso2cart(x, y) {
  const cartX = (2 * y + x) / 2;
  const cartY = (2 * y - x) / 2;
  return [cartX, cartY];
}

function abs2rel(isoX, isoY) {
  return [isoX + offsetX, isoY + offsetY];
}

function rel2abs(isoX, isoY) {
  return [isoX - offsetX, isoY - offsetY];
}

function rel2tile(isoX, isoY) {
  const [cartX, cartY] = iso2cart(isoX, isoY);

  const j = Math.floor(cartX / TILE_WIDTH);
  const i = Math.floor(cartY / TILE_HEIGHT);

  return [i, j];
}
