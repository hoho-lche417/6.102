/**
 * nav.ts — Waypoint Navigator
 *
 * Implement the six functions below. Read each specification comment
 * carefully before writing any code.
 *
 * Design goals for every function you write:
 *   Safe from bugs   — correct types, no silent failures
 *   Easy to understand — clear names, obvious logic
 *   Ready for change  — no unnecessary repetition (DRY)
 *
 * Do NOT change any function signature.
 * You MAY add private helper functions at the bottom.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** A 2-D point. */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * A navigator positioned at a point and facing a compass heading.
 * Heading 0° = north, 90° = east, 180° = south, 270° = west (clockwise).
 */
export interface Navigator {
  position: Point;
  heading: number; // degrees, [0, 360)
}

// ─── Part 1 · Basic geometry ──────────────────────────────────────────────────

/**
 * Return the straight-line (Euclidean) distance between two points.
 *
 * Examples:
 *   distance({x:0, y:0}, {x:3, y:4})  →  5
 *   distance({x:1, y:1}, {x:1, y:1})  →  0
 *
 * @param a  first point
 * @param b  second point
 * @returns  non-negative distance
 */
export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Return the length of a chord of a circle.
 *
 * A chord is the straight line connecting two points on a circle's
 * circumference. The central angle is the angle at the circle's centre
 * between the two radii to those points.
 *
 *   chord = 2 · r · sin(centralAngle / 2)
 *
 * Examples:
 *   chordLength(1, 60)   →  1          (equilateral triangle side)
 *   chordLength(1, 180)  →  2          (diameter)
 *   chordLength(5, 90)   →  5·√2 ≈ 7.071
 *
 * @param radius        circle radius; requires radius > 0
 * @param centralAngle  angle in degrees; requires 0 < centralAngle < 360
 * @returns             chord length
 */
export function chordLength(radius: number, centralAngle: number): number {
  let centralRadian = centralAngle / 360 * 2 * Math.PI;
  return 2 * radius * Math.sin(centralRadian / 2);
}

// ─── Part 2 · Polygon ────────────────────────────────────────────────────────

/**
 * Return the perimeter of a regular polygon inscribed in a circle of
 * the given radius.
 *
 * A regular n-gon inscribed in a circle of radius r has n equal sides,
 * each of length chordLength(r, 360/n).
 *
 * NOTE: look for an opportunity to reuse chordLength here rather than
 * repeating its logic. That is the DRY principle in action.
 *
 * Examples:
 *   polygonPerimeter(1, 4)   →  4·√2  ≈ 5.657   (square in unit circle)
 *   polygonPerimeter(1, 6)   →  6               (hexagon in unit circle)
 *   polygonPerimeter(1, 3)   →  3·√3  ≈ 5.196
 *
 * @param radius    circumradius; requires radius > 0
 * @param numSides  number of sides; requires numSides >= 3
 * @returns         perimeter of the polygon
 */
export function polygonPerimeter(radius: number, numSides: number): number {
  return chordLength(radius, 360 / numSides) * numSides;
}

// ─── Part 3 · Navigation ─────────────────────────────────────────────────────

/**
 * Return the compass bearing (in degrees, clockwise from north) needed
 * to travel from point `from` to point `to`.
 *
 * Use Math.atan2 to compute the angle. Note that Math.atan2(y, x) measures
 * counter-clockwise from the positive x-axis; you will need to convert to
 * a clockwise angle from north.
 *
 * Useful identities:
 *   bearing = atan2(dx, dy) in degrees, where dx = to.x - from.x,
 *                                                dy = to.y - from.y
 *   Normalise to [0, 360): (degrees % 360 + 360) % 360
 *
 * Examples:
 *   bearing({x:0,y:0}, {x:0, y:1})  →   0   (directly north)
 *   bearing({x:0,y:0}, {x:1, y:0})  →  90   (directly east)
 *   bearing({x:0,y:0}, {x:0, y:-1}) → 180   (directly south)
 *   bearing({x:0,y:0}, {x:-1, y:0}) → 270   (directly west)
 *
 * @param from  starting point
 * @param to    destination point
 * @returns     bearing in degrees [0, 360)
 */
export function bearing(from: Point, to: Point): number {
  const radian = Math.atan2(to.x - from.x, to.y - from.y);
  const angle = radian / Math.PI * 180;
  return (angle + 360) % 360;
}

/**
 * Navigate to a destination point, updating the navigator in place.
 *
 * The navigator should:
 *   1. Turn to face the destination (set heading to bearing(position, dest)).
 *   2. Move forward to the destination (set position to dest).
 *
 * If dest equals the current position (distance is 0), do nothing.
 *
 * @param nav   the navigator to update (mutate its position and heading)
 * @param dest  the destination point
 */
export function navigateTo(nav: Navigator, dest: Point): void {
  if (nav.position.x !== dest.x || nav.position.y !== dest.y) {
    nav.heading = bearing(nav.position, dest);
  }  
  nav.position = dest;
}

/**
 * Return the total length of the shortest path that visits every waypoint
 * in order, starting from the navigator's current position.
 *
 * The path goes: nav.position → waypoints[0] → waypoints[1] → … → waypoints[n-1]
 *
 * NOTE: look for an opportunity to reuse `distance` here.
 *
 * As a side effect, the navigator visits each waypoint in order
 * (call navigateTo for each one).
 *
 * Examples:
 *   nav at (0,0); waypoints [(0,3), (4,3)]
 *     segment 1: (0,0)→(0,3) = 3
 *     segment 2: (0,3)→(4,3) = 4
 *     total = 7
 *
 * @param nav        the navigator (will be mutated)
 * @param waypoints  ordered list of points to visit; may be empty
 * @returns          total path length
 */
export function totalPathLength(nav: Navigator, waypoints: Point[]): number {
  let totalLentgh = 0
  for (const p of waypoints) {
    totalLentgh += distance(p, nav.position);
    navigateTo(nav, p);
  }
  return totalLentgh;
}

// ─── Part 4 · Pattern generation (open-ended) ────────────────────────────────

/**
 * Return the vertices of a rose curve approximated as a polygon.
 *
 * A rose curve (also called a rhodonea) is a sinusoidal polar curve:
 *   r = amplitude · cos(k · θ)
 * where θ sweeps from 0 to 2π, and k determines the number of petals.
 *
 * Convert each (r, θ) polar coordinate to Cartesian:
 *   x = cx + r · cos(θ)
 *   y = cy + r · sin(θ)
 *
 * Use `steps` sample points evenly spaced over [0, 2π].
 *
 * This is your creative, open-ended problem. The parameters below are just
 * a starting point — you are welcome to change the formula, add more
 * parameters, or generate a completely different mathematical pattern
 * (spirograph, Lissajous, sunflower, etc.) as long as:
 *   - The function returns an array of at least 20 Points.
 *   - The result is visually interesting when plotted.
 *   - Your code uses a loop and at least one mathematical expression
 *     involving sin or cos (not just a hard-coded list of points).
 *
 * To visualise your result, paste the returned points into the snippet
 * in README.md.
 *
 * @param cx         x-coordinate of the centre
 * @param cy         y-coordinate of the centre
 * @param amplitude  maximum radius of the curve
 * @param k          petal count parameter (try 2, 3, 4, 5…)
 * @param steps      number of sample points; requires steps >= 20
 * @returns          array of Points approximating the curve
 */
export function generatePattern(
  cx: number,
  cy: number,
  amplitude: number,
  k: number,
  steps: number
): Point[] {
  const inc = 2 * Math.PI / steps;
  let r: number;
  let x: number, y: number;
  const points: Array<Point> = [];
  for (let i = 0, theta = inc; i < steps; ++i, theta += inc) {
    r = amplitude * Math.cos(k * theta);
    x = cx + r * Math.cos(theta);
    y = cy + r * Math.sin(theta);
    points.push({"x": x, "y": y});
  }
  return points;
}

// ─── Helper functions — add your own below ────────────────────────────────────
