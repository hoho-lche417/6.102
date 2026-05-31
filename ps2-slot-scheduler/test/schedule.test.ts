/**
 * schedule.test.ts
 *
 * Tests for the Schedule<Task> ADT.  Problems 1, 2.3.
 *
 * ─── How this file works ────────────────────────────────────────────────────
 *
 * The loop at the top runs your ENTIRE test suite against each implementation
 * returned by implementationsForTesting().  You must not change it.
 *
 * Inside the loop, use `new SomeSchedule<string>()` to get a fresh empty
 * Schedule<string>.  Do NOT call a specific constructor like
 * `new RepMapSchedule<string>()`.
 *
 * ─── Legal clients ──────────────────────────────────────────────────────────
 *
 * Your tests will be run against OTHER correct implementations of Schedule,
 * not just your own.  They must:
 *   ✓  Pass for any correct implementation of the spec.
 *   ✗  Fail for at least one broken implementation (they must find bugs).
 *   ✓  Respect all preconditions (no illegal inputs).
 *   ✓  Not assume anything beyond what the spec guarantees (e.g. do NOT test
 *      the exact format of toString()).
 *
 * ─── Partitioning ───────────────────────────────────────────────────────────
 *
 * Write a testing strategy comment at the top of each describe block.
 * Partition the state of `this` as well as method inputs.
 *
 * For Schedule methods, useful partitions include:
 *   – state of this: empty, one task, multiple tasks
 *   – task: present in this, absent from this
 *   – overlap: new slot doesn't overlap, overlaps an existing slot
 *   – re-add: same task same slot (idempotent), same task different slot (error),
 *             different task overlapping slot (error)
 *
 * ─── assert.throws ──────────────────────────────────────────────────────────
 *
 * To test that add() throws ScheduleConflictError:
 *
 *   assert.throws(
 *     () => { s.add('B', 100, 200); },
 *     ScheduleConflictError          // checks the error CLASS, not an instance
 *   );
 *
 * NOT:  assert.throws(s.add('B', 100, 200), ...)   ← calls add() immediately
 * NOT:  assert.throws(s.add('B', 100, 200), new ScheduleConflictError())
 */

import assert from 'assert';
import { ScheduleConflictError, Slot } from '../src/schedule';
import { implementationsForTesting, ScheduleCtor } from '../src/schedule-impls';

// ─── Multi-implementation test harness ────────────────────────────────────────
// Do NOT change this loop.
for (const [name, SomeSchedule] of implementationsForTesting()) {
  runScheduleTests(name, SomeSchedule);
}

function runScheduleTests(name: string, SomeSchedule: ScheduleCtor): void {

  // ── Testing strategy ───────────────────────────────────────────────────────
  // TODO: Write your partitioning strategy here before writing test cases.
  //
  // Testing strategy for Schedule:
  //   Partition on this.size(): 0, 1, >1
  //   Partition on add(task): conflict, no conflict
  //   Partition on remove(task): task exists, not exists
  //   Partition on has(task): task exists, not exists
  //   Partition on slot(task): task exists, not exists

  describe(`Schedule — ${name}`, () => {

    // ── Provided example test (read then discard and write your own) ─────────
    it('example: fresh schedule is empty', () => {
      const s = new SomeSchedule<string>();
      assert.strictEqual(s.size(), 0);
      assert.deepStrictEqual(s.tasks(), new Set());
      assert.strictEqual(s.has('anything'), false);
    });

    it('example: add one task', () => {
      const s = new SomeSchedule<string>();
      s.add('Lecture', 540, 630);
      assert.strictEqual(s.size(), 1);
      assert.strictEqual(s.has('Lecture'), true);
      const slot = s.slot('Lecture');
      assert.ok(slot !== undefined);
      assert.strictEqual(slot.start, 540);
      assert.strictEqual(slot.end, 630);
    });

    it('example: add throws ScheduleConflictError on overlapping slot', () => {
      const s = new SomeSchedule<string>();
      s.add('A', 100, 200);
      assert.throws(
        () => { s.add('B', 150, 250); },
        ScheduleConflictError
      );
    });

    it('example: add is idempotent for same task same slot', () => {
      const s = new SomeSchedule<string>();
      s.add('A', 100, 200);
      s.add('A', 100, 200);   // same task, same slot — no error
      assert.strictEqual(s.size(), 1);
    });

    // ── Your tests go here ───────────────────────────────────────────────────
    it('add three tasks with conflict not due to slot', () => {
      const s = new SomeSchedule<string>();
      s.add('Lecture1', 10, 50);
      s.add('Lecture2', 70, 110);
      s.add('Lecture3', 110, 170); // adjacent slot
      assert.throws(
        () => { s.add('Lecture1', 210, 250); },
        ScheduleConflictError
      );
      assert.strictEqual(s.size(), 3);
      assert.strictEqual(s.has('Lecture1'), true);
      const slot = s.slot('Lecture1');
      assert.ok(slot !== undefined);
      assert.strictEqual(slot.start, 10);
      assert.strictEqual(slot.end, 50);
      const slot2 = s.slot('Lecture4');
      assert.ok(slot2 === undefined);
    });

    it('remove tasks from schedule', () => {
      const s = new SomeSchedule<string>();
      s.add('Lecture1', 10, 50);
      s.add('Lecture2', 70, 110);
      s.add('Lecture3', 130, 170);
      s.remove('Lecture1');
      s.remove('Lecture4'); // no effect
      assert.strictEqual(s.size(), 2);
      assert.strictEqual(s.has('Lecture2'), true);
      assert.strictEqual(s.has('Lecture3'), true);      
      assert.strictEqual(s.has('Lecture1'), false);
    });


    // Coverage checklist — make sure you have tests for:
    //   [ ] add: task not present, no conflict → task added
    //   [ ] add: same task same slot → idempotent (size unchanged)
    //   [ ] add: same task different slot → ScheduleConflictError
    //   [ ] add: different task, slot overlaps existing → ScheduleConflictError
    //   [ ] add: adjacent slots (non-overlapping) → both succeed
    //   [ ] remove: task present → removed
    //   [ ] remove: task not present → no-op
    //   [ ] remove: removes from middle of multi-task schedule
    //   [ ] has: present, absent
    //   [ ] slot: present, absent (→ undefined)
    //   [ ] tasks: empty, one, many; fresh snapshot
    //   [ ] size: 0, 1, many; increases on add, decreases on remove

  });

  // ── Problem 2.3: tests with non-string labels ──────────────────────────────
  //
  // String labels might accidentally pass tests that rely on toString()
  // comparisons.  Once you've made your implementations generic, add tests
  // here that use a label type whose toString() is not useful for identifying
  // distinct values — for example, object labels like `{id: 1}` and `{id: 2}`
  // which both have toString() === "[object Object]".
  //
  // Remove the skip prefix to enable these tests (Problem 2.3):

  describe(`Schedule — ${name} — non-string labels`, () => {

    it('example: two distinct object labels are separate tasks', () => {
      const s = new SomeSchedule<object>();
      const taskA = { id: 1 };
      const taskB = { id: 2 };
      s.add(taskA, 100, 200);
      s.add(taskB, 300, 400);
      assert.strictEqual(s.size(), 2);
      assert.strictEqual(s.has(taskA), true);
      assert.strictEqual(s.has(taskB), true);
    });

    // Add more non-string-label tests here...

  });
}
