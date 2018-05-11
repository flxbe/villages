import { assert } from "./util.js";

/**
 * Finish last server tick.
 */
export function finish(context, deer) {
  assert(deer.job === "rocket-scientist");
}

/**
 * Start next server tick.
 */
export function start(context, deer) {}
