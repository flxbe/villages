import Widget from "./widget.js";

const { expect } = chai;

describe("HTMLWidget", () => {
  function createWidget() {
    return new Widget("TestWidget");
  }

  describe("createWidget", () => {
    it("name must not be undefined", () => {
      expect(() => new Widget()).to.throw("The widget name must not be null.");
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
        const mock = jest.fn();
        child.on("mounted", mock);

        parent.add(child);
        expect(mock.called);
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
        const mock = jest.fn();
        child.on("unmounted", mock);

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
  });
});
