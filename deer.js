"use strict";

const standAnimation = ["assets/deer/0_0img0.png"];
const nAnimation = [];
const neAnimation = [];
const eAnimation = [];
const seAnimation = [];
const sAnimation = [];
const swAnimation = [];
const wAnimation = [];
const nwAnimation = [];

const DEER_OFFSET_X = -50;
const DEER_OFFSET_Y = -70;

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
  x: 100,
  y: 200,

  direction: [0, 0],
  currentTarget: [0, 0],
  targetDistance: 1,

  currentAnimation: "",
  animationTime: 0,
  animations: {}
};

addAnimation(deer, "STAND", standAnimation);
addAnimation(deer, "GO_NE", neAnimation);
addAnimation(deer, "GO_E", eAnimation);
addAnimation(deer, "GO_SE", seAnimation);
addAnimation(deer, "GO_S", sAnimation);
addAnimation(deer, "GO_SW", swAnimation);
addAnimation(deer, "GO_W", wAnimation);
addAnimation(deer, "GO_NW", nwAnimation);
addAnimation(deer, "GO_N", nAnimation);
