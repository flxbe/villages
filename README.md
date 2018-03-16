## Structure

* `assets.js`: Array to hold necessary assets, that should be loaded.
* `state.js`: The global game state as well as a function to process server updates.
* `util.js`: Simple helper functions.
* `map.js`: Map-related helper functions.
* `animations.js`: All animations are defined here.
* `astar.js`: Pathfinder.
* `input.js`: Binds actions to user input events.
* `movement.js`: Update movable objects.
* `deer.js`: Holds deer-specific variables.
* `index.js`: Entry-points. Here, everything is loaded and rendered in the gameloop.
* `server.js`: Emulates the server, pushes events to the state update function.

## Controls

* `b`: Activate building mode.
* `n`: Activate normal mode.
* `g`: Toggle map grid.

## Assets

Before the game starts, all assets are loaded in `index.js`. Only after all assets are loaded the game will start. The list of all required assets is the set defined in `assets.js`.

To add an asset, that should be available in the game, one must add it to the `assets` set:

```js
// register textures
assets.add("images/house/house1.png");
assets.addArray(["images/house/house1.png", "images/house/house2.png"]);

// create the sprite
const sprite = new PIXI.Sprite();
app.state.addChild(sprite);

// render the texture
function renderBuilding() {
  sprite.texture = PIXI.utils.TextureCache["/images/house/house1.png"];
}
```
