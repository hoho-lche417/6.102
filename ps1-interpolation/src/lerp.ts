/**
 * lerp.ts
 *
 * Linear interpolation between two numbers.
 *
 * This module exports a single name, `lerp`, which initially uses the weak
 * implementation and is later upgraded to the strong one (step 5f).
 *
 * WORKFLOW
 * ────────
 * Step 2a  Write a WEAK spec for lerpWeak (JSDoc comment above the function).
 * Step 2b  Test lerpWeak in the first section of test/lerp.test.ts.
 * Step 2c  Implement lerpWeak.
 * Step 5a  Answer the question at the bottom of this file.
 * Step 5b  Write a STRONG spec for lerpStrong.
 * Step 5c  Answer the three analysis questions at the bottom of this file.
 * Step 5d  Test lerpStrong in the last section of test/lerp.test.ts.
 * Step 5e  Implement lerpStrong.
 * Step 5f  Change the export line so that lerp = lerpStrong.
 */

// ─── Provided spec for lerp ───────────────────────────────────────────────────

/**
 * Linear interpolation between two numbers.
 *
 * @param a  start value
 * @param b  end value
 * @param t  interpolation parameter
 * @returns  value between a and b corresponding to parameter t, within
 *           tolerance 0.001
 */
export const lerp: (a: number, b: number, t: number) => number = lerpStrong;
// ↑ Step 5f: change lerpWeak to lerpStrong once you have implemented it.

// ─── Step 2a: Write the spec for lerpWeak ────────────────────────────────────
//
// Your spec must be:
//   • Understandable — enough detail that a client can use it correctly
//   • Appropriate for implementing lerpArray — lerpArray calls lerp and
//     passes t values that are always in [0, 1]
//   • As WEAK as possible — leave out any guarantee that lerpArray doesn't need
//
// Write your spec as a JSDoc comment (/** … */) directly above lerpWeak.
// The spec must include @param and @returns tags.
//
// After you write it, ask yourself: does this spec feel "uncomfortably weak"?
// If not, you may be over-specifying it.  Which guarantees can you remove?

/**
 * Linearly interpolate between two numbers.
 * 
 * @param a  start value
 * @param b  end value
 * @param t  interpolation parameter; requires 0 <= t <= 1
 * @returns  value between a and b corresponding to parameter t, within
 *           tolerance 0.001
 */
export function lerpWeak(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

// ─── Step 5b: Write the spec for lerpStrong ──────────────────────────────────
//
// Your spec must be:
//   • Stronger than lerpWeak — it must be applicable everywhere lerpWeak is
//     used, AND also usable for implementing `interpolate`
//   • The key question: what does interpolate need that lerpWeak doesn't
//     guarantee?  (Answer step 5a first — see the bottom of this file.)

/**
 * Linearly interpolate between two numbers.
 * 
 * @param a  start value
 * @param b  end value
 * @param t  interpolation parameter
 * @returns  value between a and b corresponding to parameter t, within
 *           tolerance 0.001
 */
export function lerpStrong(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

// ─── Step 5a and 5c: Analysis questions ──────────────────────────────────────
//
// Answer each question in 1–3 sentences, directly below the question.
// Your answers will be read during manual grading.
//
// ── Step 5a ──────────────────────────────────────────────────────────────────
//
// Q: Why can we NOT use `lerp` (with your lerpWeak spec) to implement
//    `interpolate` (found in sequences.ts)?
//    Hint: look at how interpolate computes the t argument it passes to lerp.
//
// A: Because lerpWeak assumes 0 <= t <= 1, but interpolate calls leap with unconstrained t
//
// ── Step 5c (three parts) ────────────────────────────────────────────────────
//
// Q1: Is lerpWeak WEAKER THAN, STRONGER THAN, EQUIVALENT TO, or UNRELATED TO
//     lerpStrong?  Justify in one sentence.
//
// A1: As the name implis, lerpWeak is weaker than lerpStrong
//
// Q2: Could a correct implementation of lerpStrong also be a correct
//     implementation of lerpWeak?  Why or why not?
//
// A2: Yes, since the inputs for lerpWeak is valid inputs for lerpStrong,
//     and for the same inputs, both function have the same output, which means
//     lerpWeak can be replaced by lerpStrong at every occurrence without 
//     affecting the client codes.
//
// Q3: Could a correct implementation of lerpWeak also be a correct
//     implementation of lerpStrong?  Why or why not?
//
// A3: No, since the inputs for lerpStrong may not be valid inputs for lerpWeak
//     in the first place, since it has looser constraint on t.
