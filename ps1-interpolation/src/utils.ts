/**
 * utils.ts
 *
 * Utility functions shared across implementation and test code.
 *
 * If you need a helper function that is used by both implementation code
 * (src/) and test code (test/), put it here and give it a clear TypeDoc
 * spec.  Don't put it directly in the test file — test code must be
 * completely detachable from implementation code.
 *
 * If you need a helper function used only by a single implementation
 * module, put it in that module (unexported).
 * If it grows complex enough to need its own tests, move it here.
 */

import assert from 'assert';

// ─── Provided utilities ───────────────────────────────────────────────────────

/**
 * Assert that two numbers are approximately equal within a tolerance.
 *
 * Use this function whenever a spec allows a floating-point error of up to
 * 0.001.  Do NOT use a different tolerance, and do NOT compare floating-point
 * results with `===` or `strictEqual`.
 *
 * @param actual    value produced by the function under test
 * @param expected  correct value according to the specification
 * @param tolerance allowed absolute difference; defaults to 0.001
 * @param message   optional context shown in the failure message
 * @throws AssertionError if |actual - expected| > tolerance
 */
export function assertApproxEqual(
  actual: number,
  expected: number,
  tolerance = 0.001,
  message?: string
): void {
  const diff = Math.abs(actual - expected);
  assert(
    diff <= tolerance,
    `${message ? message + ': ' : ''}expected ${expected} ± ${tolerance}, got ${actual} (diff = ${diff.toFixed(6)})`
  );
}

// ─── Add your own helpers below ───────────────────────────────────────────────
//
// Give each helper a TypeDoc comment (/** … */) with @param and @returns.
// Write tests for any non-trivial helper in test/utils.test.ts.
