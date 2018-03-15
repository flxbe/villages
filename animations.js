"use strict";

const animations = {};

function addAnimation(name, frames) {
  assets.addArray(frames);
  animations[name] = frames;
}

function setAnimation(object, name) {
  if (object.currentAnimation !== name) {
    object.currentAnimation = name;
    object.animationTime = 0;
  }
}

function getAnimationFrame(name, time, timePerFrame = 7.5) {
  const animation = animations[name];

  const frames = animation.length;
  const index = Math.floor((time / timePerFrame) % frames);
  return animation[index];
}

const standAnimation = ["assets/deer/0_0img0.png"];
const nAnimation = [];
const neAnimation = [];
const eAnimation = [];
const seAnimation = [];
const sAnimation = [];
const swAnimation = [];
const wAnimation = [];
const nwAnimation = [];

for (let i = 0; i < 8; i++) {
  nAnimation.push(`assets/deer/0_0img${i * 16}.png`);
  neAnimation.push(`assets/deer/0_0img${i * 16 + 1}.png`);
  eAnimation.push(`assets/deer/0_0img${i * 16 + 2}.png`);
  seAnimation.push(`assets/deer/0_0img${i * 16 + 3}.png`);
  sAnimation.push(`assets/deer/0_0img${i * 16 + 4}.png`);
  swAnimation.push(`assets/deer/0_0img${i * 16 + 5}.png`);
  wAnimation.push(`assets/deer/0_0img${i * 16 + 6}.png`);
  nwAnimation.push(`assets/deer/0_0img${i * 16 + 7}.png`);
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
  pineTree.push(`assets/tree_pine/0_0img${i * 2}.png`);
}
for (let i = 11; i >= 0; i--) {
  pineTree.push(`assets/tree_pine/0_0img${i * 2}.png`);
}

addAnimation("PINE_TREE", pineTree);
