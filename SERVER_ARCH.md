# Server Architecture

The server is responsible for controlling all objects on the map. The player
can only has indirect control.

The server has two main events to make progress in the world simulation.

1.  The user can issue server requests to execute actions on the map, e.g.
    placing a building.
2.  The server has regular ticks, in which the actions of the objects are
    updated, e.g. new paths are computed.

In both cases, the event results in a list of new updates for the client. The
general structure for each job and request is

```js
function handler(context /* specific params */) {
  /* ... */
}
```

The `context` object contains all information about the current world and the
client.

### Requests

Requests are a single unit of work, that can change the application state.

### Server Tick

Right now, each server ticks just updates the jobs of the objects. Each job
scheduler has two required functions.

```js
// jobs/wood.js

export function finish(context, deer) {
  /*
  The object has this job during the last tick.
  Finish it by e.g. increasing the inventory wood counter.
  */
}

export function start(context, deer) {
  /*
  The next tick will be used working on this job.
  Start it, by e.g. calculating a new path.
  */
}
```
