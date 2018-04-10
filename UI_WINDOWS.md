# Window System

Container layer to organize windows.

```js
// module: windows.js

let windows = new PIXI.Container();

function addWindow(window) {
  //
  const container = new WindowContainer(window);

  // add to window container
  windows.addChild(container);

  // add to front
  container.on("mousedown");

  // move window
  container.topBorder.on("drag");

  // close window
  container.closeButton.on("click");
}

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
