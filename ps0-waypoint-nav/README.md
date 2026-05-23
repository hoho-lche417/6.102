# Waypoint Navigator

A minimal exercise that practises the same core skills as MIT 6.102 PS0:
TypeScript types, mathematical geometry, Mocha testing, and the DRY principle.

**One file to edit:** `src/nav.ts`  
**One test command:** `npm test`

---

## Setup

```bash
npm install
npm test        # all 24 tests should fail with "implement me!"
```

---

## Problems

Work through these in order. Run `npm test` after each part.

---

### Part 1 — Basic Geometry

Implement `distance` and `chordLength` in `src/nav.ts`.

**`distance(a, b)`**  
Euclidean (straight-line) distance between two points. Use `Math.hypot` or
the Pythagorean formula directly.

**`chordLength(radius, centralAngle)`**  
Length of a chord of a circle subtending a given central angle.
Formula: `chord = 2 · r · sin(angle_in_radians / 2)`.
Try to derive this from a diagram before looking it up.

Expected test results once done:
```
distance       ✓ ✓ ✓ ✓ ✓
chordLength    ✓ ✓ ✓ ✓ ✓
```

---

### Part 2 — Polygon Perimeter

Implement `polygonPerimeter(radius, numSides)`.

A regular *n*-sided polygon inscribed in a circle of radius *r* has *n*
equal sides, each equal to `chordLength(r, 360/n)`.

**DRY check:** you should be calling `chordLength` here, not repeating its
formula. Notice how the perimeter of a hexagon inscribed in a unit circle
is exactly 6 — the same as the diameter of the circumscribed circle. That
is a beautiful geometric fact worth understanding.

As `numSides` grows, the perimeter approaches `2πr` (the circumference of
the circle). The test `perimeter approaches 2πr as numSides grows` checks
this numerically.

---

### Part 3 — Navigation

#### `bearing(from, to)`

The compass bearing (degrees clockwise from north) to travel from `from`
to `to`.

```
North = 0°    East = 90°    South = 180°    West = 270°
```

Step by step:
1. `dx = to.x - from.x`, `dy = to.y - from.y`
2. `radians = Math.atan2(dx, dy)` — note argument order `(x, y)` not `(y, x)`
3. Convert to degrees: `* (180 / Math.PI)`
4. Normalise to [0, 360): `(degrees % 360 + 360) % 360`

#### `navigateTo(nav, dest)`

Update the navigator's heading and position to reach `dest`.
Guard against the zero-distance case (same point).

#### `totalPathLength(nav, waypoints)`

Visit each waypoint in order (call `navigateTo` for each), accumulate the
total distance travelled, and return it.

**DRY check:** accumulate distances using your `distance` function, not by
recomputing `Math.sqrt` again.

---

### Part 4 — Pattern Generation (open-ended)

Implement `generatePattern(cx, cy, amplitude, k, steps)`.

The default formula given in the spec is a **rose curve**:

```
r     = amplitude · cos(k · θ)
x[i]  = cx + r · cos(θ)
y[i]  = cy + r · sin(θ)
```

where `θ` runs from `0` to `2π` in `steps` equal increments.

You are free to:
- Implement the rose curve exactly as described, **or**
- Replace it with any other parametric curve that satisfies the requirements
  in the spec comment (Archimedean spiral, Lissajous, sunflower, etc.)

The tests only check the number of points and the amplitude bound, so there
is genuine creative freedom here.

**Visualise your output** by pasting the snippet below into your browser
console (edit the call to `generatePattern` to match your implementation):

```html
<!DOCTYPE html>
<html>
<body>
<canvas id="c" width="500" height="500"></canvas>
<script>
// paste your compiled output here, or use this placeholder:
const pts = [/* your Point array */];

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#4466aa';
ctx.lineWidth = 1.5;
ctx.beginPath();
pts.forEach((p, i) => {
  const sx = p.x + 250;
  const sy = 250 - p.y;           // flip y for screen coordinates
  i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
});
ctx.stroke();
</script>
</body>
</html>
```

Alternatively, add a small script to `src/main.ts` that writes an SVG file,
similar to the original PS0.

---

### Part 5 — Write your own tests

Open `test/nav.test.ts` and scroll to the bottom. Add **at least two**
test cases of your own. Think about:

- Edge cases (negative coordinates, very large values, `numSides = 3`)
- Properties that should always hold (symmetry, scaling, triangle inequality)
- Anything the provided tests don't already cover

This mirrors the real PS0, which expects you to write additional Mocha tests
to verify your own code.

---

## Skills practised (maps to 6.102 PS0)

| PS0 skill                          | This exercise                        |
|------------------------------------|--------------------------------------|
| TypeScript types and interfaces    | `Point`, `Navigator` types           |
| Trigonometry (`sin`, `atan2`)      | `chordLength`, `bearing`             |
| Pythagorean distance               | `distance`                           |
| DRY principle                      | `polygonPerimeter`, `totalPathLength`|
| Mocha: run tests, read failures    | `npm test`                           |
| Write your own test cases          | Part 5                               |
| Open-ended creative function       | `generatePattern`                    |
| Function specifications (JSDoc)    | All functions                        |
