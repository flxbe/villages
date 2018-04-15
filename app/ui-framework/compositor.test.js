import Compositor from "./compositor.js";
import Window from "./window.js";

const { expect } = chai;

describe("Compositor", () => {
  function addWindow(name = "") {
    const window = new Window({ name });
    Compositor.add(window);
    return window;
  }

  let window;
  beforeEach(() => {
    Compositor.reset();
    window = addWindow();
  });

  describe("add", () => {
    describe("single window", () => {
      it("should add a new window", () => {
        expect(Compositor.getIndex(window)).to.equal(0);
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
        window.emit("mousedown");
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

  describe("remove", () => {
    it("should remove a window", () => {
      Compositor.remove(window);
      expect(Compositor.getIndex.bind(window)).to.throw();
    });

    it("should stop listening to 'mousedown' events", () => {
      const listenerCount = window.listeners("mousedown").length;
      Compositor.remove(window);
      expect(window.listeners("mousedown").length).to.equal(listenerCount - 1);
    });

    it("should emit the 'removed' event", () => {
      const mock = sinon.spy();
      window.on("removed", mock);
      Compositor.remove(window);
      expect(mock.called);
    });

    it("should do nothing when removing an unregistered window", () => {
      const unknownWindow = new Window();
      Compositor.remove(unknownWindow);
    });
  });
});
