/**
 * lerp.test.ts
 *
 * Test suite for lerpWeak and lerpStrong.
 *
 * STRUCTURE
 * ─────────
 * Section 1  Tests for lerpWeak   (step 2b)
 * Section 2  Tests for lerpStrong (step 5d)
 *
 * HOW TO WRITE TESTS (read this before writing anything)
 * ───────────────────────────────────────────────────────
 * 1. At the top of each section, write a testing strategy comment that lists
 *    the partitions you chose.  Example format:
 *
 *      // Testing strategy for lerpWeak:
 *      //   Partition on t: t=0, t=1, 0 < t < 1
 *      //   Partition on a, b: a < b, a = b, a > b
 *      //   ...
 *
 * 2. Write one it() per partition subcase.  Keep each test small.
 *
 * 3. Use assertApproxEqual for floating-point results (tolerance 0.001).
 *
 * 4. Your tests must be LEGAL CLIENTS of the spec you are testing.
 *    – For lerpWeak: only test inputs/outputs your weak spec actually
 *      guarantees.  If your spec only guarantees t ∈ [0,1], don't test t=2.
 *    – For lerpStrong: test the full range your strong spec guarantees.
 *
 * 5. These test suites should be SMALL — lerp is a simple function.
 *    A good lerpWeak suite has 3–5 tests.  A good lerpStrong suite has 4–7.
 *
 * 6. Use `npm test -- -f 'lerpWeak'` to run only the lerpWeak tests.
 */

import assert from 'assert';
import { assertApproxEqual } from '../src/utils';
import { lerpWeak, lerpStrong } from '../src/lerp';

// ═══════════════════════════════════════════════════════════════════════════════
// Section 1 — lerpWeak  (step 2b)
// ═══════════════════════════════════════════════════════════════════════════════

// Testing strategy for lerpWeak:
//   Partition on t: t = 0, t = 1, 0 < t < 1
//   Partition on a, b: a < b, a = b, a > b
describe('lerpWeak', () => {
  // ── Provided example test ─────────────────────────────────────────────────
  // You may read and then discard this example; write your own tests instead.
  it('example: halfway between 0 and 10 is 5', () => {
    assertApproxEqual(lerpWeak(0, 10, 0.5), 5);
  });

  // ── Your tests go here ────────────────────────────────────────────────────
  // Remember: only test what your lerpWeak spec actually guarantees.
  it('t = 0 returns first value for a > b', () => {
    assertApproxEqual(lerpWeak(7, 1, 0), 7);
  });

  it('t = 1 returns second value for a < b', () => {
    assertApproxEqual(lerpWeak(5, 70, 1), 70);
  });

  it('t = 0.75 for a < b', () => {
    assertApproxEqual(lerpWeak(-2.5, 7.5, 0.75), 5);
  });

  it('t = 0.25 for a = b', () => {
    assertApproxEqual(lerpWeak(9, 9, 0.25), 9);
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// Section 2 — lerpStrong  (step 5d)
// ═══════════════════════════════════════════════════════════════════════════════

// Testing strategy for lerpWeak:
//   Partition on t: t = 0, t = 1, 0 < t < 1
//   Partition on a, b: a < b, a = b, a > b

describe('lerpStrong', () => {
  // ── Provided example test ─────────────────────────────────────────────────
  it('example: t=0 returns first value', () => {
    assertApproxEqual(lerpStrong(3, 7, 0), 3);
  });

  // ── Your tests go here ────────────────────────────────────────────────────
  // lerpStrong must be tested over its full guaranteed range.
  // Does your strong spec allow t outside [0, 1]?  If so, test that!

  it('t = 1 returns second value for a > b', () => {
    assertApproxEqual(lerpStrong(75, 20, 1), 20);
  });

  it('t = 0.75 for a < b', () => {
    assertApproxEqual(lerpStrong(-2.5, 7.5, 0.75), 5);
  });

  it('t = 0.25 for a = b', () => {
    assertApproxEqual(lerpStrong(9, 9, 0.25), 9);
  });

  it('t = -1 for a > b', () => {
    assertApproxEqual(lerpStrong(6, 1, -1), 11);
  });

  it('t = 2 for a < b', () => {
    assertApproxEqual(lerpStrong(5, 10, 2), 15);
  });

});
