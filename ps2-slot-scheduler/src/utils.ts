/**
 * utils.ts
 *
 * Utilities shared across implementation and test code.
 *
 * If you want a helper function or class of any complexity, place it here and
 * write tests for it in test/utils.test.ts.
 *
 * Simple private helpers used by only one implementation file may stay in that
 * file (unexported), but then you cannot test them directly — they must be
 * small and covered by the public-method tests.
 *
 * Do NOT call helpers from test/utils.test.ts that live in src/*.ts
 * (other than utils.ts), because test code must remain detachable from
 * implementation code when the autograder swaps in a different implementation.
 */

import assert from 'assert';
import {Slot} from './schedule';

// ─── Provided utilities ───────────────────────────────────────────────────────

/**
 * Assert that two numbers are approximately equal within a tolerance.
 *
 * Use this for any floating-point result where the spec allows ± 0.001.
 *
 * @param actual    value produced by the function under test
 * @param expected  correct value according to the spec
 * @param tolerance allowed absolute error; defaults to 0.001
 * @param message   optional context shown on failure
 * @throws AssertionError if |actual − expected| > tolerance
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
    `${message ? message + ': ' : ''}expected ${expected} ± ${tolerance}, got ${actual}`
  );
}

// ─── Your helpers below ───────────────────────────────────────────────────────
//
// Example of the kind of thing to put here:
//
// /**
//  * Returns true iff two slots have the same start and end.
//  * ...
//  */
export function slotsEqual(a: Slot, b: Slot): boolean {
  return a.start == b.start && a.end == b.end;
}
