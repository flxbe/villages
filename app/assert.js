export default function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION_ERROR: ${message}`);
  }
}

export function isNumber(n) {
  return typeof n === "number";
}

export function assertNumber(n) {
  assert(isNumber(n), "Argument is not a number.");
}

export function isInteger(n) {
  return Number.isInteger(n);
}

export function assertInteger(n) {
  assert(isInteger(n), "Argument is not an integer.");
}

export function isArray(a) {
  return Array.isArray(a);
}

export function assertArray(a, l) {
  assert(isArray(a), `${a} is not an array`);
  if (l) {
    assertInteger(l);
    assert(
      a.length === l,
      `Array should have the length ${l}, got ${a.length} instead.`
    );
  }
}

export function assertInstance(o, i) {
  assert(o instanceof i, `${o} is not an instance of type ${i}`);
}
