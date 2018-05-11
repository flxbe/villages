/**
 * Tooltip UI layer.
 *
 * Simple layer that shows tooltips over the hovered element.
 */
import context from "./context.js";

const TooltipLayer = new PIXI.Container();
export default TooltipLayer;

const tooltipText = new PIXI.Text("", {
  fontFamily: "Arial",
  fontSize: 12,
  fill: "white"
});

TooltipLayer.init = function() {
  TooltipLayer.addChild(tooltipText);

  context.on("UPDATE_MOSE_POSITION", updatePosition);
  context.on("HOVER", updateText);
};

function updatePosition() {
  const { mouseIsoX, mouseIsoY } = context.get();

  tooltipText.position.x = mouseIsoX;
  tooltipText.position.y = mouseIsoY + 20;
}

function updateText() {
  const { hoveredElement } = context.get();

  if (hoveredElement && hoveredElement.tooltip) {
    TooltipLayer.visible = true;
    tooltipText.text = hoveredElement.tooltip;
  } else {
    TooltipLayer.visible = false;
  }
}
