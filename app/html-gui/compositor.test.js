import Compositor from "./compositor.js";
import Window from "./window.js";
import { WINDOW_BORDER_COLOR } from "../constants.js";

const { expect } = chai;

describe("HTMLCompositor", () => {
  beforeEach(() => {
    Compositor.reset();
  });

  describe("unmounted", () => {
    describe("add", () => {
      it("should throw", () => {
        const window = new Window();
        expect(() => Compositor.add(window)).to.throw(
          "The compositor must first be mounted."
        );
      });
    });

    describe("mount", () => {
      it("should mount the compositor", () => {
        Compositor.mount(document.createElement("div"));
        const window = new Window();
        Compositor.add(window);
      });
    });
  });

  describe("mounted", () => {
    function addWindow(name = "") {
      const window = new Window({ name });
      Compositor.add(window);
      return window;
    }

    let window;
    beforeEach(() => {
      Compositor.mount(document.createElement("div"));
      window = addWindow();
    });

    describe("add", () => {
      describe("single window", () => {
        it("should add a new window", () => {
          expect(Compositor.getIndex(window)).to.equal(0);
        });

        it("should mount the window", () => {
          expect(window.mounted).to.equal(true);
        });
      });

      describe("muliple windows", () => {
        let window2;
        beforeEach(() => {
          window2 = addWindow();
        });

        it("should push new windows to the front", () => {
          expect(Compositor.getIndex(window2)).to.equal(1);
        });

        it("should change the window order when the window is clicked", () => {
          const clickEvent = document.createEvent("MouseEvents");
          clickEvent.initEvent("mousedown", true, true);
          window.node.dispatchEvent(clickEvent);

          expect(Compositor.getIndex(window)).to.equal(1);
        });
      });
    });

    describe("getWindow", () => {
      it("should return the window", () => {
        const name = "window_name";
        const newWindow = addWindow(name);
        expect(Compositor.getWindow(name)).to.equal(newWindow);
      });
    });

    describe("getIndex", () => {
      it("should return the window index", () => {
        expect(Compositor.getIndex(window)).to.equal(0);
      });
      it("should return -1 for an unknown window", () => {
        const unknownWindow = new Window();
        expect(Compositor.getIndex(unknownWindow)).to.equal(-1);
      });
    });

    describe("remove", () => {
      it("should remove a window", () => {
        Compositor.remove(window);
        expect(Compositor.getIndex(window)).to.equal(-1);
      });

      it("should unmount the window", () => {
        expect(window.mounted).to.equal(false);
      });

      it("should throw when removing an unregistered window", () => {
        const unknownWindow = new Window();
        expect(() => Compositor.remove(unknownWindow)).to.throw(
          "`window` is no child of the compositor."
        );
      });
    });
  });
});
