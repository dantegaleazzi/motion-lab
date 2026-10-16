# Changelog

## Unreleased

- Add copy/paste website embeds with self-contained images, sandboxed isolation, playback controls and live preview.
- Add a reusable React component, a runnable Strict Mode example, integration documentation and lifecycle/export tests.

- Add Tunnel, Carousel and Marquee alongside the three original motion styles.
- Add Original, Immersive, Gallery and Minimal visual presets.
- Add full-image cards without captions or gradients, with No frame selected by default and an independent No frame / White frame selector.
- Add smooth backward/forward steps in the playground, landing starter and HTML exports, including while paused; reduced-motion users get immediate steps.

## v0.3.0 — 2026-10-16

First public release of **Motion Lab by Dante Galeazzi**.

- Three image and card animations: Portal, Orbit and Cascade.
- Travel, Objects and Editorial photo collections, plus local image selection.
- Live speed, size, count, depth, tilt and direction controls.
- Photos, text cards and mixed formats; pause, restart and fullscreen.
- Self-contained HTML export with embedded images and license notices.
- Shareable configuration links; local images stay on the user's device.
- Historical Sted landing case and a customizable Sted preset.
- Visual documentation, asset credits, contribution guide and automated checks.
- A downloadable landing-page starter with a single copy/image/motion configuration file.
- A fuller initial portal composition: 16 cards at 210px.

### Scope of this release

Motion Lab is a browser playground and reusable vanilla JavaScript source. It is not an npm package, a video/GIF exporter or a ready-made React component. Animated image inputs become a still frame. Local images are not persisted on refresh or included in shared links; exported HTML does include them.

The playground needs a static server. Exported HTML runs directly from a file in a modern browser. See [browser QA](docs/BROWSER_QA.md) for tested environments and verification limits.
