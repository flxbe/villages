import Widget from "./widget.js";
import Button from "./button.js";

const { expect } = chai;

describe("Widget", () => {
  function createWidget() {
    return new Widget("TestWidget");
  }

  describe("createWidget", () => {
    it("name must not be undefined", () => {
      expect(() => new Widget()).to.throw("The widget name must not be null.");
    });
  });

  describe("update", () => {
    it("should trigger the 'updated` event.", () => {
      const widget = createWidget();
      const mock = sinon.spy();
      widget.on("updated", mock);

      widget.update();
      expect(mock.called);
    });
  });

  describe("is not a container", () => {
    describe("add", () => {
      it("should throw", () => {
        const parent = createWidget();
        const child = createWidget();
        expect(() => parent.add(child)).to.throw(
          "TestWidget: widget is no container and cannot contain childs."
        );
      });
    });

    describe("remove", () => {
      it("should throw", () => {
        const parent = createWidget();
        const child = createWidget();
        expect(() => parent.remove(child)).to.throw(
          "TestWidget: widget is no container and cannot contain childs."
        );
      });
    });
  });

  describe("is a container", () => {
    function createContainer() {
      return new Widget("TestWidget", { isContainer: true });
    }

    describe("add", () => {
      it("should add a new child", () => {
        const parent = createContainer();
        const child = createWidget();
        const mock = sinon.spy();
        child.on("added", mock);

        parent.add(child);
        expect(mock.called);
      });

      it("should listen to the child's 'updated' event", () => {
        const parent = createContainer();
        const child = createWidget();

        parent.add(child);
        expect(child.listeners("updated").length).to.equal(1);
      });

      it("should throw if child is no widget", () => {
        const parent = createContainer();
        expect(() => parent.add({})).to.throw(
          "TestWidget: 'child' must be an instance of 'Widget'."
        );
      });
    });

    describe("remove", () => {
      it("should remove a child", () => {
        const parent = createContainer();
        const child = createWidget();
        const mock = sinon.spy();
        child.on("removed", mock);

        parent.add(child);
        parent.remove(child);
        expect(mock.called);
      });

      it("should throw if child is no widget", () => {
        const parent = createContainer();
        expect(() => parent.remove({})).to.throw(
          "TestWidget: 'child' must be an instance of 'Widget'."
        );
      });
    });

    describe("update", () => {
      it("should update when a child has updated", () => {
        const parent = createContainer();
        const child = createWidget();
        parent.add(child);

        const mock = sinon.spy();
        parent.on("updated", mock);
        child.update();
        expect(mock.called);
      });
    });
  });
});
