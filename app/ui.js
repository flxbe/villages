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

UiContainer.init = function() {
  UiContainer.addChild(helpText);
  helpText.position.set(100, 10);

  UiContainer.addChild(storageText);
  storageText.position.set(10, 10);

  UiContainer.addChild(descriptionText);

  updatePositions();
  updateStorageText();
  updateSelectionDescription();

  State.on("UPDATE_STORAGE", updateStorageText);
  State.on("SET_APPLICATION_SIZE", updatePositions);
  State.on("SELECT", updateSelectionDescription);
};

function updatePositions() {
  const { applicationWidth, applicationHeight } = State.get();

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
