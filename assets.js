/**
 * Holds a simple set of all assets that should be loaded before starting the game.
 */

"use strict";

Set.prototype.addArray = function(a) {
  for (let item of a) {
    this.add(item);
  }
};

const assets = new Set();
