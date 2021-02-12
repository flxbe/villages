import Point from "./point.js";
import * as Constants from "./constants.js";

function getContext() {
  const state = {
    offsetX: 20,
    offsetY: 20,
    mapHeight: 100,
    mapWidth: 100
  };

  return {
    getState: () => state
  };
}

describe("Point", () => {
  describe("constructor", () => {
    test("should create a new point with type None", () => {
      const p = new Point();
      expect(p.isNone()).toBe(true);
    });
  });
  describe("fromTile", () => {
    test("should create a tile point", () => {
      const p = Point.fromTile(0, 0);
      expect(p.isTile()).toBe(true);
    });
  });
  describe("fromCart", () => {
    test("should create a cartesian point", () => {
      const p = Point.fromCart(0, 0);
      expect(p.isCart()).toBe(true);
    });
  });
  describe("fromAbs", () => {
    test("should create an absolute point", () => {
      const p = Point.fromAbs(0, 0);
      expect(p.isAbs()).toBe(true);
    });
  });
  describe("fromRel", () => {
    test("should create a relative point", () => {
      const p = Point.fromRel(0, 0);
      expect(p.isRel()).toBe(true);
    });
  });
  describe("descructuring", () => {
    test("should work with x", () => {
      const p = new Point(1, 2);
      const { x } = p;
      expect(x).toBe(1);
    });
    test("should work with y", () => {
      const p = new Point(1, 2);
      const { y } = p;
      expect(y).toBe(2);
    });
    test("should work with i", () => {
      const p = new Point(1, 2);
      const { i } = p;
      expect(i).toBe(1);
    });
    test("should work with j", () => {
      const p = new Point(1, 2);
      const { j } = p;
      expect(j).toBe(2);
    });
  });

  describe("add", () => {
    test("should add a number", () => {
      const p = new Point();
      expect(p.add(1).toArray()).toEqual([1, 1]);
    });

    test("should add two numbers", () => {
      const p = new Point();
      expect(p.add(1, 2).toArray()).toEqual([1, 2]);
    });

    test("should add two numbers if the second is 0", () => {
      const p = new Point();
      expect(p.add(1, 0).toArray()).toEqual([1, 0]);
    });

    test("should add an array", () => {
      const p = new Point();
      expect(p.add([1, 2]).toArray()).toEqual([1, 2]);
    });

    test("should add ta point", () => {
      const p = new Point();
      const p2 = new Point(1, 2);
      expect(p.add(p2).toArray()).toEqual([1, 2]);
    });
  });

  describe("div", () => {
    test("should divide the point by a number", () => {
      const p = new Point(10, 10);
      expect(p.div(10).toArray()).toEqual([1, 1]);
    });
  });

  describe("mul", () => {
    test("should multiply the point by a number", () => {
      const p = new Point(1, 1);
      expect(p.mul(10).toArray()).toEqual([10, 10]);
    });
  });

  describe("toTile", () => {
    describe("from Cart", () => {
      test("should convert without error", () => {
        const p = Point.fromCart(1, 1);
        expect(p.toTile().isTile()).toBe(true);
      });

      test("should round on whole tiles", () => {
        const p = Point.fromCart(1, 1);
        expect(p.toTile().toArray()).toEqual([0, 0]);
      });
    });
  });

  describe("toCart", () => {
    describe("from Tile", () => {
      test("should convert without error", () => {
        const p = Point.fromTile(1, 1);
        expect(p.toCart().isCart()).toBe(true);
      });

      test("should transform correctly", () => {
        const p = Point.fromTile(1, 1);
        expect(p.toCart().toArray()).toEqual([
          Constants.TILE_WIDTH,
          Constants.TILE_HEIGHT
        ]);
      });
    });

    describe("from Abs", () => {
      test("should convert without error", () => {
        const p = Point.fromAbs(1, 1);
        expect(p.toCart().isCart()).toBe(true);
      });

      test("should convert back without error", () => {
        const p = Point.fromAbs(1, 1);
        expect(
          p
            .toCart()
            .toAbs()
            .toArray()
        ).toEqual([1, 1]);
      });
    });
  });

  describe("toAbs", () => {
    describe("from Tile", () => {
      test("should convert without error", () => {
        const p = Point.fromTile(1, 1);
        expect(p.toAbs().isAbs()).toBe(true);
      });
    });
  });

  describe("toRel", () => {
    describe("from Tile", () => {
      test("should convert without error", () => {
        const context = getContext();
        const p = Point.fromTile(1, 1);
        expect(p.toRel(context).isRel()).toBe(true);
      });
    });
  });

  describe("toArray", () => {
    test("should return the coordiantes as an array", () => {
      const p = new Point(1, 2);
      expect(p.toArray()).toEqual([1, 2]);
    });
  });

  describe("equals", () => {
    describe("another point", () => {
      test("should return true", () => {
        const p1 = new Point(1, 2);
        const p2 = new Point(1, 2);
        expect(p1.equals(p2)).toBe(true);
      });

      test("should return false", () => {
        const p1 = new Point(1, 2);
        const p2 = new Point(1, 3);
        expect(p1.equals(p2)).toBe(false);
      });

      test("should work for points with the same type", () => {
        const p1 = Point.fromTile(1, 2);
        const p2 = Point.fromTile(1, 2);
        expect(p1.equals(p2)).toBe(true);
      });

      test("should throw for points with different type", () => {
        const p1 = Point.fromTile(1, 2);
        const p2 = Point.fromCart(1, 2);
        expect(() => p1.equals(p2)).toThrowError();
      });
    });

    describe("an array", () => {
      test("should return true", () => {
        const p = new Point(1, 2);
        expect(p.equals([1, 2])).toBe(true);
      });

      test("should return false", () => {
        const p = new Point(1, 2);
        expect(p.equals([1, 3])).toBe(false);
      });
    });

    describe("two numbers", () => {
      test("should return true", () => {
        const p = new Point(1, 2);
        expect(p.equals(1, 2)).toBe(true);
      });

      test("should return false", () => {
        const p = new Point(1, 2);
        expect(p.equals(1, 3)).toBe(false);
      });
    });
  });

  describe("distance", () => {
    it("should calculate the distance between two points", () => {
      const p1 = Point.fromTile(0, 0);
      const p2 = Point.fromTile(1, 0);
      expect(p1.distance(p2)).toBe(1);
    });
  });

  describe("getCenter", () => {
    describe("from Tile", () => {
      test("should return the tile center", () => {
        const p = Point.fromTile(0, 0);
        const c = p.getCenter();
        expect(c.toArray()).toEqual([
          Constants.TILE_WIDTH / 2,
          Constants.TILE_HEIGHT / 2
        ]);
      });
    });
  });

  describe("isOnMap", () => {
    test("should correctly check points on the map", () => {
      const p = Point.fromTile(0, 0);
      expect(p.isOnMap(getContext())).toBe(true);
    });

    test("should correctly check points with negative coordinates", () => {
      const p = Point.fromTile(-1, -1);
      expect(p.isOnMap(getContext())).toBe(false);
    });

    test("should correctly check points outside the map", () => {
      const p = Point.fromTile(101, 101);
      expect(p.isOnMap(getContext())).toBe(false);
    });
  });

  describe("getNeighbours", () => {
    describe("on the corner", () => {
      test("should return 3 neighbours", () => {
        const p = Point.fromTile();
        const neighbours = p.getNeighbours(getContext());
        expect(neighbours.length).toBe(3);
      });
    });
    describe("on the edge", () => {
      test("should return 5 neighbours", () => {
        const p = Point.fromTile(1, 0);
        const neighbours = p.getNeighbours(getContext());
        expect(neighbours.length).toBe(5);
      });
    });

    describe("in the middle of the map", () => {
      test("should return 8 neighbours", () => {
        const p = Point.fromTile(1, 1);
        const neighbours = p.getNeighbours(getContext());
        expect(neighbours.length).toBe(8);
      });
    });
  });
});
