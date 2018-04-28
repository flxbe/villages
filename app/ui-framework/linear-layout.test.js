import LinearLayout from "./linear-layout.js";
import Button from "./button.js";

const { expect } = chai;

describe("LinearLayout", () => {
  function createLayout(horizontal = false) {
    return new LinearLayout({
      margin: 10,
      spacing: 10,
      horizontal
    });
  }

  describe("add", () => {
    it("should add a new child", () => {
      const layout = createLayout();
      const button = new Button();
      const mock = sinon.spy();
      button.on("added", mock);

      layout.add(button);
      expect(mock.called);
    });

    it("should listen to the child's 'updated' event", () => {
      const layout = createLayout();
      const button = new Button();

      layout.add(button);
      expect(button.listeners("updated").length).to.equal(1);
    });
  });

  describe("update", () => {
    let layout;
    let mock;

    beforeEach(() => {
      layout = createLayout();
      mock = sinon.spy();
      layout.on("updated", mock);
    });

    it("should emit the 'updated' event", () => {
      layout.update();
      expect(mock.called);
    });

    it("should update when a child has updated", () => {
      const button = new Button();
      layout.add(button);
      const callCount = mock.callCount;

      button.emit("updated");
      expect(mock.callCount).to.equal(callCount + 1);
    });
  });

  describe("remove", () => {
    let layout;
    let button;

    beforeEach(() => {
      layout = createLayout();
      button = new Button();
      layout.add(button);
    });

    it("should remove a child", () => {
      const mock = sinon.spy();
      button.on("removed", mock);
      layout.remove(button);
      expect(mock.called);
    });
  });
});
