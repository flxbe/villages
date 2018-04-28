export function intToPx(n) {
  if (!Number.isInteger(n)) {
    throw new Error("'n' must be an integer.");
  }

  return `${n}px`;
}

export function pxToInt(px) {
  return Number.parseInt(px.slice(0, -2));
}
