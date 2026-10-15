import test from "node:test";
import assert from "node:assert/strict";
import { normalize, frameAt } from "./motion.js";
import { safeJSON } from "./export.js";
test("shared presets cannot inject unknown modes or unbounded geometry", () => {
  const c = normalize({
    mode: "<script>",
    speed: "Infinity",
    size: 100000,
    count: -10,
    tilt: NaN,
    depth: 9,
    center: "false",
  });
  assert.equal(c.mode, "portal");
  assert.equal(c.speed, 1);
  assert.equal(c.size, 260);
  assert.equal(c.count, 6);
  assert.equal(c.depth, 1);
  assert.equal(c.center, false);
});
test("all motions stay finite across viewports, boundaries and depth extremes", () => {
  for (const mode of ["portal", "orbit", "cascade"])
    for (const width of [0, 320, 1440])
      for (const depth of [0, 1])
        for (const p of [0, 0.001, 0.25, 0.5, 0.99, 1]) {
          const frame = frameAt(p, 1, normalize({ mode, depth }), width, 500);
          assert.ok(Object.values(frame).every(Number.isFinite));
          assert.ok(frame.opacity >= 0 && frame.opacity <= 1);
          assert.ok(frame.cardWidth <= width * 0.35);
        }
});
test("portal converges to the center and fades before looping", () => {
  const c = normalize();
  const start = frameAt(0, 0, c, 800, 500),
    end = frameAt(1, 0, c, 800, 500);
  assert.equal(start.opacity, 0);
  assert.equal(end.opacity, 0);
  assert.ok(Math.abs(end.x) < 1e-9);
  assert.ok(end.z < start.z);
});
test("exported titles cannot close the script element", () => {
  const value = { title: "</script><script>alert(1)</script>\u2028" };
  const json = safeJSON(value);
  assert.ok(!json.includes("<"));
  assert.deepEqual(JSON.parse(json), value);
});
