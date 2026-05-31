/**
 * schedule.ts
 *
 * Defines the Schedule<Task> abstract data type, the ScheduleConflictError,
 * the Slot value class, and the makeSchedule() factory function.
 *
 * READ THIS FILE carefully before writing any tests or implementation code.
 *
 * You may NOT change any specification in this file.
 * You MAY NOT add exports to this file.
 * You MUST implement makeSchedule() once you have finished Problem 3.
 */

// ─── Slot ─────────────────────────────────────────────────────────────────────

/**
 * An immutable half-open time slot [start, end) measured in minutes.
 *
 * A slot [start, end) represents the set of minutes { m | start ≤ m < end }.
 *
 * Note: Slot does NOT provide a value-equality method.  Two distinct Slot
 * objects with the same start and end are NOT === to each other — they are
 * different objects.  If your code needs to compare slots for equality,
 * implement a helper function in utils.ts.
 *
 * Reading 9 question: Why does === return false for two Slot objects with the
 * same start and end?  What would you need to implement to get value equality?
 * (You don't have to implement it for this problem set, but think about it.)
 */
export class Slot {
  /**
   * Create a time slot.
   * @param start  start minute (inclusive); requires 0 ≤ start < end ≤ 1440
   * @param end    end minute (exclusive);   requires 0 ≤ start < end ≤ 1440
   */
  public constructor(
    public readonly start: number,
    public readonly end: number
  ) {}

  /**
   * Human-readable representation: "[start,end)".
   * @inheritdoc
   */
  public toString(): string {
    return `[${this.start},${this.end})`;
  }
}

// ─── ScheduleConflictError ────────────────────────────────────────────────────

/**
 * Thrown by Schedule.add() when a conflict would arise from the requested
 * addition.
 */
export class ScheduleConflictError extends Error {
  public constructor(message?: string) {
    super(message ?? 'schedule conflict');
    this.name = 'ScheduleConflictError';
  }
}

// ─── Schedule<Task> interface ─────────────────────────────────────────────────

/**
 * A mutable set of tasks, each associated with a non-overlapping half-open
 * time slot [start, end) measured in integer minutes on a single day.
 *
 * Slots are half-open: [start, end) contains every minute m with
 *   start ≤ m < end.
 *
 * Two slots *overlap* if they share at least one minute.  A slot [a,b)
 * overlaps [c,d) iff a < d AND c < b.
 *
 * Tasks may be of any type.  Two tasks are considered equal iff they are
 * === equal.
 *
 * Example
 * ───────
 *   const s = makeSchedule<string>();
 *   s.add('Lecture',  540, 630);   // 09:00–10:30
 *   s.add('Lunch',    720, 780);   // 12:00–13:00
 *   s.add('Lab',      840, 990);   // 14:00–16:30
 *   s.size()  // 3
 *   s.has('Lunch')  // true
 */
export interface Schedule<Task> {

  // ── Mutators ────────────────────────────────────────────────────────────────

  /**
   * Add a task with a time slot.
   *
   * If this already contains `task` with the slot [start, end), this call
   * has no effect (idempotent).
   *
   * @param task   the task to add
   * @param start  start of the slot (inclusive, minutes); requires 0 ≤ start
   * @param end    end of the slot (exclusive, minutes);   requires start < end ≤ 1440
   * @throws ScheduleConflictError if `task` is already in this set with a
   *         *different* slot, or if [start,end) overlaps the slot of a
   *         *different* task already in this set
   */
  add(task: Task, start: number, end: number): void;

  /**
   * Remove a task from this schedule.
   *
   * If `task` is not in this set, this call has no effect.
   *
   * @param task  the task to remove
   */
  remove(task: Task): void;

  // ── Observers ───────────────────────────────────────────────────────────────

  /**
   * @param task  the task to look up
   * @returns true iff `task` is in this set
   */
  has(task: Task): boolean;

  /**
   * Look up the slot assigned to a task.
   *
   * @param task  the task to look up
   * @returns     the Slot assigned to `task`, or `undefined` if not present
   */
  slot(task: Task): Slot | undefined;

  /**
   * @returns the set of all tasks currently in this schedule;
   *          the returned set is a fresh snapshot — mutations to this
   *          schedule after this call do NOT affect the returned set
   */
  tasks(): ReadonlySet<Task>;

  /**
   * @returns the number of tasks in this schedule
   */
  size(): number;

  /**
   * Human-readable representation of the abstract value.
   *
   * The format is intentionally left underspecified (weak spec) so that
   * different implementations may format it differently.  Do NOT write tests
   * that depend on a specific format.
   *
   * @returns a string describing the schedule; must be non-empty
   * @inheritdoc
   */
  toString(): string;
}

// ─── Factory function ─────────────────────────────────────────────────────────

/**
 * Produce a fresh, empty Schedule<Task>.
 *
 * This factory function decouples clients from any particular implementation.
 * Clients should obtain Schedule instances via this function, not by calling
 * the constructor of a specific implementation class.
 *
 * Problem 3.2: implement this function by returning an instance of one of
 * your implementations.
 *
 * @returns a new, empty Schedule
 */
export function makeSchedule<Task>(): Schedule<Task> {
  throw new Error('implement me! (Problem 3.2)');
}
