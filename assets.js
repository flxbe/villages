/**
 * Holds a simple set of all ASSETS that should be loaded before starting the game.
 */

"use strict";

Set.prototype.addArray = function(a) {
  for (let item of a) {
    this.add(item);
  }
};

ASSETS = new Set();
