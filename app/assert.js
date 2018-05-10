export default function assert(condition, message) {
  console.assert(condition, message);
}

export function isNumber(n) {
  return typeof n === "number";
}

export function assertNumber(n) {
  assert(isNumber(n), `${n} is not a number.`);
}

export function isInteger(n) {
  return Number.isInteger(n);
}

export function assertInteger(n) {
  assert(isInteger(n), `${n} is not an integer.`);
}

export function isArray(a) {
  return Array.isArray(a);
}

export function assertArray(a, l) {
  assert(isArray(a), `${a} is not an array`);
  if (l) {
    assert(
      a.length === l,
      `Array should have length ${l}, got ${a.length} instead.`
    );
  }
}

export function assertInstance(o, i) {
  assert(o instanceof i, `${o} is not an instance of type ${i}`);
}
