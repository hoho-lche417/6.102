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

import { deepEqual } from 'assert';
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
  // For the key, which is the task, in startMap, the value corresponds to the 
  // start minute of its slot, and the end minute of the slot can be obtained
  // from the value of endMap, where the key is the start minute.
  // 
  // AF(startMap, endMap) = {task with slot [start, end) | 
  //   where startMap.get(task) === start && endMap.get(start) === end, 
  //   for all task within startMap.keys()}
  //
  // Hint: what abstract value do startMap and endMap together represent?
  //       Describe it in terms of the Schedule ADT (tasks and slots).

  // ── Representation Invariant ───────────────────────────────────────────────
  //
  // TODO (Problem 2.1–2.2): Write the RI here, as a list of conditions.
  //
  // RI:
  //   1. startMap.size === endMap.size   
  //   2. startMap.values() and endMap.keys() are equal sets
  //   3. 0 ≤ start < end <= 1440
  //   4. no two tasks have overlapping slots
  //      where two slots [a,b) and [c,d) overlap iff a < d AND c < b.

  // ── Safety from Rep Exposure ───────────────────────────────────────────────
  //
  // TODO: Explain here why this class is safe from rep exposure.
  //
  // SRE: startMap and endMap are private readonly so that it is hidden from the clients,
  //      and tasks() must return a new Set

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
    if (this.startMap.size !== this.endMap.size) {
      throw new Error('Not equal size for startMap and endMap!');
    } 
    for (let startMin of this.startMap.values()) {
      if (!this.endMap.has(startMin)) {
        throw new Error('startMin not found in endMap.keys()!');
      }
    }  
    for (let [startMin, endMin] of this.endMap.entries()) {
      if (startMin < 0 || endMin > 1440 || startMin >= endMin) {
        throw new Error('0 ≤ start < end <= 1440 violated!');
      }
    }
    for (let [a, b] of this.endMap.entries()) {
      for (let [c, d] of this.endMap.entries()) {
        if (a >= c) {
          continue;
        }
        if (a < d && c < b) {
          throw new Error('Overlapping slots founded!');
        }
      }
    }
  }

  // ── Schedule<Task> methods ────────────────────────────────────────────────

  /** @inheritdoc */
  public add(task: Task, start: number, end: number): void {
    // TODO: call checkRep() at the start and end of this method.
    this.checkRep();
    if (this.startMap.has(task)) {
      if (start !== this.startMap.get(task) || 
          end !== this.endMap.get(this.startMap.get(task)!)) {
        throw new ScheduleConflictError('task is already in this set with a different slot!');
      } // else {nop}
    }
    for (let [t, a] of this.startMap.entries()) {
      let b = this.endMap.get(a);
      if (t !== task && a < end && start < b!) {
        throw new ScheduleConflictError('[start,end) overlaps the slot of a different task!');
      }
    }
    this.startMap.set(task, start);
    this.endMap.set(start, end);
    this.checkRep();
  }

  /** @inheritdoc */
  public remove(task: Task): void {
    this.checkRep();
    if (this.has(task)) {
      let startMinute = this.startMap.get(task);
      this.startMap.delete(task);
      this.endMap.delete(startMinute!);
    }
    this.checkRep();
  }

  /** @inheritdoc */
  public has(task: Task): boolean {
    this.checkRep();
    return this.startMap.has(task);
  }

  /** @inheritdoc */
  public slot(task: Task): Slot | undefined {
    this.checkRep();
    if (this.has(task)) {
      let a = this.startMap.get(task);
      let b = this.endMap.get(a!);
      return new Slot(a!, b!);
    } else {
      return undefined;
    }
  }

  /** @inheritdoc */
  public tasks(): ReadonlySet<Task> {
    this.checkRep();
    let result = new Set<Task>();
    for (let t of this.startMap.keys()) {
      result.add(t);
    }
    return result;
  }

  /** @inheritdoc */
  public size(): number {
    this.checkRep();
    return this.startMap.size;
  }

  /** @inheritdoc */
  public toString(): string {
    // TODO: return a human-readable string like "Schedule { A=[540,630), B=[720,780) }"
    let result: string = 'Schedule { '
    for (let [t, a] of this.startMap.entries()) {
      let b = this.endMap.get(a);
      result += '${t.toString()}=[${a},${b}), ';
    }
    result += '}';
    return result;
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
  //   For any index i in taskList, taskList[i] is a task
  //   with time slot [timeList[2*i], timeList[2*i + 1]).
  // AF(taskList, timeList) = 
  //   {task taskList[i] with time slot [timeList[2*i], timeList[2*i + 1]) | 
  //    0 <= i <= taskList.length}

  // ── Representation Invariant ───────────────────────────────────────────────
  //
  // TODO: Write the RI here.
  //
  // RI:
  //   1. timeList.length === 2 * taskList.length
  //   2. 0 <= timeList[2*i] < timeList[2*i + 1] <= 1440
  //   3. taskList doesn't have duplicated values (tasks)
  //   4. no overlapping slots
  //
  // Note: unlike RepMapSchedule, you are NOT required to keep tasks in sorted
  // order — but you may choose to do so.  Document your choice clearly.

  // ── Safety from Rep Exposure ───────────────────────────────────────────────
  //
  // TODO: Explain here why this class is safe from rep exposure.
  //
  // SRE: taskList and timeList are private readonly, hidden from clients,
  //      and tasks() must return a new Set

  /**
   * Create an empty schedule.
   */
  public constructor() {
    this.checkRep();
  }

  // ── checkRep ──────────────────────────────────────────────────────────────

  private checkRep(): void {
    // TODO (Problem 3.1): implement this.
    if (this.timeList.length !== 2 * this.taskList.length) {
      throw new Error('(timeList.length === 2 * taskList.length) should hold!');
    }
    for (let i = 0; i < this.taskList.length; ++i) {
      if (this.timeList[2*i]! < 0 ||
          this.timeList[2*i + 1]! > 1440 ||
          this.timeList[2*i]! >= this.timeList[2*i + 1]!
      ) {
        throw new Error('0 ≤ start < end <= 1440 violated!');
      }
    }
    // for RI 3 and 4, the time complexity is O(n^2) so it would best to
    // rely on the specification.
    // they are easy to implement anyway, just not so efficient
  }

  // ── Schedule<Task> methods ────────────────────────────────────════════════

  /** @inheritdoc */
  public add(task: Task, start: number, end: number): void {
    this.checkRep();
    if (this.taskList.includes(task)) {
      let idx = this.taskList.indexOf(task);
      let a = this.timeList[2*idx];
      let b = this.timeList[2*idx + 1];
      if (a != start || b != end) {
        throw new ScheduleConflictError('task is already in this set with a different slot!');
      } else {
        return; // nop
      }
    }
    for (let i = 0; i < this.taskList.length; ++i) {
      let t = this.taskList[i];
      let a = this.timeList[2*i];
      let b = this.timeList[2*i + 1]; 
      if (t !== task && a! < end && start < b!) {
        throw new ScheduleConflictError('[start,end) overlaps the slot of a different task!');
      }
    }
    this.taskList.push(task);
    this.timeList.push(start);
    this.timeList.push(end);
    this.checkRep();
  }

  /** @inheritdoc */
  public remove(task: Task): void {
    this.checkRep();
    if (this.taskList.includes(task)) {
      let idx = this.taskList.indexOf(task);
      this.taskList.splice(idx, 1);
      this.timeList.splice(idx*2, 2);
    }
    this.checkRep();
  }

  /** @inheritdoc */
  public has(task: Task): boolean {
    this.checkRep();
    return this.taskList.includes(task);
  }

  /** @inheritdoc */
  public slot(task: Task): Slot | undefined {
    this.checkRep();
    if (this.taskList.includes(task)) {
      let idx = this.taskList.indexOf(task);
      let a = this.timeList[idx*2];
      let b = this.timeList[idx*2 + 1];
      return new Slot(a!, b!);
    } else {
      return undefined;
    }
  }

  /** @inheritdoc */
  public tasks(): ReadonlySet<Task> {
    this.checkRep();
    let result = new Set<Task>();
    for (let t of this.taskList) {
      result.add(t);
    }
    return result;
  }

  /** @inheritdoc */
  public size(): number {
    this.checkRep();
    return this.taskList.length;
  }

  /** @inheritdoc */
  public toString(): string {
    this.checkRep();
    let result: string = 'Schedule { '
    for (let i = 0; i < this.taskList.length; ++i) {
      let t = this.taskList[i];
      let a = this.timeList[2*i];
      let b = this.timeList[2*i + 1];
      result += '${t.toString()}=[${a},${b}), ';
    }
    result += '}';
    return result;
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
    ['RepArraySchedule', RepArraySchedule as unknown as ScheduleCtor],
  ];
}
