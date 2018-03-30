import { setAnimation } from "./animations.js";
import {
  distance,
  getDirection,
  isNorth,
  isNorthEast,
  isEast,
  isSouthEast,
  isSouth,
  isSouthWest,
  isWest,
  isNorthWest
} from "./util.js";

function updatePath(object) {
  if (object.targetDistance > 0) return;

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
    delete object.path;
    object.targetDistance = 1;
    object.direction = [0, 0];
  }
}

export function move_deer(object, delta) {
  object.animationTime += delta;

  const direction = object.direction;
  let animation;
  if (!direction) animation = "STAND";
  else if (isNorth(direction)) animation = "GO_N";
  else if (isNorthEast(direction)) animation = "GO_NE";
  else if (isEast(direction)) animation = "GO_E";
  else if (isSouthEast(direction)) animation = "GO_SE";
  else if (isSouth(direction)) animation = "GO_S";
  else if (isSouthWest(direction)) animation = "GO_SW";
  else if (isWest(direction)) animation = "GO_W";
  else if (isNorthWest(direction)) animation = "GO_NW";
  else animation = "STAND";

  setAnimation(object, animation);

  if (!object.path) return;

  updatePath(object);

  // TODO: incorporate start time for synchronised movement.
  object.targetDistance -= delta / 2.0;
  if (object.targetDistance > 0) {
    object.x += object.direction[0] * delta / 2.0;
    object.y += object.direction[1] * delta / 2.0;
  } else {
    // TODO: use remaining delta
    object.x = object.currentTarget[0];
    object.y = object.currentTarget[1];
  }
}
