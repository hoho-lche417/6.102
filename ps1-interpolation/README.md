# PS1 Equivalent: Keyframe Animator

A text-based problem set that practises the same skills as MIT 6.102 PS1:
**test-first programming**, **specifications**, **weak vs. strong specs**,
**systematic testing**, and **iterative development**.

---

## Setup

```bash
npm install
npm test        # all provided example tests should fail with "implement me!"
npm run coverage  # glass-box coverage (use after step 3 and beyond)
npm start       # run the two text animations (after step 7)
```

---

## Overview

You will specify, test, and implement functions in this order:

| Step | What you write          | File(s)                          |
|------|-------------------------|----------------------------------|
| 1    | (read specs)            | `src/sequences.ts`, `src/curves.ts` |
| 2a   | weak spec for lerpWeak  | `src/lerp.ts`                    |
| 2b   | tests for lerpWeak      | `test/lerp.test.ts`              |
| 2c   | impl of lerpWeak        | `src/lerp.ts`                    |
| 2d   | tests for lerpArray     | `test/sequences.test.ts`         |
| 2e   | impl of lerpArray       | `src/sequences.ts`               |
| 3a   | tests for fillSequence  | `test/sequences.test.ts`         |
| 3b   | impl of fillSequence    | `src/sequences.ts`               |
| 4a   | tests for makeEvenSpacing | `test/sequences.test.ts`       |
| 4b   | impl of makeEvenSpacing | `src/sequences.ts`               |
| 5a   | answer question in lerp.ts | `src/lerp.ts`                 |
| 5b   | strong spec for lerpStrong | `src/lerp.ts`                 |
| 5c   | answer 3 analysis questions | `src/lerp.ts`                |
| 5d   | tests for lerpStrong    | `test/lerp.test.ts`              |
| 5e   | impl of lerpStrong      | `src/lerp.ts`                    |
| 5f   | update lerp export      | `src/lerp.ts`                    |
| 5g   | tests for interpolate   | `test/sequences.test.ts`         |
| 5h   | impl of interpolate     | `src/sequences.ts`               |
| 6a   | strengthen specs, tests | `src/curves.ts`, `test/curves.test.ts` |
| 6b   | impl of polyEval, polySample | `src/curves.ts`             |
| 7a   | (review animations)     | `src/toolbox.ts`                 |
| 7b   | design toolbox specs    | `src/toolbox.ts`                 |
| 7c   | tests for toolbox       | `test/toolbox.test.ts`           |
| 7d   | impl of toolbox         | `src/toolbox.ts`                 |
| 7e   | implement both examples | `src/toolbox.ts`                 |

**Commit after every step.**

---

## Steps in detail

### Step 0 — Read the entire README first

Before writing any code, read everything here and skim all `src/` files.

---

### Step 1 — Read the provided specs

Open `src/sequences.ts` and `src/curves.ts`.  Read every spec comment
carefully.  Don't start coding yet.  Take notes on:

- What are the preconditions?  (What inputs are illegal?)
- Are any specs **underdetermined**?  (Does the spec allow multiple valid
  outputs for the same input?  If so, your tests must allow that range.)
- What are the boundary cases?  (t=0, t=1, single-element arrays, etc.)

---

### Step 2 — lerpWeak, lerpArray

#### 2a — Write a WEAK spec for `lerpWeak`

Open `src/lerp.ts`.  Write a JSDoc comment above `lerpWeak` that:
- Is **understandable**: enough detail that someone can use it correctly.
- Is **appropriate** for implementing `lerpArray`: lerpArray calls lerp and
  passes `t` values in the range [0, 1].
- Is as **weak** as possible: leave out any guarantee that lerpArray doesn't
  need.  Should you guarantee behaviour for t outside [0,1]?  Do you need to
  specify the exact formula?

After writing it, ask yourself: *does this feel uncomfortably weak?*
That's the goal.

#### 2b — Test lerpWeak

Open `test/lerp.test.ts`, Section 1.  Write your testing strategy comment
first, then write test cases.

Key rule: **your tests must be legal clients of your spec**.  If your
lerpWeak spec only guarantees results for t ∈ [0,1], don't test t=2.
If your spec is underdetermined, don't over-constrain the expected output.

Keep the suite small: 3–5 tests.

#### 2c — Implement lerpWeak

The implementation of a weak spec can be very simple.  Make all your tests
pass, then commit.

#### 2d — Test lerpArray

Open `test/sequences.test.ts`, the lerpArray section.  Write a testing
strategy comment and tests.  Make sure your tests respect the spec's
preconditions (don't pass arrays of different length).

#### 2e — Implement lerpArray

In `src/sequences.ts`.  Call `lerp` (which uses lerpWeak).  Your
implementation may *only* assume the lerpWeak guarantee — not any additional
properties of your specific implementation of lerpWeak.

---

### Step 3 — fillSequence

#### 3a — Test fillSequence

Write tests in `test/sequences.test.ts`.  Key things to test:

- Every integer step 0 … steps-1 is present in the result.
- Keyframe positions have exactly the keyframe value (use strictEqual or
  assertApproxEqual as appropriate).
- Intermediate positions are within tolerance 0.001 of the correct
  interpolated value.
- The function works with more than 2 keyframes.

When comparing the entire Map: if all values happen to be integers, you may
use `assert.deepStrictEqual(result, expectedMap)`.  If values are floats,
retrieve each entry and compare with assertApproxEqual.

#### 3b — Implement fillSequence

Hint: sort the keyframe keys, then for each gap between consecutive
keyframes, compute t = (step - leftKey) / (rightKey - leftKey) and call lerp.

Run `npm run coverage` and check that your tests exercise all branches of
your implementation.

---

### Step 4 — makeEvenSpacing

#### 4a — Test makeEvenSpacing

Partitions to consider:
- count = 1 (only the start value)
- start = 0 vs. start > 0
- output values that wrap around vs. don't wrap
- period with different magnitudes

#### 4b — Implement makeEvenSpacing

The step size is `period / count`.  Use the modulo operator to keep values
in [0, period).

---

### Step 5 — lerpStrong and interpolate

#### 5a — Why lerpWeak is not enough for interpolate

Read the spec of `interpolate` in `src/sequences.ts`.  Notice that it
calls `lerp(v0, v1, easing(t))`.  What does the easing function return?
Can it return values outside [0, 1]?

Now answer the question in `src/lerp.ts` under "Step 5a".  One sentence.

#### 5b — Write a STRONG spec for lerpStrong

What additional guarantee does `interpolate` need that lerpWeak doesn't
provide?  Write the lerpStrong spec.  The spec should be useful everywhere
lerpWeak is used, *and* also for implementing interpolate.

#### 5c — Analyse the relationship

Answer the three questions in `src/lerp.ts` under "Step 5c":

1. Is lerpWeak weaker than, stronger than, equivalent to, or unrelated to
   lerpStrong?
2. Could a correct lerpStrong implementation also satisfy lerpWeak?
3. Could a correct lerpWeak implementation also satisfy lerpStrong?

Understanding strength relationships is a core skill in this problem set.

#### 5d–5f — Test, implement, and export lerpStrong

Write 4–7 tests in Section 2 of `test/lerp.test.ts`.  Because lerpStrong
is stronger, you can test a wider range.  Then implement lerpStrong and
update the export line (`export const lerp = lerpStrong`).

#### 5g–5h — Test and implement interpolate

Write tests for `interpolate`, including:
- `assert.throws(() => { interpolate(0, 1, t => t, -0.1); })` — testing
  the error case using an anonymous function (this is important — see the
  warning in `test/sequences.test.ts`).
- An easing function that goes outside [0, 1] (e.g. `t => 2*t`), which
  requires lerpStrong's guarantee.

---

### Step 6 — polyEval and polySample

#### 6a — Strengthen the specs

Open `src/curves.ts`.  For each function:

**polyEval**
1. Rename `renameMe` to a descriptive name.
2. Change its TypeScript type from `[number, number, ...number[]]` (requires
   ≥ 2 elements) to a type that also allows 1 element.
3. Write a precise postcondition.  Describe *what* de Casteljau's algorithm
   computes, not step-by-step *how* it computes it.  Mention the boundary
   cases at t=0 and t=1.

**polySample**
1. Rename `renameMe`.
2. Change its type from `number` to `number | undefined`.  Decide and
   document what default value `undefined` means.
3. Write a precise postcondition: state the exact t values used (linearly
   spaced: `t_i = i / (n-1)` for i = 0 … n-1), the length of the result,
   and that each element equals `polyEval(controlPoints, t_i)` within 0.001.

Then write tests in `test/curves.test.ts`.

#### 6b — Implement

Implement polyEval recursively using de Casteljau's algorithm.  The base
cases are 1 control point (return that value) and 2 control points
(return lerp).  For more, produce a new layer and recurse.

---

### Step 7 — Toolbox and text animations

#### 7a — Review the two example animations

Re-read the animation specifications in `src/toolbox.ts`.  Run `npm start`
to see what they should look like (you'll need to implement them first, but
read the descriptions now).

#### 7b — Design your toolbox

What computation do both animations share?  What helper function would make
each animation's implementation short and clear?

Design *at most three* functions.  Give each a full TypeDoc spec with
`@param` and `@returns`.  Think about:
- What are the preconditions you can't statically check?  Your
  implementations must check these and throw an Error (fail fast).
- Are your specs deterministic or underdetermined?

#### 7c — Test your toolbox

Write tests for each function in `test/toolbox.test.ts`.  Focus on testing
the toolbox functions in isolation, not the animations themselves.

#### 7d–7e — Implement and run

Implement your toolbox functions, then implement `handoutExampleOne` and
`handoutExampleTwo` in `src/toolbox.ts`.  Run `npm start`.

---

## Testing principles (applies to every step)

### Partitioning

Don't choose test inputs randomly.  Systematically partition each input:

```
// Testing strategy for lerpArray:
//   Partition on t: t=0, t=1, strictly between
//   Partition on array length: length 1, length > 1
//   Partition on element values: a[i] < b[i], a[i] = b[i], a[i] > b[i]
//   Cover each partition: ...
```

### Legal test cases

Your tests must not assume more than the spec guarantees:

```ts
// WRONG if spec is underdetermined (multiple valid outputs):
assert.strictEqual(fillSequence(kf, 5).get(2), 20.123456);

// RIGHT:
assertApproxEqual(fillSequence(kf, 5).get(2) ?? NaN, 20, 0.001);
```

### Comparison tools

| Situation                        | Use                          |
|----------------------------------|------------------------------|
| Floating-point number (± 0.001)  | `assertApproxEqual`          |
| Exact integer / string / boolean | `assert.strictEqual`         |
| Array or Map by value            | `assert.deepStrictEqual`     |
| Expected error thrown            | `assert.throws(() => { … })` |

### Glass-box coverage

After implementing a function, run `npm run coverage` and look for uncovered
branches (red lines).  Add tests for those branches.

---

## Git workflow

```bash
git init
git add src/lerp.ts test/lerp.test.ts
git commit -m "step 2b: test suite for lerpWeak"
git add src/lerp.ts
git commit -m "step 2c: implement lerpWeak"
```

Commit messages should be short but descriptive.  Commit after every
sub-step — your git history demonstrates test-first programming.

---

## Skills practised (map to 6.102 PS1)

| PS1 skill                                  | This exercise                             |
|--------------------------------------------|-------------------------------------------|
| Test-first programming                     | Entire workflow table                     |
| Partitioning + testing strategy comments   | Every test file                           |
| Weak specs (deliberately under-specified)  | lerpWeak                                  |
| Strong specs (fully precise)               | lerpStrong                                |
| Analysing spec strength relationships      | Step 5a–5c questions                      |
| Underdetermined specs + legal tests        | fillSequence, polySample                  |
| `assert.throws` for exceptions             | interpolate, polyEval                     |
| `deepStrictEqual` for Maps/arrays          | fillSequence tests                        |
| `assertApproxEqual` for floats             | All floating-point comparisons            |
| Strengthening provided specs (renameMe)    | polyEval, polySample                      |
| Helper function placement (utils.ts)       | Step 7 toolbox                            |
| Glass-box coverage                         | `npm run coverage`                        |
| Designing a toolbox of functions           | Step 7                                    |
| Iterative development with frequent commits| Git workflow                              |
