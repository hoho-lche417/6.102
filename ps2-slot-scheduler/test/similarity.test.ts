/**
 * similarity.test.ts
 *
 * Tests for similarity() and your helper ADT.  Problems 5.1 and 5.2.
 *
 * ─── Partitioning for similarity ────────────────────────────────────────────
 *
 * Useful partitions:
 *   – both schedules empty → 0
 *   – one schedule empty, one non-empty → 0
 *   – identical schedules (same tasks, same slots) → 1
 *   – same slots, different tasks, taskSim = 0 → 0
 *   – same slots, different tasks, taskSim > 0 → fraction
 *   – partially overlapping spans
 *   – taskSim: empty list, one pair, same pair appearing twice (last wins)
 *   – tasks that don't appear in taskSim → similarity 0 unless ===
 *   – multiple days contributing to the result
 *
 * ─── Precision ───────────────────────────────────────────────────────────────
 *
 * The spec allows ± 0.001.  Use assertApproxEqual (from utils.ts) for all
 * similarity result comparisons.
 */

import assert from 'assert';
import { assertApproxEqual } from '../src/utils';
import { WeeklySchedule } from '../src/weekly-schedule';
import { similarity } from '../src/similarity';

// Testing strategy for similarity:
// TODO — write your partitions here

describe('similarity', () => {

  // ── Provided examples ─────────────────────────────────────────────────────
  it('example: both empty → 0', () => {
    const w1 = new WeeklySchedule<string>();
    const w2 = new WeeklySchedule<string>();
    assertApproxEqual(similarity(w1, w2, []), 0);
  });

  it('example: identical schedules → 1', () => {
    const w1 = new WeeklySchedule<string>();
    const w2 = new WeeklySchedule<string>();
    w1.add('A', 0, 100, 200);
    w2.add('A', 0, 100, 200);
    assertApproxEqual(similarity(w1, w2, []), 1);
  });

  it('example: same slot, different tasks, no taskSim entry → 0', () => {
    const w1 = new WeeklySchedule<string>();
    const w2 = new WeeklySchedule<string>();
    w1.add('A', 0, 100, 200);
    w2.add('B', 0, 100, 200);
    assertApproxEqual(similarity(w1, w2, []), 0);
  });

  it('example: same slot, different tasks, taskSim = 0.5', () => {
    const w1 = new WeeklySchedule<string>();
    const w2 = new WeeklySchedule<string>();
    w1.add('A', 0, 0, 100);
    w2.add('B', 0, 0, 100);
    // All 100 minutes: sim(A,B) = 0.5 each → total 50 / 100 = 0.5
    assertApproxEqual(similarity(w1, w2, [['A', 'B', 0.5]]), 0.5);
  });

  // ── Your tests go here ────────────────────────────────────────────────────

});

// ─── Tests for your helper ADT ────────────────────────────────────────────────
//
// Write a describe block here for each class you define in similarity.ts.
// Include a testing strategy comment.
//
// Example skeleton:
//
// describe('MyHelperADT', () => {
//   // Testing strategy: ...
//   it('...', () => { ... });
// });
