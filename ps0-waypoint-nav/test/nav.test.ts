/**
 * nav.test.ts
 *
 * Public test suite for the Waypoint Navigator exercise.
 * Run with:  npm test
 *
 * Green ✓ = your implementation is correct for that case.
 * Red  ✗ = something is wrong; read the error message and fix it.
 *
 * Once all tests pass, add at least TWO of your own test cases at the
 * bottom of this file (marked with "// YOUR TESTS").
 */

import assert from 'assert';
import {
  distance,
  chordLength,
  polygonPerimeter,
  bearing,
  navigateTo,
  totalPathLength,
  generatePattern,
} from '../src/nav';
import type { Navigator, Point } from '../src/nav';

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Assert two numbers are equal within a tolerance.
 * @param actual   value returned by your function
 * @param expected correct value
 * @param delta    allowed difference (default 0.001)
 * @param msg      extra context shown on failure
 */
function assertClose(
  actual: number,
  expected: number,
  delta = 0.001,
  msg?: string
): void {
  const diff = Math.abs(actual - expected);
  assert(
    diff <= delta,
    `${msg ? msg + ': ' : ''}expected ${expected} ± ${delta}, got ${actual}`
  );
}

function makeNav(x = 0, y = 0, heading = 0): Navigator {
  return { position: { x, y }, heading };
}

// ─── distance ─────────────────────────────────────────────────────────────────

describe('distance', () => {
  it('same point → 0', () => {
    assertClose(distance({ x: 3, y: 7 }, { x: 3, y: 7 }), 0);
  });

  it('vertical separation', () => {
    assertClose(distance({ x: 0, y: 0 }, { x: 0, y: 5 }), 5);
  });

  it('horizontal separation', () => {
    assertClose(distance({ x: -2, y: 4 }, { x: 3, y: 4 }), 5);
  });

  it('3-4-5 right triangle', () => {
    assertClose(distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  });

  it('is symmetric', () => {
    const a = { x: 1, y: 2 };
    const b = { x: 5, y: 9 };
    assertClose(distance(a, b), distance(b, a));
  });
});

// ─── chordLength ──────────────────────────────────────────────────────────────

describe('chordLength', () => {
  it('60° on unit circle → 1  (acute, integer result)', () => {
    assertClose(chordLength(1, 60), 1.0);
  });

  it('90° on unit circle → √2  (right angle, decimal result)', () => {
    assertClose(chordLength(1, 90), Math.SQRT2);
  });

  it('120° on unit circle → √3  (obtuse, decimal result)', () => {
    assertClose(chordLength(1, 120), Math.sqrt(3));
  });

  it('180° → diameter', () => {
    assertClose(chordLength(7, 180), 14);
  });

  it('scales linearly with radius', () => {
    const base = chordLength(1, 72);
    assertClose(chordLength(4, 72), base * 4);
  });
});

// ─── polygonPerimeter ─────────────────────────────────────────────────────────

describe('polygonPerimeter', () => {
  it('regular hexagon in unit circle → 6', () => {
    // Each side = chordLength(1, 60) = 1; 6 sides → 6
    assertClose(polygonPerimeter(1, 6), 6.0);
  });

  it('square in unit circle → 4·√2', () => {
    assertClose(polygonPerimeter(1, 4), 4 * Math.SQRT2);
  });

  it('equilateral triangle in unit circle → 3·√3', () => {
    assertClose(polygonPerimeter(1, 3), 3 * Math.sqrt(3));
  });

  it('scales with radius', () => {
    const base = polygonPerimeter(1, 5);
    assertClose(polygonPerimeter(3, 5), base * 3);
  });

  it('perimeter approaches 2πr as numSides grows', () => {
    // With 1000 sides the polygon is almost a circle
    assertClose(polygonPerimeter(10, 1000), 2 * Math.PI * 10, 0.01);
  });
});

// ─── bearing ──────────────────────────────────────────────────────────────────

describe('bearing', () => {
  const O: Point = { x: 0, y: 0 };

  it('directly north → 0°', () => {
    assertClose(bearing(O, { x: 0, y: 5 }), 0);
  });

  it('directly east → 90°', () => {
    assertClose(bearing(O, { x: 5, y: 0 }), 90);
  });

  it('directly south → 180°', () => {
    assertClose(bearing(O, { x: 0, y: -5 }), 180);
  });

  it('directly west → 270°', () => {
    assertClose(bearing(O, { x: -5, y: 0 }), 270);
  });

  it('north-east diagonal → 45°', () => {
    assertClose(bearing(O, { x: 3, y: 3 }), 45);
  });

  it('result is always in [0, 360)', () => {
    const b = bearing({ x: 5, y: 5 }, { x: 3, y: 3 });
    assert(b >= 0 && b < 360, `bearing ${b} should be in [0, 360)`);
  });
});

// ─── navigateTo ───────────────────────────────────────────────────────────────

describe('navigateTo', () => {
  it('updates position to destination', () => {
    const nav = makeNav(0, 0, 0);
    navigateTo(nav, { x: 3, y: 4 });
    assertClose(nav.position.x, 3, 0.001, 'x');
    assertClose(nav.position.y, 4, 0.001, 'y');
  });

  it('updates heading to face destination', () => {
    const nav = makeNav(0, 0, 0);
    navigateTo(nav, { x: 5, y: 0 }); // due east
    assertClose(nav.heading, 90, 0.001, 'heading east');
  });

  it('same point → no change', () => {
    const nav = makeNav(3, 3, 45);
    navigateTo(nav, { x: 3, y: 3 });
    assertClose(nav.position.x, 3);
    assertClose(nav.position.y, 3);
    assertClose(nav.heading, 45, 0.001, 'heading unchanged');
  });
});

// ─── totalPathLength ──────────────────────────────────────────────────────────

describe('totalPathLength', () => {
  it('empty waypoints → 0, position unchanged', () => {
    const nav = makeNav(1, 1, 0);
    assertClose(totalPathLength(nav, []), 0);
    assertClose(nav.position.x, 1);
    assertClose(nav.position.y, 1);
  });

  it('single waypoint → distance from start', () => {
    const nav = makeNav(0, 0, 0);
    assertClose(totalPathLength(nav, [{ x: 0, y: 5 }]), 5);
  });

  it('two waypoints — L-shaped path', () => {
    // (0,0) → (0,3) = 3, then (0,3) → (4,3) = 4; total = 7
    const nav = makeNav(0, 0, 0);
    assertClose(
      totalPathLength(nav, [
        { x: 0, y: 3 },
        { x: 4, y: 3 },
      ]),
      7
    );
  });

  it('navigator ends at last waypoint', () => {
    const nav = makeNav(0, 0, 0);
    const last: Point = { x: 10, y: 10 };
    totalPathLength(nav, [{ x: 5, y: 0 }, last]);
    assertClose(nav.position.x, last.x, 0.001);
    assertClose(nav.position.y, last.y, 0.001);
  });

  it('3-4-5 back-to-back triangles', () => {
    const nav = makeNav(0, 0, 0);
    // (0,0)→(3,4) = 5; (3,4)→(0,0) = 5; total = 10
    assertClose(
      totalPathLength(nav, [
        { x: 3, y: 4 },
        { x: 0, y: 0 },
      ]),
      10
    );
  });
});

// ─── generatePattern ──────────────────────────────────────────────────────────

describe('generatePattern', () => {
  it('returns at least 20 points', () => {
    const pts = generatePattern(0, 0, 100, 3, 60);
    assert(pts.length >= 20, `expected >= 20 points, got ${pts.length}`);
  });

  it('returns exactly `steps` points', () => {
    const pts = generatePattern(0, 0, 50, 4, 100);
    assert.strictEqual(pts.length, 100);
  });

  it('all points are within amplitude distance of centre', () => {
    const amplitude = 80;
    const pts = generatePattern(10, 20, amplitude, 3, 90);
    for (const p of pts) {
      const d = distance(p, { x: 10, y: 20 });
      assert(
        d <= amplitude + 0.001,
        `point (${p.x.toFixed(1)}, ${p.y.toFixed(1)}) is ${d.toFixed(2)} from centre, exceeds amplitude ${amplitude}`
      );
    }
  });

  it('centre offset is respected', () => {
    const pts1 = generatePattern(0, 0, 50, 2, 40);
    const pts2 = generatePattern(100, 200, 50, 2, 40);
    // Each point in pts2 should be (100, 200) further than the matching point in pts1
    for (let i = 0; i < pts1.length; i++) {
      assertClose(pts2[i].x - pts1[i].x, 100, 0.001, `point ${i} x offset`);
      assertClose(pts2[i].y - pts1[i].y, 200, 0.001, `point ${i} y offset`);
    }
  });
});

// ─── YOUR TESTS — add at least two cases below ────────────────────────────────
//
// Example structure:
//
// describe('distance — my extra tests', () => {
//   it('negative coordinates', () => {
//     assertClose(distance({x: -3, y: 0}, {x: 0, y: -4}), 5);
//   });
// });


describe('chordLength', () => {
  it('0° on unit circle → 0  (0, integer result)', () => {
    assertClose(chordLength(1, 0), 0);
  });

  it('0.0001° on unit circle → 0  (small, decimal result)', () => {
    assertClose(chordLength(10, 0.0001), 0);
  });
});
