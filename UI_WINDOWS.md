# Window System

Container layer to organize windows.

```js
// module: windows.js

let windows = new PIXI.Container();

function addWindow(window, options) {
  /*
    options.x
    options.y
    options.height
    options.width
    options.borders
    */
  //
  const container = new WindowContainer(window);

  // add to window container
  windows.addChild(container);

  // add to front
  container.clickLayer.on("mousedown");
}

function resizeWindow(window, size) {}

function closeWindow(window) {
  windows.removeChild(window);
}
```

## Usage

```js
// has attributes:
// - width
// - height
const deerWindow = new DeerWindow(deer.id);
WindowLayer.addWindow(deerWindow);
```
