/**
 * sequences.ts
 *
 * Functions for working with numeric sequences and keyframe data.
 *
 * Type aliases
 * ────────────
 * EasingFn   — a function that maps a parameter t to a (possibly different) t
 * Keyframes  — a Map from integer time steps to numeric values
 *
 * WORKFLOW
 * ────────
 * Step 1   Read all specs carefully before writing any code.
 * Step 2d  Test lerpArray in test/sequences.test.ts.
 * Step 2e  Implement lerpArray (call lerp; rely only on your lerpWeak spec).
 * Step 3a  Test fillSequence.
 * Step 3b  Implement fillSequence.
 * Step 4a  Test makeEvenSpacing.
 * Step 4b  Implement makeEvenSpacing.
 * Step 5g  Test interpolate.
 * Step 5h  Implement interpolate (now lerp provides your lerpStrong guarantee).
 *
 * What you can and cannot change
 * ───────────────────────────────
 * Do NOT change any function signature or specification in this file.
 * Do NOT export any new names from this file.
 * You MAY add small (unexported) helper functions inside this file.
 * If a helper is complex enough to warrant its own tests, move it to utils.ts.
 */

import { lerp } from './lerp';

// ─── Type aliases ─────────────────────────────────────────────────────────────

/**
 * An easing function maps an input parameter t (typically in [0, 1]) to an
 * output parameter (which may be outside [0, 1]).
 */
export type EasingFn = (t: number) => number;

/**
 * A keyframe map: maps integer time steps (keys) to numeric values.
 * Keys must be integers; values may be any finite number.
 */
export type Keyframes = Map<number, number>;

// ─── lerpArray ────────────────────────────────────────────────────────────────

/**
 * Linearly interpolate between two arrays of numbers, element by element.
 *
 * Each element of the result is computed with `lerp(a[i], b[i], t)`.
 *
 * @param a  start array; requires a.length >= 1
 * @param b  end array; requires b.length === a.length
 * @param t  interpolation parameter; requires 0 <= t <= 1
 * @returns  new array r of length a.length where r[i] = lerp(a[i], b[i], t),
 *           within tolerance 0.001 for each element
 */
export function lerpArray(a: ReadonlyArray<number>, b: ReadonlyArray<number>, t: number): number[] {
  throw new Error('implement me!');
}

// ─── fillSequence ─────────────────────────────────────────────────────────────

/**
 * Fill in a complete sequence of values by linearly interpolating between
 * keyframes.
 *
 * A keyframe map defines values at specific time steps.  This function
 * produces a new map with a value at *every* integer step from 0 to
 * steps-1, by interpolating between surrounding keyframes.
 *
 * Example
 * ───────
 *   keyframes = Map { 0 → 10, 6 → 40 }
 *   steps     = 7
 *   result    = Map { 0→10, 1→15, 2→20, 3→25, 4→30, 5→35, 6→40 }
 *
 *   keyframes = Map { 0 → 0, 3 → 90, 6 → 30 }
 *   steps     = 7
 *   result    = Map { 0→0, 1→30, 2→60, 3→90, 4→70, 5→50, 6→30 }
 *
 * @param keyframes  a Keyframes map; requires:
 *                   – keyframes.size >= 2
 *                   – all keys are integers in [0, steps-1]
 *                   – 0 is a key and steps-1 is a key
 * @param steps      total number of steps; requires steps >= 2
 * @returns  a new Keyframes map with integer keys 0 … steps-1 where:
 *           – every keyframe position has exactly the keyframe value
 *           – every non-keyframe position k is interpolated by lerp between
 *             the nearest keyframe before k and the nearest keyframe after k,
 *             within tolerance 0.001
 */
export function fillSequence(keyframes: Keyframes, steps: number): Keyframes {
  throw new Error('implement me!');
}

// ─── makeEvenSpacing ──────────────────────────────────────────────────────────

/**
 * Generate an array of `count` values evenly spaced around a cycle of length
 * `period`, starting at `start`.
 *
 * The values are start, start + step, start + 2·step, …, start + (count-1)·step,
 * where step = period / count.  Each value is reduced modulo `period` to keep
 * it in [0, period), rounding to 0.001.
 *
 * This is analogous to choosing `count` equally-spaced points around a circle:
 *
 * Example
 * ───────
 *   makeEvenSpacing(0, 4, 12)   → [0, 3, 6, 9]
 *     (4 notes evenly spaced in a 12-semitone octave)
 *
 *   makeEvenSpacing(0, 3, 360)  → [0, 120, 240]
 *     (3 angles evenly spaced around 360°)
 *
 *   makeEvenSpacing(30, 4, 360) → [30, 120, 210, 300]  (± 0.001)
 *     (start at 30°, step by 90°)
 *
 *   makeEvenSpacing(0, 1, 100)  → [0]
 *     (single element: only the start value)
 *
 * @param start   starting value; must be in [0, period); requires start >= 0
 * @param count   number of values to generate; requires count >= 1
 * @param period  length of the cycle; requires period > 0
 * @returns  array of `count` numbers, each in [0, period), within tolerance 0.001
 */
export function makeEvenSpacing(start: number, count: number, period: number): number[] {
  throw new Error('implement me!');
}

// ─── interpolate ──────────────────────────────────────────────────────────────

/**
 * Interpolate between two values using an easing function.
 *
 * An easing function transforms the input parameter t before it is used for
 * interpolation.  This allows the effective interpolation to accelerate,
 * decelerate, bounce, overshoot, etc.
 *
 * Steps:
 *   1. Apply the easing function: tout = easing(t)
 *   2. Use lerp to interpolate: result = lerp(v0, v1, tout)
 *
 * Unlike lerpArray, this function may pass `tout` values outside [0, 1] to
 * lerp, because easing functions are allowed to extrapolate.
 *
 * @param v0      start value
 * @param v1      end value
 * @param easing  easing function; its output is unconstrained
 * @param t       input parameter; requires 0 <= t <= 1
 * @returns  lerp(v0, v1, easing(t)), within tolerance 0.001
 * @throws   Error if t < 0 or t > 1
 */
export function interpolate(v0: number, v1: number, easing: EasingFn, t: number): number {
  throw new Error('implement me!');
}
