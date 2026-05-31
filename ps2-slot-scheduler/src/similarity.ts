/**
 * similarity.ts
 *
 * Measures the similarity between two WeeklySchedules.
 *
 * Problem 5.
 *
 * WORKFLOW
 * ────────
 * Step 5.1  Test similarity in test/similarity.test.ts.
 * Step 5.2  Design, specify, and implement a helper ADT (below).
 *           Test it in test/similarity.test.ts.
 * Step 5.3  Implement similarity using your helper ADT.
 *
 * REQUIREMENT: You must define and use a helper ADT class in this file.
 *   The helper ADT must improve SFB, ETU, or RFC of your similarity
 *   implementation.  Choose its operations just as you would choose a
 *   helper function: to capture a coherent unit of computation.
 *   Give it a full spec (TypeDoc), AF, RI, SRE, checkRep, and toString.
 *
 * You may not export anything new from this file.
 */

import { WeeklySchedule } from './weekly-schedule';

// ─── similarity ───────────────────────────────────────────────────────────────

/**
 * A pair of tasks and the client-supplied similarity between them.
 * Similarity must be in [0, 1].
 *
 * @typeParam Task  the type of task labels
 */
export type TaskSimilarityPair<Task> = [Task, Task, number];

/**
 * Measure the similarity between two weekly schedules.
 *
 * The similarity is a number in [0, 1]:
 *   – 0   means completely dissimilar (no overlap, or all overlap with 0-similar tasks)
 *   – 1   means completely similar (same tasks filling exactly the same slots)
 *
 * ─── How similarity is computed ──────────────────────────────────────────────
 *
 * The *span* is the range of minutes [minStart, maxEnd) covered by *either*
 * schedule across all days.  Each day occupies minutes [day*1440, day*1440+1440).
 *
 * For each minute m in the span:
 *   – Let t1 = the task in w1 whose slot covers m on that day, or undefined.
 *   – Let t2 = the task in w2 whose slot covers m on that day, or undefined.
 *   – minuteSim(m) is:
 *       * 0          if t1 or t2 is undefined (minute uncovered by one schedule)
 *       * 1          if t1 === t2  (same task covers the minute in both)
 *       * s          if (t1, t2, s) or (t2, t1, s) appears in taskSim
 *       * 0          otherwise
 *
 * Similarity = sum of minuteSim(m) for m in span  /  span length
 *
 * If both schedules are empty (span length = 0), similarity = 0.
 *
 * ─── About taskSim ────────────────────────────────────────────────────────────
 *
 * `taskSim` is a list of (task1, task2, similarity) triples.  Each triple
 * defines the similarity between a specific pair of tasks.  Similarities must
 * be in [0, 1].  If the same pair appears more than once, the LAST entry wins.
 *
 * You may NOT weaken this spec; you MAY strengthen it (e.g. by specifying
 * additional precision guarantees or additional error conditions).
 *
 * @param w1       first weekly schedule
 * @param w2       second weekly schedule
 * @param taskSim  client-supplied pairwise task similarities; may be empty
 * @returns similarity in [0, 1], within tolerance 0.001
 */
export function similarity<Task>(
  w1: WeeklySchedule<Task>,
  w2: WeeklySchedule<Task>,
  taskSim: ReadonlyArray<TaskSimilarityPair<Task>>
): number {
  throw new Error('implement me!');
}

// ─── Helper ADT ───────────────────────────────────────────────────────────────
//
// Problem 5.2: Design and implement a helper ADT that makes your similarity
// implementation cleaner and easier to reason about.
//
// Some ideas (choose one or design your own):
//   • `MinuteCoverage<Task>` — wraps a WeeklySchedule and provides an
//     efficient taskAt(absoluteMinute: number): Task | undefined operation.
//   • `TaskSimilarityLookup<Task>` — wraps a taskSim array and provides a
//     clean lookup(t1, t2): number operation.
//   • `SimilarityAccumulator` — accumulates a running weighted sum and count
//     and computes the final ratio.
//
// Requirements:
//   ✓ Full TypeDoc spec on the class and every method
//   ✓ AF, RI, SRE documented near the fields
//   ✓ checkRep() called at start/end of every mutator; start of every observer
//   ✓ toString() implemented
//   ✓ Write tests in test/similarity.test.ts
//
// Write your helper ADT below:
