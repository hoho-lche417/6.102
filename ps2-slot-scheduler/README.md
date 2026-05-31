# Slot Scheduler

An ADT-focused problem set equivalent to MIT 6.102 PS2.  You will design,
test, and implement mutable abstract data types, culminating in a composed
ADT and a similarity algorithm with a helper ADT.

---

## Setup

```bash
npm install
npm test        # all example tests; many will fail with "implement me!"
npm run coverage  # glass-box coverage — use after each problem
npm start       # run the text demo (after Problem 3.2)
```

---

## Overview

The problem set builds these ADTs in order:

```
Schedule<Task>         (Problems 1–3)  one day, non-overlapping slots
  ├── RepMapSchedule    Problem 2: Map-based rep
  └── RepArraySchedule  Problem 3: Array-based rep

WeeklySchedule<Task>   (Problem 4)    uses Schedule in its rep
similarity()           (Problem 5)    uses WeeklySchedule + a helper ADT
```

---

## Problem 1 — Test `Schedule<string>`

**File:** `test/schedule.test.ts`

Read the spec in `src/schedule.ts` carefully, then write tests.

The test harness runs your suite against *every* implementation returned by
`implementationsForTesting()`.  Inside the loop, use:
```ts
const s = new SomeSchedule<string>();  // fresh empty schedule
```
Do NOT call `new RepMapSchedule<string>()` directly.

### Before writing tests, understand the spec

From `src/schedule.ts`:
- What is a *half-open* slot?  What does [540, 630) contain?
- When do two slots *overlap*?  Do [100,200) and [200,300) overlap?
- When does `add()` throw `ScheduleConflictError`?  When is it idempotent?
- What does `tasks()` return?  Is the returned set a snapshot or a live view?
- What does the spec *not* guarantee about `toString()`?  (Don't test it.)

### Write a testing strategy comment

Before your first `it()`, write:
```ts
// Testing strategy for Schedule:
//   Partition on this.size(): 0, 1, >1
//   Partition on add():
//     – task not present, no overlap → added
//     – task present, same slot → idempotent
//     – task present, different slot → ScheduleConflictError
//     – task absent, slot overlaps existing → ScheduleConflictError
//     – adjacent slots (touching but not overlapping) → no error
//   Partition on remove():  ...
//   ...
```

### Equality and the Slot class

Notice that `Slot` does NOT provide an equality method.  Given:
```ts
const slot1 = new Slot(100, 200);
const slot2 = new Slot(100, 200);
slot1 === slot2  // → false  (different objects!)
```
This is *reference equality* from Reading 9.  If you need to compare slots,
check `slot1.start === slot2.start && slot1.end === slot2.end`, or write a
helper function in `utils.ts`.

Do NOT use `assert.deepStrictEqual(actualSlot, new Slot(100,200))` unless
you've verified that deepStrictEqual checks property values (it does for
plain objects), but prefer explicit property checks for clarity.

**Commit after finishing Problem 1.**

---

## Problem 2 — Implement `RepMapSchedule`

**File:** `src/schedule-impls.ts`

### 2.1 — Implement `RepMapSchedule<string>`

The rep is prescribed.  You must use:
```ts
private readonly startMap: Map<Task, number>;  // task → start minute
private readonly endMap:   Map<number, number>; // start → end minute
```
You may NOT add fields.

**Before writing code**, fill in the AF, RI, and SRE comment blocks.

#### Abstraction Function
Describe what pair `(startMap, endMap)` represents as an abstract Schedule.
Example format:
```
AF(startMap, endMap) = {
  task → [startMap.get(task), endMap.get(startMap.get(task)))
  | task ∈ startMap.keys()
}
```

#### Representation Invariant
List every condition the rep must satisfy:
1. `startMap.size === endMap.size`
2. for every `task` in `startMap`, `startMap.get(task)` is a key in `endMap`
3. `0 ≤ start < end ≤ 1440` for every entry
4. no two tasks have overlapping slots: for any two distinct tasks, their slots don't overlap

#### Safety from Rep Exposure
Explain why clients cannot corrupt the rep.  Key points:
- `startMap` and `endMap` are `private readonly` — clients can't access them.
- `tasks()` must return a *new* Set, not a live view of startMap's key set.

#### `checkRep()`
Implement `checkRep()` to verify every RI condition.  Throw an `Error` (not
`assert`) with a descriptive message if violated.

Call `checkRep()` at the **start and end** of every mutator (`add`, `remove`),
and at the **start** of every observer (`has`, `slot`, `tasks`, `size`).
Do NOT call it inside `checkRep` itself.

#### `toString()`
Return a human-readable string like `"Schedule { A=[540,630) }"`.

#### `@inheritdoc`
Every method you implement that is specified in the `Schedule` interface
should have `/** @inheritdoc */` as its doc comment — don't repeat the spec.

Run your tests:
```bash
npm test -- -f RepMapSchedule
```

**Commit.**

### 2.2 — Make `RepMapSchedule` generic

Change `RepMapSchedule<string>` to `RepMapSchedule<Task>`.  Replace `string`
with the type parameter `Task` throughout.

The spec says labels may be compared with `===`.  If you need to convert a
`Task` to a string (e.g. for `toString()`), use template literals:
`` `${lbl}` `` or `"" + lbl`.

**Commit.**

### 2.3 — Test with non-string labels

String labels can accidentally pass tests that rely on `toString()` for
comparison.  Add tests in the `describe.skip` block (remove `.skip`) that
use object labels, e.g.:
```ts
const taskA = { id: 1 };
const taskB = { id: 1 };   // same id, but DIFFERENT object
```
`taskA === taskB` is `false` even though they look the same.  An
implementation that compares labels using `==` or by converting to strings
would treat them as equal — your tests should catch this bug.

**Commit.**

---

## Problem 3 — Implement `RepArraySchedule`

**File:** `src/schedule-impls.ts`

### 3.1 — Implement `RepArraySchedule<Task>`

The rep is prescribed:
```ts
private readonly taskList: Array<Task>   = [];
private readonly timeList: Array<number> = [];
// timeList stores: [start₀, end₀, start₁, end₁, …]
// so task i has slot [timeList[2i], timeList[2i+1])
```

**Note on `noUncheckedIndexedAccess`:** TypeScript is configured with
`noUncheckedIndexedAccess: true`.  This means `timeList[i]` has type
`number | undefined`, not just `number`.  To assert that the element is
present (when the RI guarantees it), use a non-null assertion `timeList[i]!`.
But do this only where you can reason from the RI that the element exists.

Fill in AF, RI, SRE, implement `checkRep`, `toString`, and all methods.

Uncomment the `RepArraySchedule` line in `implementationsForTesting()` to run
your Schedule tests against this implementation too:
```bash
npm test -- -f IntervalSet  # or whatever prefix matches both
npm test -- -f RepArray
npm test -- -f RepMap
```

**Commit.**

### 3.2 — Implement `makeSchedule()`

Open `src/schedule.ts` and implement the one-line `makeSchedule()` factory
function.  It should return a new instance of one of your implementations.

This decouples clients (including `WeeklySchedule`) from specific
implementation classes.

**Commit.**

At this point, run `npm run coverage` and check that all branches of your
implementations are covered.

---

## Problem 4 — `WeeklySchedule<Task>`

**File:** `src/weekly-schedule.ts`

### 4.1 — Test `WeeklySchedule`

Write tests in `test/weekly-schedule.test.ts`.  Write your testing strategy
comment first.  Think about:
- What's the state space?  (0 tasks, 1 task on 1 day, same task on multiple days, …)
- What does the spec guarantee about `days()` and `tasks()` — are they snapshots?
- When does `add()` throw?  When is it idempotent?
- What happens when an invalid day (< 0 or > 6) is passed?

**Commit.**

### 4.2 — Implement `WeeklySchedule`

**Requirement:** You must use `Schedule<Task>` instances in the rep.
Obtain them with `makeSchedule<Task>()`, not by calling a constructor directly.
Your code must depend only on the `Schedule` *interface* spec, not any implementation.

Write AF, RI, SRE, implement `checkRep`, `toString`, and all methods.

**Hint:** A `Map<number, Schedule<Task>>` (one Schedule per day) is a natural
rep.  But you could also use `Map<Task, Map<number, Slot>>`.
Document your choice clearly.

Run your tests:
```bash
npm test
```

**Commit.**

---

## Problem 5 — `similarity`

**File:** `src/similarity.ts`

### 5.1 — Test `similarity`

Write tests in `test/similarity.test.ts`.  The spec is in `src/similarity.ts`.

Key things to test:
- Both schedules empty → 0
- Identical schedules → 1
- Same slots, different tasks:
  - No `taskSim` entry → 0
  - `taskSim` entry with value s → result proportional to s
- Partial overlaps (one schedule covers more minutes than the other)
- Multiple days contributing
- `taskSim` with duplicate pairs (last entry wins)
- Precision: use `assertApproxEqual` (tolerance 0.001)

You MAY strengthen the spec (e.g. specify additional error conditions for
invalid `taskSim` values like negative similarities).  If you do, update your
tests to reflect the stronger spec.

**Commit.**

### 5.2 — Design a helper ADT

You must implement one helper ADT class in `src/similarity.ts`.  Choose an
operation that makes your `similarity` implementation cleaner:

**Option A: `MinuteCoverage<Task>`**
Wraps a `WeeklySchedule` and provides:
- `taskAt(absoluteMinute: number): Task | undefined`
  where absolute minute = day × 1440 + minute-within-day.
- `minStart(): number` — first absolute minute covered
- `maxEnd(): number` — last absolute minute + 1

**Option B: `SimilarityLookup<Task>`**
Wraps a `taskSim` array and provides:
- `lookup(t1: Task, t2: Task): number` — returns the similarity between two
  tasks: 1 if t1===t2, lookup value if in the array, 0 otherwise.

**Option C: your own design**
Any coherent helper that captures a reusable unit of computation.

Requirements for the helper ADT:
- TypeDoc spec on the class and every method
- AF, RI, SRE documented near the fields
- `checkRep()` called appropriately
- `toString()` implemented
- Tests in `test/similarity.test.ts` with a testing strategy comment

**Commit.**

### 5.3 — Implement `similarity`

Implement `similarity()` using your helper ADT.  Your code should call only
the *spec* of `WeeklySchedule` and your helper ADT — not any implementation
details.

**Commit.**

Run:
```bash
npm test
npm run coverage
npm start
```

---

## Before you're done

Check every class you've written:

- [ ] TypeDoc comment on the class and every public method
- [ ] AF documented near the fields
- [ ] RI documented near the fields
- [ ] SRE documented near the fields
- [ ] `checkRep()` implemented and called correctly
- [ ] `toString()` implemented and useful
- [ ] `@inheritdoc` on methods that inherit their spec from an interface
- [ ] No `console.log` debugging output left in
- [ ] `npm run coverage` shows good coverage

---

## Skills practised (maps to 6.102 PS2)

| PS2 skill | This exercise |
|---|---|
| ADT defined by operations, not rep | `Schedule<Task>` interface |
| Abstraction Function | AF comment in both impls |
| Representation Invariant | RI comment; `checkRep()` |
| Safety from Rep Exposure | SRE comment; `private` fields; defensive copies |
| `checkRep()` called at start/end of mutators | Both implementations |
| `toString()` with human-readable abstract value | Both implementations |
| `@inheritdoc` | All interface implementations |
| Multiple implementations, same test suite | `implementationsForTesting()` loop |
| Generic types `<Task>` | Problem 2.2 refactoring |
| Non-string label testing | Problem 2.3 |
| Testing ADTs — partitioning `this` state | All test files |
| `noUncheckedIndexedAccess` | RepArraySchedule |
| Using one ADT in another's rep | WeeklySchedule uses Schedule |
| Factory function | `makeSchedule()` |
| Designing a helper ADT | Problem 5.2 |
| `===` reference vs. value equality (Reading 9) | Slot class; non-string labels |
| `assert.throws(()=>{}, ErrorClass)` | ScheduleConflictError tests |
| Glass-box coverage | `npm run coverage` |
