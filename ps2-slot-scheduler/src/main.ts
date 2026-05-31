/**
 * main.ts
 *
 * A text-based demo that exercises your Schedule, WeeklySchedule, and
 * similarity implementations.
 *
 * Run with:  npm start
 *
 * This file is NOT used for grading.  Modify freely.
 */

import { makeSchedule } from './schedule';
import { WeeklySchedule } from './weekly-schedule';
import { similarity } from './similarity';

// ─── Demo: single-day Schedule ────────────────────────────────────────────────

console.log('=== Single-Day Schedule ===');
const s = makeSchedule<string>();
s.add('Lecture', 540, 630);   // 09:00–10:30
s.add('Lunch',   720, 780);   // 12:00–13:00
s.add('Lab',     840, 990);   // 14:00–16:30
console.log(s.toString());
console.log(`Size: ${s.size()}`);
console.log(`Has Lecture: ${s.has('Lecture')}`);
console.log(`Slot of Lab: ${s.slot('Lab')?.toString()}`);

// ─── Demo: WeeklySchedule ────────────────────────────────────────────────────

console.log('\n=== Weekly Schedule ===');
const w1 = new WeeklySchedule<string>();
w1.add('Lecture', 1, 540, 630);   // Tue 09:00–10:30
w1.add('Lecture', 3, 540, 630);   // Thu 09:00–10:30
w1.add('Lab',     5, 840, 990);   // Sat 14:00–16:30
console.log(w1.toString());

// ─── Demo: similarity ────────────────────────────────────────────────────────

console.log('\n=== Similarity ===');
const w2 = new WeeklySchedule<string>();
w2.add('Lecture', 1, 540, 630);   // same as w1 Tue
w2.add('Seminar', 3, 540, 630);   // Seminar instead of Lecture Thu
w2.add('Lab',     5, 840, 990);   // same as w1 Sat

const sim = similarity(w1, w2, [['Lecture', 'Seminar', 0.5]]);
console.log(`Similarity: ${sim.toFixed(4)}`);
