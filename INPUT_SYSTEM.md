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

The sprite would get the event first, but only, if the mouse wasmoved over the
sprite. After the sprite, the container would get the event.

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

### Mouse controls

* `left click` (location: `button`, mode: _any_): Execute button script.
* `left click` (location: `object`, mode: `normal`): Select object.
* `left click` (location: `object`, mode: `build`): Ignore object. Try to lay foundation underneath.
* `left click` (location: `map`, mode: `normal`): Select map tile.
* `left click` (location: `map`, mode: `build`): Try to lay foundation.
* `right drag` (startlocation: `map`, endlocation: _any_, mode: _any_): Move the offset of the map.
* `right drag` (startlocation: _any_, endlocation: _any_, mode: _any_): Ignore.
* `right click` (location: _any_, mode: _any_): Deselect and enter `normal mode`.

### Keyboard controls

* `g`: Toggle map grid.
* `h`: Toggle hitboxes.
* `F11`: Toggle fullscreen.
* `b`: Toggle buildmenu.
