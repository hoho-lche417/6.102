/**
 * curves.ts
 *
 * Evaluating 1-D polynomial curves using de Casteljau's algorithm.
 *
 * Background
 * ──────────
 * A 1-D polynomial curve is defined by an ordered list of control points
 * (each a single number).  Given a parameter t ∈ [0, 1], de Casteljau's
 * algorithm computes a point on the curve:
 *
 *   1 control point  [p]:             result = p
 *   2 control points [p0, p1]:        result = lerp(p0, p1, t)
 *   3 control points [p0, p1, p2]:    new layer = [lerp(p0,p1,t), lerp(p1,p2,t)]
 *                                     result = polyEval(new layer, t)
 *   n control points:                 reduce by one level, recurse
 *
 * The curve always passes through the first control point at t=0 and the
 * last control point at t=1.
 *
 * WORKFLOW
 * ────────
 * Step 6a  Strengthen the specs of polyEval and polySample (see instructions).
 *          Write tests in test/curves.test.ts.
 * Step 6b  Implement polyEval and polySample.
 *
 * What you can and cannot change
 * ───────────────────────────────
 * You MUST strengthen the specs — not weaken them.
 * You MUST rename every `renameMe` parameter.
 * You MUST NOT weaken the provided exceptional-case postcondition of polyEval.
 * You MAY NOT export any new names from this file.
 */

import { lerp } from './lerp';

// ─── polyEval ─────────────────────────────────────────────────────────────────
//
// STEP 6a instructions for polyEval
// ───────────────────────────────────
// (1) Rename the parameter `renameMe`.
//     Choose a name that clearly describes what the parameter represents.
//
// (2) Weaken the statically-checked precondition on `renameMe`.
//     Currently the TypeScript type [number, number, ...number[]] requires at
//     least 2 elements.  Change the type so that 1 element is also allowed.
//     Hint: use a tuple type [number, ...number[]] or ReadonlyArray<number>
//     with a precondition comment.
//
// (3) Strengthen the postcondition.
//     The provided postcondition is vague — it only says "a number on the
//     curve."  Replace it with a precise description of what is returned,
//     including the boundary cases at t=0 and t=1.
//     Hint: describe de Casteljau's algorithm declaratively (what it computes),
//     not operationally (how the algorithm works step by step).
//
// Do NOT weaken the provided exceptional-case postcondition.

/**
 * Evaluate a 1-D polynomial curve at parameter t using de Casteljau's
 * algorithm.
 *
 * TODO: strengthen this spec according to the step 6a instructions above.
 *       Replace this comment with your improved spec.
 *
 * @param controlPoints  control points defining a 1-D polynomial curve; 
 *                       requires at least one number
 * @param t  curve parameter; requires 0 <= t <= 1
 * @returns  a number on the curve defined by the control points
 *           calculated by the de Casteljau's algorithm
 * @throws  Error if t < 0 or t > 1
 */
export function polyEval(controlPoints: ReadonlyArray<number>, t: number): number {
  if (t < 0 || t > 1) {
    throw new Error('t out of range!');
  }
  if (controlPoints.length === 1) {
    return controlPoints[0];
  }
  if (controlPoints.length === 2) {
    return lerp(controlPoints[0], controlPoints[1], t);
  }

  // create control point array for the new layer
  const newControlPoints: Array<number> = [];
  for (let i = 1; i < controlPoints.length; ++i) {
    newControlPoints.push(lerp(controlPoints[i - 1], controlPoints[i], t));
  }
  return polyEval(newControlPoints, t);
}

// ─── polySample ───────────────────────────────────────────────────────────────
//
// STEP 6a instructions for polySample
// ──────────────────────────────────────
// (1) Rename the parameter `renameMe`.
//
// (2) Weaken the statically-checked precondition on `renameMe` by changing
//     its type from `number` to `number | undefined`.
//     When `renameMe` is `undefined`, your function should use a sensible
//     default.  Choose the default and document it in the spec.
//
// (3) Strengthen the postcondition.
//     The provided postcondition says "an array of points on the curve" — far
//     too vague.  Specify:
//       • exactly how many values are returned (as a function of renameMe)
//       • exactly which t values are used (linearly spaced: 0, 1/(n-1), …, 1)
//       • that each value equals polyEval(controlPoints, t_i) within 0.001
//
// You cannot add new exceptional cases (i.e. you cannot throw an error for
// inputs that the original spec did not throw for).

/**
 * Sample a 1-D polynomial curve at evenly-spaced t values.
 *
 * TODO: strengthen this spec according to the step 6a instructions above.
 *       Replace this comment with your improved spec.
 *
 * @param controlPoints  control points of the curve; requires length >= 1
 * @param numberSample   the number of samples > 0; 1 by default
 * @returns  array of numberSample values on the curve;
 *           each value equals polyEval(controlPoints, t_i),
 *           where t_i = i / (numberSample - 1), for i = 0 ... numberSample - 1
 *           if numberSample = 1, then return middle point
 */
export function polySample(
  controlPoints: ReadonlyArray<number>,
  numberSample: number | undefined
): number[] {  
  if (numberSample === undefined) {
    return [polyEval(controlPoints, 0.5)];
  }
  
  const result: Array<number> = []

  for (let i = 0; i < numberSample; ++i) {
    let t = i / (numberSample - 1);
    result.push(polyEval(controlPoints, t));
  }

  return result;
}

