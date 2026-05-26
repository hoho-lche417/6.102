/**
 * curves.test.ts
 *
 * Test suite for polyEval and polySample (step 6a).
 *
 * You are testing YOUR OWN strengthened specs, not the vague provided specs.
 * Write your tests AFTER you have written your new specs in src/curves.ts.
 *
 * A good test suite for polyEval and polySample:
 *   – documents a partitioning strategy comment at the top of each section
 *   – covers the boundary cases at t=0 and t=1
 *   – covers different numbers of control points (1, 2, 3+)
 *   – tests that polyEval and polySample throw for t outside [0,1]
 *   – tests the default behavior when numSamples is undefined (your spec
 *     must define this — your tests must reflect that definition)
 *   – tests the length and values of the polySample result
 *
 * Remember:
 *   Use assertApproxEqual for floating-point comparisons (tolerance 0.001).
 *   Use assert.throws(() => { ... }) for expected errors.
 */

import assert from 'assert';
import { assertApproxEqual } from '../src/utils';
import { polyEval, polySample } from '../src/curves';

// ═══════════════════════════════════════════════════════════════════════════════
// polyEval
// ═══════════════════════════════════════════════════════════════════════════════

// Testing strategy for polyEval:
//   Partition on controlPoints.length: 1, 2, > 2
//   Partition on t: t = 0, t = 1, 0 <= t <= 1
describe('polyEval', () => {
  // ── Provided examples ─────────────────────────────────────────────────────
  it('example: 2 control points at t=0.5 is midpoint', () => {
    assertApproxEqual(polyEval([0, 10] as [number, number], 0.5), 5);
  });

  it('example: at t=0 returns first control point', () => {
    // True for any number of control points — verify your spec states this
    assertApproxEqual(polyEval([7, 3, 9] as [number, ...number[]], 0), 7);
  });

  it('example: at t=1 returns last control point', () => {
    assertApproxEqual(polyEval([7, 3, 9] as [number, ...number[]], 1), 9);
  });

  it('example: throws for t < 0', () => {
    assert.throws(() => { polyEval([0, 10] as [number, number], -0.1); });
  });

  // ── Your tests ────────────────────────────────────────────────────────────
  it('one control points', () => {
    assertApproxEqual(polyEval([3] as [number], 0.5), 3);
  });

  it('five control points', () => {
    assertApproxEqual(polyEval([3, 4, 5, 6, 7], 0.5), 5);
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// polySample
// ═══════════════════════════════════════════════════════════════════════════════

// Testing strategy for polySample:
//   Partition on numSample: default (1), numberSample >= 1
//   Partition on controlPoints.length: 1, >= 1

describe('polySample', () => {
  // ── Provided example ──────────────────────────────────────────────────────
  it('example: n=3 samples a linear curve at t=0, 0.5, 1', () => {
    // polyEval([0, 10], 0) = 0; polyEval([0, 10], 0.5) = 5; polyEval([0, 10], 1) = 10
    const result = polySample([0, 10], 3);
    assert.strictEqual(result.length, 3);
    assertApproxEqual(result[0], 0);
    assertApproxEqual(result[1], 5);
    assertApproxEqual(result[2], 10);
  });

  // ── Your tests ────────────────────────────────────────────────────────────
  it('one samples for length 1', () => {
    const result = polySample([6], undefined);
    assert.strictEqual(result.length, 1);
    assertApproxEqual(result[0], 6);
  });

  it('one samples for length 3', () => {
    const result = polySample([3, 5 ,7], undefined);
    assert.strictEqual(result.length, 1);
    assertApproxEqual(result[0], 5);
  });

});
