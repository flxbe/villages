import Point from "./point.js";
import * as Constants from "./constants.js";

const { expect } = require("chai");

function getContext() {
  const state = {
    offsetX: 20,
    offsetY: 20,
    mapHeight: 100,
    mapWidth: 100
  };

  return {
    get: () => state
  };
}

describe("Point", () => {
  describe("constructor", () => {
    it("should create a new point with type None", () => {
      const p = new Point();
      expect(p.isNone()).to.be.true;
    });
  });
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
    it("should add a number", () => {
      const p = new Point();
      p.add(1);
      expect(p.toArray()).to.deep.equal([1, 1]);
    });

    it("should add two numbers", () => {
      const p = new Point();
      p.add(1, 2);
      expect(p.toArray()).to.deep.equal([1, 2]);
    });

    it("should add an array", () => {
      const p = new Point();
      p.add([1, 2]);
      expect(p.toArray()).to.deep.equal([1, 2]);
    });

    it("should add ta point", () => {
      const p = new Point();
      p.add(new Point(1, 2));
      expect(p.toArray()).to.deep.equal([1, 2]);
    });
  });

  describe("div", () => {
    it("should divide the point by a number", () => {
      const p = new Point(10, 10);
      p.div(10);
      expect(p.toArray()).to.deep.equal([1, 1]);
    });
  });

  describe("mul", () => {
    it("should multiply the point by a number", () => {
      const p = new Point(1, 1);
      p.mul(10);
      expect(p.toArray()).to.deep.equal([10, 10]);
    });
  });

  describe("toTile", () => {
    describe("from Cart", () => {
      it("should convert without error", () => {
        const p = Point.fromCart(1, 1);
        p.toTile();
        expect(p.isTile()).to.be.true;
      });

      it("should round on whole tiles", () => {
        const p = Point.fromCart(1, 1);
        p.toTile();
        expect(p.toArray()).to.deep.equal([0, 0]);
      });
    });
  });

  describe("toCart", () => {
    describe("from Tile", () => {
      it("should convert without error", () => {
        const p = Point.fromTile(1, 1);
        p.toCart();
        expect(p.isCart()).to.be.true;
      });

      it("should transform correctly", () => {
        const p = Point.fromTile(1, 1);
        p.toCart();
        expect(p.toArray()).to.deep.equal([
          Constants.TILE_WIDTH,
          Constants.TILE_HEIGHT
        ]);
      });
    });

    describe("from Abs", () => {
      it("should convert without error", () => {
        const p = Point.fromAbs(1, 1);
        p.toCart();
        expect(p.isCart()).to.be.true;
      });

      it("should convert back without error", () => {
        const p = Point.fromAbs(1, 1);
        expect(
          p
            .toCart()
            .toAbs()
            .toArray()
        ).to.deep.equal([1, 1]);
      });
    });
  });

  describe("toAbs", () => {
    describe("from Tile", () => {
      it("should convert without error", () => {
        const p = Point.fromTile(1, 1);
        p.toAbs();
        expect(p.isAbs()).to.be.true;
      });
    });
  });

  describe("toRel", () => {
    describe("from Tile", () => {
      it("should convert without error", () => {
        const context = getContext();
        const p = Point.fromTile(1, 1);
        p.toRel(context);
        expect(p.isRel()).to.be.true;
      });
    });
  });

  describe("toArray", () => {
    it("should return the coordiantes as an array", () => {
      const p = new Point(1, 2);
      expect(p.toArray()).to.deep.equal([1, 2]);
    });
  });

  describe("equals", () => {
    describe("another point", () => {
      it("should return true", () => {
        const p1 = new Point(1, 2);
        const p2 = new Point(1, 2);
        expect(p1.equals(p2)).to.be.true;
      });

      it("should return false", () => {
        const p1 = new Point(1, 2);
        const p2 = new Point(1, 3);
        expect(p1.equals(p2)).to.be.false;
      });

      it("should work for points with the same type", () => {
        const p1 = Point.fromTile(1, 2);
        const p2 = Point.fromTile(1, 2);
        expect(p1.equals(p2)).to.be.true;
      });

      it("should throw for points with different type", () => {
        const p1 = Point.fromTile(1, 2);
        const p2 = Point.fromCart(1, 2);
        expect(() => p1.equals(p2)).to.throw();
      });
    });

    describe("an array", () => {
      it("should return true", () => {
        const p = new Point(1, 2);
        expect(p.equals([1, 2])).to.be.true;
      });

      it("should return false", () => {
        const p = new Point(1, 2);
        expect(p.equals([1, 3])).to.be.false;
      });
    });

    describe("two numbers", () => {
      it("should return true", () => {
        const p = new Point(1, 2);
        expect(p.equals(1, 2)).to.be.true;
      });

      it("should return false", () => {
        const p = new Point(1, 2);
        expect(p.equals(1, 3)).to.be.false;
      });
    });
  });

  describe("getCenter", () => {
    describe("from Tile", () => {
      it("should return the tile center", () => {
        const p = Point.fromTile(0, 0);
        const c = p.getCenter();
        expect(c.toArray()).to.deep.equal([
          Constants.TILE_WIDTH / 2,
          Constants.TILE_HEIGHT / 2
        ]);
      });
    });
  });

  describe("isOnMap", () => {
    it("should correctly check points on the map", () => {
      const p = Point.fromTile(0, 0);
      const neighbours = p.getNeighbours(getContext());
      expect(p.isOnMap(getContext())).to.be.true;
    });

    it("should correctly check points with negative coordinates", () => {
      const p = Point.fromTile(-1, -1);
      const neighbours = p.getNeighbours(getContext());
      expect(p.isOnMap(getContext())).to.be.false;
    });

    it("should correctly check points outside the map", () => {
      const p = Point.fromTile(101, 101);
      const neighbours = p.getNeighbours(getContext());
      expect(p.isOnMap(getContext())).to.be.false;
    });
  });

  describe("getNeighbours", () => {
    describe("on the corner", () => {
      it("should return 3 neighbours", () => {
        const p = Point.fromTile();
        const neighbours = p.getNeighbours(getContext());
        expect(neighbours.length).to.equal(3);
      });
    });
    describe("on the edge", () => {
      it("should return 5 neighbours", () => {
        const p = Point.fromTile(1, 0);
        const neighbours = p.getNeighbours(getContext());
        expect(neighbours.length).to.equal(5);
      });
    });

    describe("in the middle of the map", () => {
      it("should return 8 neighbours", () => {
        const p = Point.fromTile(1, 1);
        const neighbours = p.getNeighbours(getContext());
        expect(neighbours.length).to.equal(8);
      });
    });
  });
});
