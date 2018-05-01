# Input System

This document should document the overall architecture of the input system.

## Input Events

Input events are processed using the `PIXI` event handling system. If an event
occurs, the tree of all objects is traversed. Layers, that are closer to the
screen, will get the event first. Children have priority over their parents.

```js
const container = new PIXI.Container();
const sprite = new PIXI.Sprite();
container.addChild(sprite);

container.addEventListener("mousemove", event => {
  // do some stuff...
});

sprite.addEventListener("mousemove", event => {
  // do some stuff...
});
```

The sprite would get the event first, but only, if the mouse was moved over the
sprite. After the sprite, the container would get the event.

Only one element per hierachy level gets the event. If gets then propagated to
the parent containers and can be consumed there.

The event can be stopped from being further propagated. In the game, as soon as
an event was consumed, the propagation will be stopped.

```js
container.addEventListener("mousemove", event => {
  // do some stuff...
});

sprite.addntListener("mousemove", event => {
  if (!isEventRelevantForSprite()) return;

  // process event
  UI_STATE.hoveredElement = {
    /* this sprite */
  };
  event.stopPropagation();
});
```

In the game, the application itself listens for all important events to
implement default behaviours:

```js
APPLICATION.state.on("mousemove", event => {
  // apparently, nothing was hovered
  UI_STATE.hoveredElement = null;
});
```

As soon as the first relevant target for an event is found, the event can
be processed and the propagation can be stopped. E.g., in build mode, all
Objects can not be hovered or clicked but only the tiles underneath them.

## Global `UI_STATE`

The UI saves relevant interaction data to e.g. highlight selected objects. The
relevant fields are:

```js
{
  hoveredElement: Element,
  selection: Element
}
```

where an `Element` is defined is:

```js
{
  type: SELECTION_TYPE,   // one of tile, deer, button, ...

  // type == tile
  i: number,
  j: number

  // type in [deer, tree, house]
  id: string

  // type == button
  // ?
}
```

## Controls

Interpretation of the input depends on the active `window` (e.g. `map`, `buildmenu`), the location of a mouse click (e.g. `object`, `window`), the mode (e.g. `build`, `normal`), and the selected object (e.g. `villager`, `building`).

### Mouse controls

* `left click`
  * (window: `map`, location: `object`, mode: `normal`): Select object.
  * (window: `map`, location: `object`, mode: `build`): Ignore object. Try to lay foundation underneath. If successful enter mode `normal`.
  * (window: `map`, location: `map`, mode: `normal`): Select map tile.
  * (window: `map`, location: `map`, mode: `build`): Try to lay foundation. If successful enter mode `normal`.
  * (window: _any_, location: `window`, mode: _any_): Change active window.
  * (window: _any_, location: `button`, mode: _any_): Execute button script. Close irrelevant windows.
* `left drag`
  * (window: _any_, startlocation: `window`, endlocation: _any_, mode: _any_): Drag and drop clicked window. Change active window.
* `right click`
  * (window: _any_, location: _any_, mode: _any_): Deselect. Enter mode `normal`.
* `right drag`
  * (window: `map`, startlocation: `map`, endlocation: _any_, mode: _any_): Move camera.

### Keyboard controls

* `Esc`
  * (window: `map`): Open `servermenu`.
  * (window: _any_): Close all windows.
* `F11`
  * (window: _any_): Toggle fullscreen.
* `Up`
  * (window: `map`): Move camera up.
* `Down`
  * (window: `map`): Move camera down.
* `Left`
  * (window: `map`): Move camera left.
* `Right`
  * (window: `map`): Move camera right.
* `Tab`
  * (window: `map`, selection: `building`): Cycle through own buildings.
  * (window: `map`, selection: _any_): Cycle through own villagers.
* `Ctrl`
  * (window: `map`, mode: `build`): Hold while building to prevent entering mode `normal`.
* `Spacebar`
  * (window: `map`, selection: `object`): Center camera on selected `object`.
* `g`
  * (window: `map`): Toggle map grid.
* `h`
  * (window: `map`): Toggle hitboxes.
* `b`
  * (window: `map`): Toggle `buildmenu`.
* `m`
  * (window: `map`): Toggle `worldmap`.
* ?
  * (window: `map`, selection: `villager`): Toggle `jobmenu` for selected `villager`.
  * (window: `map`, selection: _any_): Toggle `jobmenu` overview.
