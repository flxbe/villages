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

  get i() {
    return this.x;
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
      if (isNumber(b)) {
        y = b;
      } else {
        y = a;
      }
    }

    return new Point(op(this.x, x), op(this.y, y), this.type);
  }

  add(a, b) {
    return this._binaryOperation(addOperation, a, b);
  }

  sub(a, b) {
    return this._binaryOperation(subOperation, a, b);
  }

  div(f) {
    assertNumber(f);
    return new Point(this.x / f, this.y / f, this.type);
  }

  mul(f) {
    assertNumber(f);
    return new Point(this.x * f, this.y * f, this.type);
  }

  equals(a, b) {
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
      assertNumber(b);
      x = a;
      y = b;
    }
    return this.x === x && this.y === y;
  }

  distance(p) {
    assertPoint(p);
    assertType(p, this.type);
    const x = p.x - this.x;
    const y = p.y - this.y;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  toRel(context) {
    if (this.isRel()) return this;

    assert(context);
    if (!this.isAbs()) return this.toAbs().toRel(context);

    const { offsetX, offsetY } = context.getState();
    return Point.fromRel(this.x + offsetX, this.y + offsetY);
  }

  toAbs(context) {
    if (this.isAbs()) return this;

    if (this.isRel()) {
      assert(context);
      const { offsetX, offsetY } = context.getState();
      return Point.fromAbs(this.x - offsetX, this.y - offsetY);
    } else if (!this.isCart()) {
      return this.toCart(context).toAbs(context);
    }

    assert(this.isCart());
    const { x, y } = this;
    return Point.fromAbs(x - y, (x + y) / 2.0);
  }

  toCart(context) {
    if (this.isCart()) return this;
    if (this.isTile()) {
      return Point.fromCart(
        this.j * Constants.TILE_WIDTH,
        this.i * Constants.TILE_HEIGHT
      );
    } else if (!this.isAbs()) {
      return this.toAbs(context).toCart(context);
    }

    assert(this.isAbs());
    const { x, y } = this;
    const tX = 2.0 * y + x;
    const tY = 2.0 * y - x;
    return Point.fromCart(tX / 2.0, tY / 2.0);
  }

  toTile(context) {
    if (this.isTile()) return this;
    if (!this.isCart()) return this.toCart(context).toTile(context);

    const i = Math.floor(this.y / Constants.TILE_HEIGHT);
    const j = Math.floor(this.x / Constants.TILE_WIDTH);
    return Point.fromTile(i, j);
  }

  getCenter() {
    assertType(this, POINT_TILE, true);
    return this.toCart().add(
      Constants.TILE_WIDTH / 2,
      Constants.TILE_HEIGHT / 2
    );
  }

  getNeighbours(context) {
    assertType(this, POINT_TILE, true);

    let neighbours = [];
    for (let dir of directions) {
      const n = this.add(dir);
      if (n.isOnMap(context)) neighbours.push(n);
    }

    return neighbours;
  }

  isOnMap(context) {
    const { mapHeight, mapWidth } = context.getState();
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
