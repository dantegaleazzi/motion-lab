import test from "node:test";
import assert from "node:assert/strict";
import { normalize, frameAt, MotionScene } from "./motion.js";
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
  for (const mode of [
    "portal",
    "orbit",
    "cascade",
    "tunnel",
    "carousel",
    "marquee",
  ])
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

test("manual navigation wraps, respects reverse and preserves paused playback", () => {
  for (const mode of [
    "portal",
    "orbit",
    "cascade",
    "tunnel",
    "carousel",
    "marquee",
  ])
    for (const direction of [-1, 1]) {
      const scene = Object.assign(Object.create(MotionScene.prototype), {
        config: normalize({ mode, direction }),
        phase: 0.99,
        pendingStep: 0,
        playing: false,
        media: { matches: true },
        draw() {},
      });
      scene.step(1);
      assert.ok(scene.phase >= 0 && scene.phase < 1);
      scene.step(-1);
      assert.ok(Math.abs(scene.phase - 0.99) < 1e-9);
      assert.equal(scene.playing, false);
      scene.step(NaN);
      assert.ok(Number.isFinite(scene.phase));
    }
});

test("a paused scene can smoothly step and stops scheduling when settled", () => {
  const previousFrame = globalThis.requestAnimationFrame;
  const previousDocument = globalThis.document;
  let scheduled = 0;
  globalThis.requestAnimationFrame = () => ++scheduled;
  globalThis.document = { hidden: false };
  try {
    const scene = Object.assign(Object.create(MotionScene.prototype), {
      config: normalize({ mode: "carousel" }),
      phase: 0.08,
      pendingStep: 0,
      playing: false,
      inView: true,
      media: { matches: false },
      last: 0,
      draw() {},
      schedule() {},
    });
    scene.step(1);
    for (let i = 1; i <= 120; i++) scene.tick(i * 16);
    assert.equal(scene.pendingStep, 0);
    assert.ok(Math.abs(scene.phase - (0.08 + 1 / 16)) < 1e-9);
    assert.equal(scene.playing, false);
    const before = scheduled;
    scene.tick(2000);
    assert.equal(scheduled, before);
  } finally {
    globalThis.requestAnimationFrame = previousFrame;
    globalThis.document = previousDocument;
  }
});

test("full-image presets default to no frame while allowing an explicit white frame", () => {
  assert.equal(normalize({ format: "full" }).frame, "none");
  assert.equal(normalize({ format: "full", frame: "white" }).frame, "white");
  assert.equal(normalize({ frame: "none" }).frame, "none");
  assert.equal(normalize({ frame: "invalid" }).frame, "white");
});
