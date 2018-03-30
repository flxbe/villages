import { addAssets } from "./assets.js";

/**
 * Create all the possible animations and save the necessary assets to a list.
 */
const ANIMATIONS = {};

/**
 * Add an animation to the global animation map.
 *
 * @param {string} name - the animation name
 * @param {string[]} frames - frames in the animation
 */
export function addAnimation(name, frames) {
  addAssets(frames);
  ANIMATIONS[name] = frames;
}

/**
 * Asssign an animation to an object
 *
 * @param {Object} object - a renderable object
 * @param {string} name - the animation name
 */
export function setAnimation(object, name) {
  if (object.currentAnimation !== name) {
    object.currentAnimation = name;
    object.animationTime = 0;
  }
}

export function getAnimationFrame(name, time, timePerFrame = 7.5) {
  const animation = ANIMATIONS[name];

  const frames = animation.length;
  const index = Math.floor((time / timePerFrame) % frames);
  return animation[index];
}

const standAnimation = ["ASSETS/deer/0_0img0.png"];
const nAnimation = [];
const neAnimation = [];
const eAnimation = [];
const seAnimation = [];
const sAnimation = [];
const swAnimation = [];
const wAnimation = [];
const nwAnimation = [];

for (let i = 0; i < 8; i++) {
  nAnimation.push(`ASSETS/deer/0_0img${i * 16}.png`);
  neAnimation.push(`ASSETS/deer/0_0img${i * 16 + 1}.png`);
  eAnimation.push(`ASSETS/deer/0_0img${i * 16 + 2}.png`);
  seAnimation.push(`ASSETS/deer/0_0img${i * 16 + 3}.png`);
  sAnimation.push(`ASSETS/deer/0_0img${i * 16 + 4}.png`);
  swAnimation.push(`ASSETS/deer/0_0img${i * 16 + 5}.png`);
  wAnimation.push(`ASSETS/deer/0_0img${i * 16 + 6}.png`);
  nwAnimation.push(`ASSETS/deer/0_0img${i * 16 + 7}.png`);
}

addAnimation("STAND", standAnimation);
addAnimation("GO_NE", neAnimation);
addAnimation("GO_E", eAnimation);
addAnimation("GO_SE", seAnimation);
addAnimation("GO_S", sAnimation);
addAnimation("GO_SW", swAnimation);
addAnimation("GO_W", wAnimation);
addAnimation("GO_NW", nwAnimation);
addAnimation("GO_N", nAnimation);

const pineTree = [];

for (let i = 0; i <= 12; i++) {
  pineTree.push(`ASSETS/tree_pine/0_0img${i * 2}.png`);
}
for (let i = 11; i >= 0; i--) {
  pineTree.push(`ASSETS/tree_pine/0_0img${i * 2}.png`);
}

addAnimation("PINE_TREE", pineTree);
