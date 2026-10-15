import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { normalize, frameAt } from "./motion.js";
import { collections } from "./data.js";
import { makeExample } from "./export.js";

test("Sted preset keeps the historical geometry and sixteen source cards", () => {
  const config = normalize({
    collection: "sted",
    count: 16,
    depth: 1,
    size: 180,
  });
  assert.equal(config.collection, "sted");
  assert.equal(collections.sted.length, 16);
  const p = 0.5,
    w = 1000,
    scale = 1 - (1 - 110 / 420) * Math.min(p / 0.8, 1);
  const frame = frameAt(p, 0, config, w, 600);
  assert.ok(
    Math.abs(frame.x - (-1 * (w / 2 + 420) * Math.pow(1 - p, 1.4)) / scale) <
      1e-6,
  );
  assert.ok(Math.abs(frame.z - 1200 * (1 - 1 / scale)) < 1e-6);
});

test("historical snapshot and Sted cards reference existing local assets", async () => {
  const html = await fs.readFile("examples/sted/original/index.html", "utf8");
  const css = await fs.readFile("examples/sted/original/styles.css", "utf8");
  const paths = [
    ...html.matchAll(/(?:src|href)="(\.\.\/[^"?#]+)"/g),
    ...css.matchAll(/url\(["']?(\.\.\/[^"')]+)["']?\)/g),
  ].map((m) => path.resolve("examples/sted/original", m[1]));
  for (const item of collections.sted) {
    if (item.src) paths.push(path.resolve(item.src));
    paths.push(path.resolve(item.hub));
    for (const match of item.markup.matchAll(/src="(\.[^"]+)"/g))
      paths.push(path.resolve(match[1]));
  }
  for (const file of new Set(paths)) await fs.access(file);
  assert.ok(html.includes("Historical waitlist (demo only)"));
  assert.ok(!html.includes("supabase"));
});

test("Sted HTML export embeds card photos, platform icons and mascot without imports", async () => {
  const previousFetch = globalThis.fetch,
    previousReader = globalThis.FileReader;
  globalThis.fetch = async (url) => {
    const file = await fs.readFile(url);
    return new Response(file, {
      headers: {
        "content-type": String(url).endsWith(".svg")
          ? "image/svg+xml"
          : "application/octet-stream",
      },
    });
  };
  globalThis.FileReader = class {
    async readAsDataURL(blob) {
      this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")}`;
      this.onload();
    }
  };
  try {
    const html = await makeExample(
      normalize({ collection: "sted", count: 16 }),
      collections.sted,
    );
    assert.ok(html.includes("Motion Lab by Dante Galeazzi"));
    const script = html.match(/<script type="module">([\s\S]*)<\/script>/)[1];
    assert.doesNotThrow(() => new Function(script));
    assert.ok(!/^import /m.test(script));
    assert.ok(!script.includes('src=\\"./assets/'));
    assert.ok((html.match(/data:image\/svg\+xml/g) || []).length >= 16);
  } finally {
    globalThis.fetch = previousFetch;
    globalThis.FileReader = previousReader;
  }
});
