/**
 * weekly-schedule.ts
 *
 * The WeeklySchedule<Task> ADT.
 *
 * Problem 4.
 *
 * A WeeklySchedule represents a mutable mapping from tasks to one or more
 * (day, slot) pairs across a 7-day week.
 *
 * Across a single day, no two tasks may overlap.
 * Across different days, any task or slot may repeat.
 *
 * You must use Schedule<Task> in the rep of WeeklySchedule — for example,
 * one Schedule<Task> per day.  Your implementation must rely only on the
 * Schedule<Task> *interface* spec; do NOT depend on any particular
 * implementation class (use makeSchedule() to obtain instances).
 *
 * As with your Schedule implementations:
 *   ✓  Document AF, RI, SRE near the fields.
 *   ✓  Implement checkRep(); call it at start and end of every mutator and
 *      at the start of every observer.
 *   ✓  Implement toString().
 *
 * You may NOT export anything new from this file other than WeeklySchedule.
 */

import { Schedule, Slot, ScheduleConflictError, makeSchedule } from './schedule';

/**
 * A mutable set of (task, day, slot) triples across a 7-day week, where on
 * each individual day no two tasks may have overlapping slots.
 *
 * Days are numbered 0 (Monday) through 6 (Sunday).
 *
 * Example
 * ───────
 *   const w = new WeeklySchedule<string>();
 *   w.add('Lecture',  1, 540, 630);   // Tuesday 09:00–10:30
 *   w.add('Lecture',  3, 540, 630);   // Thursday 09:00–10:30
 *   w.add('Lab',      5, 840, 990);   // Saturday 14:00–16:30
 *   w.days('Lecture')   // Set { 1, 3 }
 *   w.tasks(1)          // Set { 'Lecture' }
 */
export class WeeklySchedule<Task> {

  // ── Rep ───────────────────────────────────────────────────────────────────
  //
  // TODO (Problem 4.2): Choose your rep.
  //
  // REQUIREMENT: You must use Schedule<Task> instances in your rep.
  //   For example: Map<number, Schedule<Task>> — one Schedule per day.
  //   Or: Map<Task, Map<number, Slot>> — one map per task.
  //   Other designs are possible too.
  //
  // Obtain Schedule instances with makeSchedule(), not with a specific class.
  private readonly schedule = new Map<number, Schedule<Task>>();

  // ── Abstraction Function ──────────────────────────────────────────────────
  // TODO: Write AF here.
  // AF(schedule) = {task with slot [a, b) on day d | 
  //                <task, [a, b)> in schedule.get(d), for all d}

  // ── Representation Invariant ──────────────────────────────────────────────
  // TODO: Write RI here.
  // RI: schedule.keys() withen range [0, 7)
  //     schedule.size === 7

  // ── Safety from Rep Exposure ──────────────────────────────────────────────
  // TODO: Document SRE.
  // SRE: private readonly repesentation hides itself from the clients
  //      defensive copy of mutable types for arguments and return values

  /** Create an empty weekly schedule. */
  public constructor() {
    for (let i = 0; i < 7; ++i) {
      let daySchedule = makeSchedule<Task>();
      this.schedule.set(i, daySchedule);
    }
    this.checkRep();
  }

  private checkRep(): void {
    if (this.schedule.size !== 7) {
      throw new Error('Incorrect size for schedule!');
    }
    for (let k of this.schedule.keys()) {
      if (k >= 7 || k < 0) {
        throw new Error('Incorrect day for schedule!');
      }
    }
  }
    

  // ── Mutators ──────────────────────────────────────────────────────────────

  /**
   * Add a task on a given day with the given slot.
   *
   * If `task` is already scheduled on `day` with slot [start, end), this
   * call has no effect (idempotent).
   *
   * @param task   the task to add
   * @param day    day of the week: 0 (Mon) … 6 (Sun)
   * @param start  start of slot in minutes [0, 1440); requires start ≥ 0
   * @param end    end of slot in minutes (start, 1440];  requires end > start, end ≤ 1440
   * @throws ScheduleConflictError if `task` already has a *different* slot
   *         on `day`, or if [start,end) overlaps another task's slot on `day`
   * @throws RangeError if day < 0 or day > 6
   */
  public add(task: Task, day: number, start: number, end: number): void {
    this.checkRep();
    if (day < 0 || day > 6) {
      throw new RangeError('Incorrect day for schedule!');
    }    
    this.schedule.get(day)!.add(task, start, end);
    this.checkRep();
  }

  /**
   * Remove a task from a specific day.
   *
   * If `task` is not scheduled on `day`, this call has no effect.
   *
   * @param task  the task to remove
   * @param day   day of the week: 0 … 6
   * @throws RangeError if day < 0 or day > 6
   */
  public remove(task: Task, day: number): void {
    this.checkRep();
    if (day < 0 || day > 6) {
      throw new RangeError('Incorrect day for schedule!');
    }
    this.schedule.get(day)!.remove(task);
    this.checkRep();
  }

  /**
   * Remove a task from all days of the week.
   *
   * If `task` does not appear on any day, this call has no effect.
   *
   * @param task  the task to remove
   */
  public removeAll(task: Task): void {
    this.checkRep();
    for (let d = 0; d < 7; ++d) {
      this.schedule.get(d)!.remove(task);
    }
    this.checkRep();
  }

  // ── Observers ─────────────────────────────────────────────────────────────

  /**
   * @param task  the task to check
   * @param day   day of the week: 0 … 6
   * @returns true iff `task` is scheduled on `day`
   * @throws RangeError if day < 0 or day > 6
   */
  public has(task: Task, day: number): boolean {
    this.checkRep();
    if (day < 0 || day > 6) {
      throw new RangeError('Incorrect day for schedule!');
    }
    return this.schedule.get(day)!.has(task);
  }

  /**
   * @param task  the task to look up
   * @param day   day of the week: 0 … 6
   * @returns the Slot for `task` on `day`, or undefined if not present
   * @throws RangeError if day < 0 or day > 6
   */
  public slot(task: Task, day: number): Slot | undefined {
    this.checkRep();
    if (day < 0 || day > 6) {
      throw new RangeError('Incorrect day for schedule!');
    }
    return this.schedule.get(day)!.slot(task);
  }

  /**
   * @param task  the task to look up
   * @returns the set of days (0 … 6) on which `task` is scheduled;
   *          fresh snapshot — changes to this schedule don't affect the result
   */
  public days(task: Task): ReadonlySet<number> {
    this.checkRep();
    let result = new Set<number>();
    for (let d = 0; d < 7; ++d) {
      if (this.schedule.get(d)!.has(task)) {
        result.add(d);
      }
    }
    return result;
  }

  /**
   * @param day  day of the week: 0 … 6
   * @returns the set of tasks scheduled on `day`;
   *          fresh snapshot
   * @throws RangeError if day < 0 or day > 6
   */
  public tasks(day: number): ReadonlySet<Task> {
    this.checkRep();
    if (day < 0 || day > 6) {
      throw new RangeError('Incorrect day for schedule!');
    }
    let daySchedule = this.schedule.get(day)!;
    let result = new Set<Task>();
    for (let t of daySchedule.tasks()) {
      result.add(structuredClone(t));
    }
    return result;
  }

  /**
   * @returns human-readable representation of the abstract value;
   *          format is intentionally unspecified
   * @inheritdoc
   */
  public toString(): string {
    this.checkRep();
    let result: string = '';
    for (let d = 0; d < 7; ++d) {
      result += 'Day ${d}: \n\t' + this.schedule.get(d)!.toString() + '\n';
    }
    return result;
  }
}
