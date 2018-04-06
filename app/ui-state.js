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

  ctrlDown: false,
  
  currentMusicTitle: null
};

export default UiState;

UiState.reset = function() {
  UiState.setMode("normal");
  UiState.selection = null;
};

UiState.setMode = function(mode, options) {
  if (UiState.mode === mode) return;

  switch (mode) {
    case "normal":
      UiState.mode = "normal";
      UiState.blueprintName = null;
      break;
    case "build":
      UiState.mode = "build";
      UiState.blueprintName = options.blueprintName;
      UiState.selection = null;
      break;
  }
};
