import test, { describe } from "node:test";
import { strict as assert } from "node:assert";

import { average, square } from "../utils/for_testing.js";

describe("average", () => {
  test("of one value is the value itself ", () => {
    assert.strictEqual(average([1]), 1);
  });

  test("of many is calculated right", () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5);
  });

  test("of empty array is zero", () => {
    assert.strictEqual(average([]), 0);
  });
});

describe("square", () => {
  test("square of 2 is 4", () => {
    assert.strictEqual(square(2), 4);
  });

  test("square of 4 is 16", () => {
    assert.strictEqual(square(4), 16);
  });
});
