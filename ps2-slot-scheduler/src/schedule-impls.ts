/**
 * schedule-impls.ts
 *
 * Two concrete implementations of the Schedule<Task> interface.
 *
 * Problems 2 and 3.
 *
 * For EVERY class you write in this problem set:
 *   ✓  Document the abstraction function (AF) near the fields.
 *   ✓  Document the representation invariant (RI) near the fields.
 *   ✓  Document safety from rep exposure (SRE) near the fields.
 *   ✓  Implement checkRep() — call it at the start and end of every mutator,
 *      and at the start of every observer (but not inside checkRep itself).
 *   ✓  Implement toString() with a useful human-readable abstract value.
 *   ✓  Use @inheritdoc on methods that inherit their spec from Schedule<Task>.
 *
 * You may NOT add fields to either rep.
 * You may NOT export anything new from this file (except via the functions
 * already listed at the bottom).
 * You MAY add private helper methods.
 * Any complex helper you want to test must go in utils.ts.
 *
 * noUncheckedIndexedAccess is enabled in tsconfig.json.
 * This means array[i] has type T | undefined.
 * Handle that: use non-null assertions (array[i]!) only when the RI
 * guarantees the element is present; otherwise use if/guards.
 */

import { Schedule, Slot, ScheduleConflictError } from './schedule';

// ═══════════════════════════════════════════════════════════════════════════════
// Problem 2.1 → 2.2: RepMapSchedule<Task>
// ═══════════════════════════════════════════════════════════════════════════════

export class RepMapSchedule<Task> implements Schedule<Task> {

  //
  // Rep
  // ───
  // You MUST use these two fields and MUST NOT add more.
  // You MUST use the names startMap and endMap.
  //
  private readonly startMap: Map<Task, number> = new Map();
  //                         task  → start minute
  private readonly endMap: Map<number, number> = new Map();
  //                        start → end minute

  // ── Abstraction Function ───────────────────────────────────────────────────
  //
  // TODO (Problem 2.2): Write the AF here in 2–4 lines.
  //
  // AF(startMap, endMap) = ???
  //
  // Hint: what abstract value do startMap and endMap together represent?
  //       Describe it in terms of the Schedule ADT (tasks and slots).

  // ── Representation Invariant ───────────────────────────────────────────────
  //
  // TODO (Problem 2.1–2.2): Write the RI here, as a list of conditions.
  //
  // RI:
  //   1. ???   (consistency between startMap and endMap sizes)
  //   2. ???   (every start key in endMap corresponds to a task in startMap)
  //   3. ???   (valid slot range: 0 ≤ start < end ≤ 1440)
  //   4. ???   (no two tasks have overlapping slots)
  //
  // Hint: two slots [a,b) and [c,d) overlap iff a < d AND c < b.

  // ── Safety from Rep Exposure ───────────────────────────────────────────────
  //
  // TODO: Explain here why this class is safe from rep exposure.
  //
  // SRE: ???

  /**
   * Create an empty schedule.
   */
  public constructor() {
    this.checkRep();
  }

  // ── checkRep ──────────────────────────────────────────────────────────────

  /**
   * Check that the rep invariant holds.
   * @throws Error if the RI is violated
   */
  private checkRep(): void {
    // TODO (Problem 2.1): implement this.
    // Check every condition in your RI.
    // Throw an Error (not an assertion error) with a descriptive message if violated.
    throw new Error('implement me!');
  }

  // ── Schedule<Task> methods ────────────────────────────────────────────────

  /** @inheritdoc */
  public add(task: Task, start: number, end: number): void {
    // TODO: call checkRep() at the start and end of this method.
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public remove(task: Task): void {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public has(task: Task): boolean {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public slot(task: Task): Slot | undefined {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public tasks(): ReadonlySet<Task> {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public size(): number {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public toString(): string {
    // TODO: return a human-readable string like "Schedule { A=[540,630), B=[720,780) }"
    throw new Error('implement me!');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Problem 3.1: RepArraySchedule<Task>
// ═══════════════════════════════════════════════════════════════════════════════

export class RepArraySchedule<Task> implements Schedule<Task> {

  //
  // Rep
  // ───
  // You MUST use these two fields and MUST NOT add more.
  // You MUST use the names taskList and timeList.
  //
  // timeList stores slots interleaved: [start₀, end₀, start₁, end₁, …]
  // so slot for task i is [timeList[2i], timeList[2i+1]).
  //
  private readonly taskList: Array<Task>   = [];
  private readonly timeList: Array<number> = [];

  // ── Abstraction Function ───────────────────────────────────────────────────
  //
  // TODO (Problem 3.1): Write the AF here.
  //
  // AF(taskList, timeList) = ???

  // ── Representation Invariant ───────────────────────────────────────────────
  //
  // TODO: Write the RI here.
  //
  // RI:
  //   1. timeList.length === 2 * taskList.length
  //   2. ???   (valid slot range for each i)
  //   3. ???   (all tasks distinct)
  //   4. ???   (no two slots overlap)
  //
  // Note: unlike RepMapSchedule, you are NOT required to keep tasks in sorted
  // order — but you may choose to do so.  Document your choice clearly.

  // ── Safety from Rep Exposure ───────────────────────────────────────────────
  //
  // TODO: Explain here why this class is safe from rep exposure.
  //
  // SRE: ???

  /**
   * Create an empty schedule.
   */
  public constructor() {
    this.checkRep();
  }

  // ── checkRep ──────────────────────────────────────────────────────────────

  private checkRep(): void {
    // TODO (Problem 3.1): implement this.
    throw new Error('implement me!');
  }

  // ── Schedule<Task> methods ────────────────────────────────────════════════

  /** @inheritdoc */
  public add(task: Task, start: number, end: number): void {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public remove(task: Task): void {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public has(task: Task): boolean {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public slot(task: Task): Slot | undefined {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public tasks(): ReadonlySet<Task> {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public size(): number {
    throw new Error('implement me!');
  }

  /** @inheritdoc */
  public toString(): string {
    throw new Error('implement me!');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Testing infrastructure
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * A constructor for Schedule<Task> that takes no arguments.
 *
 * This type exists so that test code can obtain fresh empty Schedule instances
 * without depending on any specific implementation class.
 *
 * Problem 2.3: After making RepMapSchedule generic, remove the commented-out
 * line below (the one labelled "Problem 2.1 line") and uncomment the
 * "Problem 2.3 line" immediately below it.
 */
export type ScheduleCtor = new <Task>() => Schedule<Task>;

/**
 * Returns the implementations that should be tested by the test suite.
 *
 * Do NOT change this function.
 */
export function implementationsForTesting(): Array<[string, ScheduleCtor]> {
  return [
    // Problem 2.1 line — remove this after making RepMapSchedule generic:
    ['RepMapSchedule', RepMapSchedule as unknown as ScheduleCtor],
    // Problem 3.1 line — uncomment this once RepArraySchedule is complete:
    // ['RepArraySchedule', RepArraySchedule as unknown as ScheduleCtor],
  ];
}
