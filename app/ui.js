import * as Constants from "./constants.js";
import context from "./context.js";

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

  context.on("INIT_STORAGE", updateStorageText);
  context.on("UPDATE_STORAGE", updateStorageText);
  context.on("SET_APPLICATION_SIZE", updatePositions);
  context.on("SELECT", updateSelectionDescription);
};

function updatePositions() {
  const { applicationWidth, applicationHeight } = context.getState();

  descriptionText.position.set(
    5,
    applicationHeight - descriptionText.height - 5
  );
}

function updateStorageText() {
  const { storage } = context.getState();

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

  const { selectedElement } = context.getState();
  if (!selectedElement) {
    descriptionText.visible = false;
    return;
  }
  let array = [];
  switch (selectedElement.type) {
    case "deer":
      array = obj2array(context.getState().deers[selectedElement.id]);
      break;
    case "tree":
      array = obj2array(context.getState().trees[selectedElement.id]);
      break;
    case "tile":
      array = obj2array(selectedElement);
      array.push(
        `tileType: ${
          context.getState().map[selectedElement.i][selectedElement.j].type
        }`
      );
      break;
  }

  descriptionText.visible = true;
  descriptionText.text = array.join("\n");
  updatePositions();
}
