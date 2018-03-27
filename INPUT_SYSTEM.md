# Input System

This document should document the overall architecture of the input system.

## Input Events

Input events arive using the native event callbacks of the browser.

```js
document.addEventListener("eventName", event => {
  // do some stuff...
});
```

## Hovering

The hovering system should allow easy access to the object that is currently under the mouse cursor. There are several events,
that can change the hovered object.

* The mouse position has been updated via the `mousemove` event.
* The viewport has been moved via mouse or key scrolling.
* The objects moved over the map after a new frame has been rendered.

After each of these events, the hovered element should be updated. When displaying UI or map decorations
or when clicking the mous button, the information about the hovered element can easily be used to determine the correct behaviour.
Also, only the function used to update the currently hovered element would need to know about the layer ordering of the application.

General workflow: 
```js
function updateHoveredElement() {
  // Check ui layer.
  
  // Check object layer. Order objects by `zValue`.
  // This should be skipped, when the UI is in build mode.
  
  // Check the map for the hovered tile.
}
```

As soon as a match was found, the function can save the hovered element and return. The result is saved
to `UI_STATE.hoveredElement`. The property has the following structure:

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


