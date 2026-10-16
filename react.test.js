import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import React, { act, StrictMode } from "react";
import { renderToString } from "react-dom/server";

const output = await build({
  entryPoints: ["react/MotionLab.jsx"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  write: false,
  jsx: "automatic",
});
const cache = path.resolve("node_modules/.cache/motion-lab");
await fs.mkdir(cache, { recursive: true });
const file = path.join(cache, `react-${process.pid}.mjs`);
await fs.writeFile(file, output.outputFiles[0].text);
const { default: MotionLab } = await import(pathToFileURL(file));
await fs.unlink(file);
const images = [
  { src: "/one.jpg", title: "One" },
  { src: "/two.jpg", title: "Two" },
];

test("React component can render on the server without browser globals", () => {
  assert.equal(typeof globalThis.document, "undefined");
  const html = renderToString(React.createElement(MotionLab, { images }));
  assert.match(html, /Animation playback/);
  assert.ok(!html.includes("motion-layer"));
});

test("React Strict Mode updates preserve pause, instances are independent and unmount cleans resources", async () => {
  const dom = new JSDOM('<div id="root"></div>', {
    pretendToBeVisual: true,
    url: "http://localhost",
  });
  const activeObservers = new Set(),
    mediaListeners = new Set(),
    frames = new Map(),
    visibility = new Set();
  let nextFrame = 0,
    reduced = false;
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.requestAnimationFrame = (cb) => {
    frames.set(++nextFrame, cb);
    return nextFrame;
  };
  globalThis.cancelAnimationFrame = (id) => frames.delete(id);
  const originalAdd = document.addEventListener.bind(document),
    originalRemove = document.removeEventListener.bind(document);
  document.addEventListener = (type, fn, ...args) => {
    if (type === "visibilitychange") visibility.add(fn);
    return originalAdd(type, fn, ...args);
  };
  document.removeEventListener = (type, fn, ...args) => {
    if (type === "visibilitychange") visibility.delete(fn);
    return originalRemove(type, fn, ...args);
  };
  const media = {
    get matches() {
      return reduced;
    },
    addEventListener(type, fn) {
      mediaListeners.add(fn);
    },
    removeEventListener(type, fn) {
      mediaListeners.delete(fn);
    },
  };
  globalThis.matchMedia = () => media;
  class Observer {
    observe() {
      activeObservers.add(this);
    }
    disconnect() {
      activeObservers.delete(this);
    }
  }
  globalThis.ResizeObserver = Observer;
  globalThis.IntersectionObserver = Observer;
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root"));
  const render = (config = {}, both = false, list = images) =>
    act(async () =>
      root.render(
        React.createElement(
          StrictMode,
          null,
          React.createElement(MotionLab, { images: list, config }),
          both &&
            React.createElement(MotionLab, {
              images,
              config: { mode: "orbit" },
            }),
        ),
      ),
    );
  try {
    await render();
    assert.equal(document.querySelectorAll(".motion-layer").length, 1);
    assert.equal(document.querySelectorAll(".scene-card").length, 16);
    assert.equal(activeObservers.size, 2);
    assert.equal(mediaListeners.size, 1);
    assert.equal(visibility.size, 1);
    assert.equal(frames.size, 1);
    const layer = document.querySelector(".motion-layer");
    await act(async () =>
      [...document.querySelectorAll("button")]
        .find((b) => b.textContent === "Pause")
        .click(),
    );
    assert.equal(frames.size, 0);
    await render({
      mode: "carousel",
      speed: 2,
      format: "full",
      frame: "none",
      center: false,
    });
    assert.equal(document.querySelector(".motion-layer"), layer);
    assert.equal(
      document.querySelector(".motion-scene").dataset.mode,
      "carousel",
    );
    assert.equal(document.querySelectorAll(".scene-card-copy").length, 0);
    assert.equal(document.querySelectorAll("button")[1].textContent, "Play");
    await act(async () =>
      document.querySelector('[aria-label="Step forward"]').click(),
    );
    assert.equal(frames.size, 1);
    await render({ mode: "carousel" }, true);
    assert.equal(document.querySelectorAll(".motion-layer").length, 2);
    assert.equal(activeObservers.size, 4);
    const sections = document.querySelectorAll(".motion-react");
    assert.equal(sections[0].querySelectorAll("button")[1].textContent, "Play");
    assert.equal(
      sections[1].querySelectorAll("button")[1].textContent,
      "Pause",
    );
    reduced = true;
    await act(async () => {
      for (const fn of mediaListeners) fn();
    });
    assert.equal(frames.size, 0);
    await render({}, false, []);
    assert.equal(document.querySelectorAll(".motion-layer").length, 0);
    assert.equal(document.querySelectorAll("button:disabled").length, 3);
    assert.equal(activeObservers.size, 0);
    await render();
    assert.equal(document.querySelectorAll("button")[1].textContent, "Play");
    assert.equal(frames.size, 0);
    await act(async () =>
      document.querySelector('[aria-label="Step forward"]').click(),
    );
    assert.equal(frames.size, 0);
  } finally {
    await act(async () => root.unmount());
    assert.equal(frames.size, 0);
    assert.equal(activeObservers.size, 0);
    assert.equal(mediaListeners.size, 0);
    assert.equal(visibility.size, 0);
    dom.window.close();
  }
});
