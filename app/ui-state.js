import Map from "./map.js";

const UiState = {
  mode: "normal",

  // build mode
  blueprintName: null,

  // debug options
  grid: false,
  renderHitAreas: false,

  // camera
  offsetX: 200,
  offsetY: 200,

  // mouse state
  mouseIsoX: 0,
  mouseIsoY: 0,
  clickStartX: 0,
  clickStartY: 0,
  leftMouseDown: false,
  rightMouseDown: false,
  hoveredElement: null,
  selection: null,

  ctrlDown: false
};

export default UiState;

UiState.reset = function () {
  UiState.setMode("normal");
  UiState.selection = null;
};

UiState.setMode = function (mode, options) {
  if (UiState.mode === mode) return;

  switch (mode) {
    case "normal":
      UiState.mode = "normal";
      UiState.blueprintName = null;
      Map.objects.interactiveChildren = true;
      break;
    case "build":
      UiState.mode = "build";
      UiState.selection = null;
      Map.objects.interactiveChildren = false;
      break;
  }
};

UiState.setBlueprint = function (blueprintName) {
  if (UiState.mode !== "build") throw Error("setting blueprint only allowed in build mode");

  UiState.blueprintName = blueprintName;
};
