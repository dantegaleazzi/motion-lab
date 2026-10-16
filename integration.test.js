import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { JSDOM } from "jsdom";
import { makeEmbed } from "./export.js";
import { normalize } from "./motion.js";

test("website embed contains one isolated frame, embedded assets and intact hostile copy", async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (url) => new Response(await fs.readFile(url));
  try {
    const hostile =
      '</script><script>window.injected=true</script>" & <b>title</b>';
    const config = normalize({
      mode: "carousel",
      format: "full",
      frame: "none",
      center: false,
    });
    const code = await makeEmbed(config, [
      { src: "data:image/png;base64,aGVsbG8=", title: hostile },
    ]);
    const host = new JSDOM(`<body><h1>Host page</h1>${code}${code}</body>`);
    const frames = host.window.document.querySelectorAll("iframe");
    assert.equal(frames.length, 2);
    assert.equal(
      host.window.document.querySelectorAll("script, style").length,
      0,
    );
    assert.equal(host.window.document.body.children.length, 3);
    for (const frame of frames) {
      assert.equal(frame.getAttribute("sandbox"), "allow-scripts");
      assert.equal(frame.style.height, "520px");
      const html = frame.getAttribute("srcdoc");
      assert.match(html, /Permission is hereby granted/);
      assert.match(html, /# Asset licenses and credits/);
      assert.match(html, /height:calc\(100% - 64px\)/);
      const content = new JSDOM(html).window.document;
      const scripts = content.querySelectorAll("script");
      assert.equal(scripts.length, 1);
      assert.equal(scripts[0].hasAttribute("src"), false);
      assert.doesNotThrow(() => new Function(scripts[0].textContent));
      assert.ok(!/^import /m.test(scripts[0].textContent));
      assert.equal(content.querySelectorAll("button").length, 3);
      const actualItems = JSON.parse(
        scripts[0].textContent.match(/const items=(.*);/)[1],
      );
      assert.equal(actualItems[0].title, hostile);
      assert.equal(actualItems[0].src, "data:image/png;base64,aGVsbG8=");
      assert.deepEqual(
        JSON.parse(scripts[0].textContent.match(/const config=(.*);/)[1]),
        config,
      );
    }
  } finally {
    globalThis.fetch = previousFetch;
  }
});
