import assert, {
  isNumber,
  assertNumber,
  isArray,
  assertInteger
} from "./assert.js";

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

const POINT_NONE = 0;
const POINT_TILE = 1;
const POINT_CART = 2;
const POINT_ABS = 3;
const POINT_REL = 4;

export default class Point {
  static assertType(p, type, strict = false) {
    if (!strict) {
      if (p.type === POINT_NONE || type === POINT_NONE) return;
    }
    assert(p.type === type, `point type mismatch: ${p.type} vs ${type}`);
  }

  static isPoint(p) {
    return p instanceof Point;
  }

  static assertPoint(p) {
    assert(Point.isPoint(p), "not an instance of class 'Point'.");
  }

  static cart2abs(p) {
    Point.assertPoint(p);
    return new Point(p.x - p.y, (p.x + p.y) / 2);
  }

  static abs2cart(p) {
    Point.assertPoint(p);
    const r = new Point(2 * p.y + p.x, 2 * p.y - p.x);
    return r.div(2);
  }

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

  add(p) {
    if (isNumber(p)) {
      this.x += p;
      this.y += p;
    } else if (isArray(p)) {
      assert(p.length === 2);
      assertNumber(p[0]);
      assertNumber(p[1]);
      this.x += p[0];
      this.y += p[1];
    } else {
      Point.assertPoint(p);
      Point.assertType(p, this.type);
      this.x += p.x;
      this.y += p.y;
    }
  }

  sub(p) {
    if (isNumber(p)) {
      this.x -= p;
      this.y -= p;
    } else if (isArray(p)) {
      assert(p.length === 2);
      assertNumber(p[0]);
      assertNumber(p[1]);
      this.x -= p[0];
      this.y -= p[1];
    } else {
      Point.assertPoint(p);
      Point.assertType(p, this.type);
      this.x -= p.x;
      this.y -= p.y;
    }
  }

  div(f) {
    Point.assertNumber(f);
    this.x /= f;
    this.y /= f;
  }

  getNeighbours(height, width) {
    Point.assertType(this, POINT_TILE, true);

    let neighbours = [];
    for (let dir of directions) {
      const n = this.clone();
      n.add(dir);
      if (n.isOnMap(height, width)) neighbours.push(n);
    }

    return neighbours;
  }

  isOnMap(height, width) {
    assertNumber(height);
    assertNumber(width);
    return this.j >= 0 && this.j < width && this.i >= 0 && this.i < height;
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
