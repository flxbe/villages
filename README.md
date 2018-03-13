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
