# GUI

## Widget System

The GUI is built using reusable widgets. The base widget and all specialized
components are defined in `./app/src/html-gui/`. Componets can be nested to
create more complex forms. This will usually include using an instance of
`Window`.

To be actually visisble, a widget must be mounted to the DOM. This is done by the
`Compositor`. It is mounted to a DOM node and inserts new widgets as children.

## Creating A New Widget

A new widget can be created using the `Widget` base class.

```js
class MyWidget extends Widget {
  constructor() {
    super("Widget Name", {
      /* options */
    });
  }
}
```

Every widget required a name that is used for more debug messages. Additionaly,
it can be customized using the following options:

* `isContainer`: (optional, default: `false`) If true, this widget can contain child
  widgets.
* `node`: (optional) The DOM node used as the DOM root of the widget. If this
  is `undefined`, a new node will be created.
* `element`: (optional, default: `"div"`) The DOM node, that will be created as
  the widget`s root DOM node.

Each widget has a root DOM node, that will represent it in the DOM tree after
being mounted. If not explicitly provided in the constructor, a new node will
be created. A widget can then modify this or add children.

The widget can use the usual subscription pattern to update itself after
relevant state changes.

### Widget Lifecycle

#### Constructor

The constructor should only be used to create and add other widgets.
All interactions with the state (subscriptions, ...) should be delayed
until the widget is mounted.

#### `onDidMount`

This is called after the widget was added to the DOM.
If a widget is added to a parent, which is not yet on the DOM, the method
will not be called. After adding the root widget to the DOM, the event is
propagated to all children.

This hook should be used to subscribe to DOM input events and state
changes. The initial widget state like should also be loaded here.

#### `onDidUnmount`

This is called after a mounted widget is removed from its parent or if the
root widget is removed from the DOM.

This hook should be used to unsubscribe from all events.

### Creating New Windows

When creating a subclass of `Window`, the parent lifecycle methods should be
called before doing anything else.

```js
class MyWindow extends Window {
  onDidMount() {
    super.onDidMount();
    //...
  }

  onDidUnmount() {
    super.onDidUnmount();
    // ...
  }
}
```
