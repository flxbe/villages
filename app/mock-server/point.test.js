import Point from "./point.js";

const { expect } = chai;

describe("Point", () => {
  describe("fromTile", () => {
    it("should create a tile point", () => {
      const p = Point.fromTile(0, 0);
      expect(p.isTile()).to.be.true;
    });
  });
  describe("fromCart", () => {
    it("should create a cartesian point", () => {
      const p = Point.fromCart(0, 0);
      expect(p.isCart()).to.be.true;
    });
  });
  describe("fromAbs", () => {
    it("should create an absolute point", () => {
      const p = Point.fromAbs(0, 0);
      expect(p.isAbs()).to.be.true;
    });
  });
  describe("fromRel", () => {
    it("should create a relative point", () => {
      const p = Point.fromRel(0, 0);
      expect(p.isRel()).to.be.true;
    });
  });
  describe("descructuring", () => {
    it("should work with x", () => {
      const p = new Point(1, 2);
      const { x } = p;
      expect(x).to.equal(1);
    });
    it("should work with y", () => {
      const p = new Point(1, 2);
      const { y } = p;
      expect(y).to.equal(2);
    });
    it("should work with i", () => {
      const p = new Point(1, 2);
      const { i } = p;
      expect(i).to.equal(1);
    });
    it("should work with j", () => {
      const p = new Point(1, 2);
      const { j } = p;
      expect(j).to.equal(2);
    });
  });
  describe("set i", () => {
    it("should change x", () => {
      const p = new Point();
      p.i = 1;
      expect(p.x).to.equal(1);
    });
  });
  describe("get i", () => {
    it("should return x", () => {
      const p = new Point();
      p.x = 1;
      expect(p.i).to.equal(1);
    });
  });

  describe("add", () => {
    describe("a number", () => {
      it("should add the value", () => {
        const p = new Point();
        p.add(1);
        expect(p.x).to.equal(1);
        expect(p.y).to.equal(1);
      });
    });
    describe("an array", () => {
      it("should add the array entries", () => {
        const p = new Point();
        p.add([1, 2]);
        expect(p.x).to.equal(1);
        expect(p.y).to.equal(2);
      });
    });
    describe("a point", () => {
      it("should add the coordinates", () => {
        const p = new Point();
        p.add(new Point(1, 2));
        expect(p.x).to.equal(1);
        expect(p.y).to.equal(2);
      });
    });
  });

  describe("getNeighbours", () => {
    describe("on the corner", () => {
      it("should return 3 neighbours", () => {
        const p = Point.fromTile();
        const neighbours = p.getNeighbours(3, 3);
        expect(neighbours.length).to.equal(3);
      });
    });
    describe("on the edge", () => {
      it("should return 5 neighbours", () => {
        const p = Point.fromTile(1, 0);
        const neighbours = p.getNeighbours(3, 3);
        expect(neighbours.length).to.equal(5);
      });
    });

    describe("in the middle of the map", () => {
      it("should return 8 neighbours", () => {
        const p = Point.fromTile(1, 1);
        const neighbours = p.getNeighbours(3, 3);
        expect(neighbours.length).to.equal(8);
      });
    });
  });
});
