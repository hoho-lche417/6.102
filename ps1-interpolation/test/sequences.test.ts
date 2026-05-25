/**
 * sequences.test.ts
 *
 * Test suite for lerpArray, fillSequence, makeEvenSpacing, interpolate.
 *
 * These tests will be run against OTHER (staff) implementations of these
 * functions, not just your own.  That means:
 *
 *   ✓  Your tests must PASS for any correct implementation of the spec.
 *   ✗  Your tests must FAIL for at least one broken implementation of
 *      the spec (otherwise they aren't finding bugs).
 *
 * Read each spec in src/sequences.ts carefully before writing tests.
 * In particular, note which specs are UNDERDETERMINED — where the spec
 * allows a range of valid outputs.  Your tests must permit that range.
 *
 * TESTING TOOLS
 * ─────────────
 * assertApproxEqual(actual, expected)   — compare floats (tolerance 0.001)
 * assert.deepStrictEqual(actual, expected) — compare Maps or arrays by value
 * assert.throws(() => { ... })          — assert that a call throws an Error
 * assert.strictEqual(actual, expected)  — compare primitives (NOT for floats)
 *
 * WARNING: assert.strictEqual([1,2], [1,2]) FAILS because arrays are compared
 * by reference.  Use assert.deepStrictEqual for arrays and Maps.
 *
 * WARNING: assert.equal uses == (dangerous coercion).  Always use strictEqual
 * or deepStrictEqual.
 */

import assert from 'assert';
import { assertApproxEqual } from '../src/utils';
import { lerpArray, fillSequence, makeEvenSpacing, interpolate } from '../src/sequences';

// ═══════════════════════════════════════════════════════════════════════════════
// lerpArray  (step 2d)
// ═══════════════════════════════════════════════════════════════════════════════

// Testing strategy for lerpArray:
// TODO — fill in your partitions here before writing tests.
//
// Suggested dimensions to consider:
//   – array length: 1 element, multiple elements
//   – t: 0, 1, strictly between 0 and 1
//   – element relationships: a[i] < b[i], a[i] = b[i], a[i] > b[i]

describe('lerpArray', () => {
  // ── Provided example ──────────────────────────────────────────────────────
  it('example: halfway between [0,0] and [10,20]', () => {
    const result = lerpArray([0, 0], [10, 20], 0.5);
    assert.strictEqual(result.length, 2);
    assertApproxEqual(result[0], 5);
    assertApproxEqual(result[1], 10);
  });

  // ── Your tests ────────────────────────────────────────────────────────────

});

// ═══════════════════════════════════════════════════════════════════════════════
// fillSequence  (step 3a)
// ═══════════════════════════════════════════════════════════════════════════════

// Testing strategy for fillSequence:
// TODO
//
// Suggested dimensions:
//   – number of keyframes: exactly 2, more than 2
//   – position of intermediate keyframes: at the boundary, in the middle
//   – steps: 2 (minimum), small number, larger number
//   – verify keyframe values are preserved exactly
//   – verify interpolated values are within tolerance 0.001

describe('fillSequence', () => {
  // ── Provided example ──────────────────────────────────────────────────────
  it('example: two keyframes, linear fill', () => {
    const kf = new Map([[0, 10], [4, 30]]);
    const result = fillSequence(kf, 5);
    // Must have entries for every step 0..4
    assert.strictEqual(result.size, 5);
    assertApproxEqual(result.get(0) ?? NaN, 10, 0.001, 'step 0');
    assertApproxEqual(result.get(4) ?? NaN, 30, 0.001, 'step 4');
    // Step 2 is halfway between keyframes 0 and 4
    assertApproxEqual(result.get(2) ?? NaN, 20, 0.001, 'step 2 interpolated');
  });

  // ── Your tests ────────────────────────────────────────────────────────────
  // Tip: when checking a Map returned by fillSequence, use
  //   assert.deepStrictEqual(result, expectedMap)
  // only when your expectedMap contains values that exactly match (integers).
  // For floating-point values, retrieve them individually and use assertApproxEqual.

});

// ═══════════════════════════════════════════════════════════════════════════════
// makeEvenSpacing  (step 4a)
// ═══════════════════════════════════════════════════════════════════════════════

// Testing strategy for makeEvenSpacing:
// TODO
//
// Suggested dimensions:
//   – count: 1, 2, more
//   – start: 0, non-zero
//   – wrapping: does output wrap around? (start + k*step >= period)
//   – period: small integer, large integer

describe('makeEvenSpacing', () => {
  // ── Provided example ──────────────────────────────────────────────────────
  it('example: 4 evenly spaced values in period 12', () => {
    const result = makeEvenSpacing(0, 4, 12);
    assert.strictEqual(result.length, 4);
    assertApproxEqual(result[0], 0);
    assertApproxEqual(result[1], 3);
    assertApproxEqual(result[2], 6);
    assertApproxEqual(result[3], 9);
  });

  // ── Your tests ────────────────────────────────────────────────────────────

});

// ═══════════════════════════════════════════════════════════════════════════════
// interpolate  (step 5g)
// ═══════════════════════════════════════════════════════════════════════════════

// Testing strategy for interpolate:
// TODO
//
// Suggested dimensions:
//   – t: 0, 1, strictly between 0 and 1
//   – t out of range: t < 0, t > 1 (expect Error)
//   – easing: identity (t => t), constant, extrapolating (t => 2*t)
//   – v0/v1: equal, v0 < v1, v0 > v1
//
// Key requirement: interpolate must throw an Error when t < 0 or t > 1.
// Test this with:
//   assert.throws(() => { interpolate(0, 1, t => t, -0.1); });
//
// IMPORTANT: assert.throws(() => interpolate(0, 1, t => t, -0.1))  — RIGHT
//            assert.throws(interpolate(0, 1, t => t, -0.1))        — WRONG
//            (The second form calls interpolate immediately, not lazily.)

describe('interpolate', () => {
  // ── Provided example ──────────────────────────────────────────────────────
  it('example: identity easing is same as lerp', () => {
    const identity = (t: number): number => t;
    assertApproxEqual(interpolate(0, 100, identity, 0.3), 30);
  });

  // ── Your tests ────────────────────────────────────────────────────────────

});
