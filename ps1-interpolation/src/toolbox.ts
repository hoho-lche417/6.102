/**
 * toolbox.ts
 *
 * A small toolbox of functions that makes it easy to create text-based
 * frame animations.  You will design, specify, test, and implement these
 * functions yourself.
 *
 * Background: text animations
 * ───────────────────────────
 * A text animation is a sequence of "frames", where each frame is a string
 * (one line of text).  main.ts calls `printAnimation(frames)` to display
 * them.  You don't need to change main.ts.
 *
 * Two animations to recreate
 * ──────────────────────────
 * Once your toolbox is ready, implement `handoutExampleOne` and
 * `handoutExampleTwo` at the bottom of this file using your toolbox.
 * These two functions should be SHORT — they leverage your toolbox.
 *
 * ── Animation 1: "Eased progress bar" ────────────────────────────────────────
 * A progress bar that fills from 0% to 100% across 11 frames (t = 0.0 … 1.0),
 * using the easing function:  easing(t) = t * t   (ease-in: slow start)
 *
 * Example output (width=20 bar characters):
 *
 *   t=0.00  [                    ]   0%
 *   t=0.10  [                    ]   1%
 *   t=0.20  [=                   ]   4%
 *   t=0.30  [==                  ]   9%
 *   t=0.40  [===                 ]  16%
 *   t=0.50  [=====               ]  25%
 *   t=0.60  [=======             ]  36%
 *   t=0.70  [=========           ]  49%
 *   t=0.80  [============        ]  64%
 *   t=0.90  [================    ]  81%
 *   t=1.00  [====================] 100%
 *
 * Required numbers (from the spec, don't change):
 *   – steps  = 11   (t = 0.0, 0.1, 0.2, …, 1.0)
 *   – width  = 20   (bar characters)
 *   – easing = t => t * t
 *
 * ── Animation 2: "Cycle walk" ────────────────────────────────────────────────
 * A walk through a fill-sequence whose keyframes come from makeEvenSpacing.
 *
 * Keyframe values: makeEvenSpacing(0, 4, 16) = [0, 4, 8, 12]
 * These become the values at keyframe positions 0, 4, 8, 12 in a
 * 13-step sequence (steps=13), filled with fillSequence.
 * Each frame displays the step number and a bar of '·' characters.
 *
 * Example output:
 *
 *   step 0   [                ]  v=0.0
 *   step 1   [=               ]  v=1.0
 *   step 2   [==              ]  v=2.0
 *   step 3   [===             ]  v=3.0
 *   step 4   [====            ]  v=4.0
 *   step 5   [=====           ]  v=5.3
 *   step 6   [======          ]  v=6.7
 *   step 7   [========        ]  v=8.0
 *   step 8   [==========      ]  v=10.0
 *   step 9   [============    ]  v=10.7
 *   step10   [=============   ]  v=10.7  ← interpolated from [8,12] and [12,?]
 *   step11   [==============  ]  v=11.3
 *   step12   [================]  v=12.0
 *
 * Required numbers (don't change):
 *   – period = 16, count = 4, start = 0   → makeEvenSpacing(0, 4, 16)
 *   – steps  = 13
 *   – width  = 16
 *
 * WORKFLOW
 * ────────
 * Step 7a  Review the two example animations above.
 * Step 7b  In this file, draft specs for at most THREE toolbox functions
 *          that make handoutExampleOne and handoutExampleTwo easy to write.
 *          Each function must have a TypeDoc comment with @param and @returns.
 * Step 7c  Write tests for your toolbox functions in test/toolbox.test.ts.
 * Step 7d  Implement your toolbox functions.
 * Step 7e  Implement handoutExampleOne and handoutExampleTwo.
 *          Each should be short — they use your toolbox.
 *          Run `npm start` to see the output.
 *
 * Rules
 * ─────
 * – Design at MOST three new functions.
 * – handoutExampleOne and handoutExampleTwo are not graded directly, and
 *   you do not need to write tests for them (they rely on your other code).
 * – When specs have preconditions that cannot be statically checked,
 *   your implementations must check them and throw an Error (fail fast).
 * – Specs must be safe from bugs, easy to understand, ready for change.
 */

import { interpolate } from './sequences';
import { fillSequence, makeEvenSpacing } from './sequences';

// ─── Your toolbox functions ───────────────────────────────────────────────────
//
// Add up to THREE functions here.  Give each a TypeDoc comment, implement it,
// and write tests in test/toolbox.test.ts.
//
// Example skeleton (rename and revise):
//
// /**
//  * TODO: write your spec here.
//  *
//  * @param  ...
//  * @returns  ...
//  */
// export function myToolboxFunction(...): ... {
//   throw new Error('implement me!');
// }

// ─── handoutExampleOne ────────────────────────────────────────────────────────

/**
 * Produce the frames for Animation 1: "Eased progress bar."
 *
 * Do NOT change this function's signature.
 * Implement it using your toolbox functions above.
 *
 * @returns  array of 11 strings, one per frame, each showing a progress bar
 */
export function handoutExampleOne(): string[] {
  // Required constants — do NOT change:
  const STEPS  = 11;
  const WIDTH  = 20;
  const EASING = (t: number): number => t * t;

  void STEPS; void WIDTH; void EASING; // remove these void-casts once you use them
  throw new Error('implement me!');
}

// ─── handoutExampleTwo ────────────────────────────────────────────────────────

/**
 * Produce the frames for Animation 2: "Cycle walk."
 *
 * Do NOT change this function's signature.
 * Implement it using your toolbox functions above.
 *
 * @returns  array of 13 strings, one per frame, each showing a bar of value
 */
export function handoutExampleTwo(): string[] {
  // Required constants — do NOT change:
  const PERIOD = 16;
  const COUNT  = 4;
  const START  = 0;
  const STEPS  = 13;
  const WIDTH  = 16;

  void PERIOD; void COUNT; void START; void STEPS; void WIDTH;
  throw new Error('implement me!');
}
