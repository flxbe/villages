import * as Constants from "./constants.js";
import State from "./state.js";

const UiContainer = new PIXI.Container();
export default UiContainer;

const textStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 12,
  fill: "white"
});

const helpText = new PIXI.Text(
  "(g) toggle grid    (b) toggle buildmenu    (h) toggle hitboxes",
  textStyle
);

const storageText = new PIXI.Text("", textStyle);
const descriptionText = new PIXI.Text("", textStyle);

const houseButton = createButton("0x561f00", "house");
const barnButton = createButton("0x450e00", "barn");
const roadButton = createButton("0x999999", "road");

UiContainer.init = function() {
  UiContainer.addChild(helpText);
  helpText.position.set(100, 10);

  UiContainer.addChild(storageText);
  storageText.position.set(10, 10);

  UiContainer.addChild(descriptionText);

  UiContainer.addChild(houseButton);
  UiContainer.addChild(barnButton);
  UiContainer.addChild(roadButton);

  updatePositions();
  updateStorageText();
  updateSelectionDescription();

  State.on("UPDATE_STORAGE", updateStorageText);
  State.on("SET_APPLICATION_SIZE", updatePositions);
  State.on("SELECT", updateSelectionDescription);
};

function updatePositions() {
  const { applicationWidth, applicationHeight } = State.get();

  houseButton.position.set(
    applicationWidth - Constants.BUILDMENU_TILESIZE - 10,
    10
  );
  barnButton.position.set(
    applicationWidth - Constants.BUILDMENU_TILESIZE - 10,
    20 + Constants.BUILDMENU_TILESIZE
  );
  roadButton.position.set(
    applicationWidth - Constants.BUILDMENU_TILESIZE - 10,
    30 + 2 * Constants.BUILDMENU_TILESIZE
  );

  descriptionText.position.set(
    5,
    applicationHeight - descriptionText.height - 5
  );
}

function updateStorageText() {
  const { storage } = State.get();

  storageText.text = [
    "Storage",
    `Food: ${storage.food}`,
    `Wood: ${storage.wood}`
  ].join("\n");
}

function updateSelectionDescription() {
  function obj2array(obj) {
    const array = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        array.push(`${p}: ${obj[p]} `);
      }
    }
    return array;
  }

  const { selectedElement } = State.get();
  if (!selectedElement) {
    descriptionText.visible = false;
    return;
  }
  let array = [];
  switch (selectedElement.type) {
    case "deer":
      array = obj2array(State.get().deers[selectedElement.id]);
      break;
    case "tree":
      array = obj2array(State.get().trees[selectedElement.id]);
      break;
    case "tile":
      array = obj2array(selectedElement);
      array.push(
        `tileType: ${
          State.get().map[selectedElement.i][selectedElement.j].type
        }`
      );
      break;
  }

  descriptionText.visible = true;
  descriptionText.text = array.join("\n");
  updatePositions();
}

// menu buttons, just tmp
function createButton(color, blueprintName) {
  const button = new PIXI.Graphics();
  button.hitArea = new PIXI.Rectangle(
    0,
    0,
    Constants.BUILDMENU_TILESIZE,
    Constants.BUILDMENU_TILESIZE
  );
  button.interactive = true;

  button.on("click", event => {
    State.update({ type: "ENTER_BUILD_MODE", blueprintName });
    event.stopPropagation();
  });

  button.on("mousemove", event => {
    State.update({
      type: "HOVER",
      element: { type: "button", tooltip: blueprintName }
    });
    event.stopPropagation();
  });

  renderBuildmenuTile(button, color, 0, 0);

  return button;
}

function renderBuildmenuTile(target, color, x, y) {
  target.beginFill(color);
  target.lineStyle(1, "0x000000", 1);
  target.moveTo(x, y);
  target.lineTo(x + Constants.BUILDMENU_TILESIZE, y);
  target.lineTo(
    x + Constants.BUILDMENU_TILESIZE,
    y + Constants.BUILDMENU_TILESIZE
  );
  target.lineTo(x, y + Constants.BUILDMENU_TILESIZE);
  target.lineTo(x, y);
  target.endFill();
}
