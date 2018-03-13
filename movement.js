"use strict";

function setPath(object, path) {
  object.path = path;
  updatePath(object);
}

function updatePath(object) {
  if (object.path && object.path.length > 0) {
    object.currentTarget = object.path.pop();
    object.targetDistance = distance(
      object.x,
      object.y,
      object.currentTarget[0],
      object.currentTarget[1]
    );
    object.direction = getDirection(
      object.x,
      object.y,
      object.currentTarget[0],
      object.currentTarget[1]
    );
  } else {
    object.targetDistance = 1;
    object.direction = [0, 0];
  }
}

function move(object, delta) {
  object.animationTime += delta;
  const direction = object.direction;
  let animation;
  if (isNorth(direction)) animation = "GO_N";
  else if (isNorthEast(direction)) animation = "GO_NE";
  else if (isEast(direction)) animation = "GO_E";
  else if (isSouthEast(direction)) animation = "GO_SE";
  else if (isSouth(direction)) animation = "GO_S";
  else if (isSouthWest(direction)) animation = "GO_SW";
  else if (isWest(direction)) animation = "GO_W";
  else if (isNorthWest(direction)) animation = "GO_NW";
  else animation = "STAND";
  setAnimation(object, animation);

  object.targetDistance -= delta / 2.0;
  if (object.targetDistance > 0) {
    object.x += object.direction[0] * delta / 2.0;
    object.y += object.direction[1] * delta / 2.0;
  } else {
    object.x = object.currentTarget[0];
    object.y = object.currentTarget[1];

    updatePath(object);
  }
}

function addAnimation(object, name, frames) {
  object.animations[name] = frames;
}

function setAnimation(object, name) {
  if (object.currentAnimation !== name) {
    object.currentAnimation = name;
    object.animationTime = 0;
  }
}

function getAnimationFrame(object) {
  const animation = object.animations[object.currentAnimation];

  const frames = animation.length;
  const timePerFrame = 7.5;
  const index = Math.floor((object.animationTime / timePerFrame) % frames);
  return animation[index];
}
