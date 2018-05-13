import assert, {
  isNumber,
  assertNumber,
  isArray,
  assertInteger
} from "./assert.js";
import * as Constants from "./constants.js";

const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
];

export function isPoint(p) {
  return p instanceof Point;
}

export function assertPoint(p) {
  assert(isPoint(p), "not an instance of class 'Point'.");
}

export function assertType(p, type, strict = false) {
  if (!strict) {
    if (p.type === POINT_NONE || type === POINT_NONE) return;
  }
  assert(p.type === type, `point type mismatch: ${p.type} vs ${type}`);
}

function addOperation(a, b) {
  return a + b;
}

function subOperation(a, b) {
  return a - b;
}

const POINT_NONE = 0;
const POINT_TILE = 1;
const POINT_CART = 2;
const POINT_ABS = 3;
const POINT_REL = 4;

export default class Point {
  static fromTile(i, j) {
    return new Point(i, j, POINT_TILE);
  }

  static fromCart(x, y) {
    return new Point(x, y, POINT_CART);
  }

  static fromAbs(x, y) {
    return new Point(x, y, POINT_ABS);
  }

  static fromRel(x, y) {
    return new Point(x, y, POINT_REL);
  }

  constructor(x, y, type = POINT_NONE) {
    this.type = type;
    this.x = x || 0;
    this.y = y || 0;
  }

  set i(x) {
    this.x = x;
  }

  get i() {
    return this.x;
  }

  set j(y) {
    this.y = y;
  }

  get j() {
    return this.y;
  }

  clone() {
    return new Point(this.x, this.y, this.type);
  }

  _binaryOperation(op, a, b) {
    let x, y;
    if (isPoint(a)) {
      assertType(a, this.type);
      x = a.x;
      y = a.y;
    } else if (isArray(a)) {
      assert(a.length === 2);
      assertNumber(a[0]);
      assertNumber(a[1]);
      x = a[0];
      y = a[1];
    } else {
      assertNumber(a);
      x = a;
      if (b) {
        assertNumber(b);
        y = b;
      } else {
        y = a;
      }
    }

    this.x = op(this.x, x);
    this.y = op(this.y, y);
    return this;
  }

  add(a, b) {
    return this._binaryOperation(addOperation, a, b);
  }

  sub(p) {
    return this._binaryOperation(subOperation, a, b);
  }

  div(f) {
    assertNumber(f);
    this.x /= f;
    this.y /= f;
    return this;
  }

  mul(f) {
    assertNumber(f);
    this.x *= f;
    this.y *= f;
    return this;
  }

  toRel(context) {
    if (this.isRel()) return this;

    assert(context);
    if (!this.isAbs()) this.toAbs();
    const { offsetX, offsetY } = context.get();
    this.add(offsetX, offsetY);

    this.type = POINT_REL;
    return this;
  }

  toAbs(context) {
    if (this.isAbs()) return this;

    if (this.isRel()) {
      assert(context);
      const { offsetX, offsetY } = context.get();
      this.sub(offsetX, offsetY);
    } else {
      if (!this.isCart()) this.toCart();
      const { x, y } = this;
      this.x = x - y;
      this.y = (x + y) / 2.0;
    }

    this.type = POINT_ABS;
    return this;
  }

  toCart(context) {
    if (this.isCart()) return this;
    if (this.isTile()) {
      const { i, j } = this;
      this.x = j * Constants.TILE_WIDTH;
      this.y = i * Constants.TILE_HEIGHT;
    } else {
      if (!this.isAbs()) this.toAbs(context);
      const { x, y } = this;
      this.x = 2.0 * y + x;
      this.y = 2.0 * y - x;
      this.div(2.0);
    }

    this.type = POINT_CART;
    return this;
  }

  toTile(context) {
    if (this.isTile()) return this;
    if (!this.isCart()) this.toCart(context);
    const { x, y } = this;
    this.i = Math.floor(y / Constants.TILE_HEIGHT);
    this.j = Math.floor(x / Constants.TILE_WIDTH);

    this.type = POINT_TILE;
    return this;
  }

  getNeighbours(context) {
    assertType(this, POINT_TILE, true);

    let neighbours = [];
    for (let dir of directions) {
      const n = this.clone();
      n.add(dir);
      if (n.isOnMap(context)) neighbours.push(n);
    }

    return neighbours;
  }

  isOnMap(context) {
    const { mapHeight, mapWidth } = context.get();
    assertNumber(mapHeight);
    assertNumber(mapWidth);
    return (
      this.j >= 0 && this.j < mapWidth && this.i >= 0 && this.i < mapHeight
    );
  }

  isNone() {
    return this.type === POINT_NONE;
  }

  isTile() {
    return this.type === POINT_TILE;
  }

  isCart() {
    return this.type === POINT_CART;
  }

  isAbs() {
    return this.type === POINT_ABS;
  }

  isRel() {
    return this.type === POINT_REL;
  }

  toArray() {
    return [this.x, this.y];
  }
}
