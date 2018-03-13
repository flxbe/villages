"use strict";

const neAnimation = [];
const eAnimation = [];
const seAnimation = [];
const sAnimation = [];
const swAnimation = [];
const wAnimation = [];
const nwAnimation = [];
const nAnimation = [];

for (let i = 0; i < 8; i++) {
  neAnimation.push(`assets/deer/0_0img${i * 16}.png`);
  eAnimation.push(`assets/deer/0_0img${i * 16 + 1}.png`);
  seAnimation.push(`assets/deer/0_0img${i * 16 + 2}.png`);
  sAnimation.push(`assets/deer/0_0img${i * 16 + 3}.png`);
  swAnimation.push(`assets/deer/0_0img${i * 16 + 4}.png`);
  wAnimation.push(`assets/deer/0_0img${i * 16 + 5}.png`);
  nwAnimation.push(`assets/deer/0_0img${i * 16 + 6}.png`);
  nAnimation.push(`assets/deer/0_0img${i * 16 + 7}.png`);
}

const deerAssets = [
  ...neAnimation,
  ...eAnimation,
  ...seAnimation,
  ...sAnimation,
  ...swAnimation,
  ...wAnimation,
  ...nwAnimation,
  ...nAnimation
];

const deer = {
  x: 0,
  y: 600,

  currentAnimation: "",
  animationTime: 0,
  animations: {}
};

function addAnimation(name, frames) {
  deer.animations[name] = frames;
}

function setAnimation(name) {
  deer.currentAnimation = name;
  deer.animationTime = 0;
}

function getAnimationFrame() {
  const animation = deer.animations[deer.currentAnimation];

  const frames = animation.length;
  const timePerFrame = 7.5;
  const index = Math.floor((deer.animationTime / timePerFrame) % frames);
  return animation[index];
}

addAnimation("GO_NE", neAnimation);
addAnimation("GO_E", eAnimation);
addAnimation("GO_SE", seAnimation);
addAnimation("GO_S", sAnimation);
addAnimation("GO_SW", swAnimation);
addAnimation("GO_W", wAnimation);
addAnimation("GO_NW", nwAnimation);
addAnimation("GO_N", nAnimation);
