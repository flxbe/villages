## Tests

```bash
npm install
npm test
```

## Structure

* `/app/html-gui/`/`/app/windows/`: Reusable GUI widgets, widows and window
  compositor. See the
  [GUI docs](https://github.com/flxbe/villages/blob/master/GUI.md) for more
  information.
* `/app/mock-server/`: Emulated server for debug purposes right now. Responsible
  for all the actual game logic. See the
  [server docs](https://github.com/flxbe/villages/blob/master/SERVER_ARCH.md)
  for more information.
* `/app/index.js`: Entry-point. Sets up the application.
* `/app/assets.js`: Module to capture all necessary assets registered during
  the loading process.
* `/app/state.js`: Module to save and modify the game state.
* `/app/map.js`: Module to create and update the map layer.
* `/app/animations.js`: Module to compose animations and register necessary
  assets.
* `/app/input.js`: Bind global behaviour to browser events.
* `/app/server.js`: Module to manage the server connection.

## Controls

* `b`: Toggle build-menu.
* `g`: Toggle map grid.
* `h`: Toggle hitboxes.

## Assets

Before the game starts, all assets are loaded in `index.js`. The list of all
required assets is managed using the module in `assets.js`.

To add an asset, that should be available in the game, one must register it via

```js
// register a new texture
assets.add(["images/house/house1.png"]);

// the game loads the necessary assets

// create the sprite
const sprite = new PIXI.Sprite();
app.state.addChild(sprite);

// render the texture
function renderBuilding() {
  sprite.texture = PIXI.utils.TextureCache["/images/house/house1.png"];
}
```
