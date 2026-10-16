# Contributing

Small, thoughtful contributions are welcome: a motion that makes images look good, a useful preset, an accessibility improvement, or a browser fix.

1. Open an issue describing the use case and, if useful, a short visual reference.
2. Keep the playground buildless and dependency-free. Avoid adding a framework for one effect.
3. Put motion geometry in `frameAt` in `motion.js`, shared by the playground and exports. Add its name to normalization and the UI selector; do not maintain a separate export implementation.
4. Use `textContent` for user-supplied copy and `safeJSON` for embedded export data.
5. Include source and license details for any new assets. Never include credentials or personal files.
6. Run `npm ci` then `npm test` (current Node 22 or 24), then check your change on narrow and wide viewports. Verify play/pause, reduced motion, exported HTML, shared presets and local images where relevant.
7. Submit a focused pull request with what changed and a screenshot or short recording.

The optional React example and integration tests have development dependencies. They must not become runtime dependencies of the vanilla playground. Test changes to the React wrapper under Strict Mode and verify cleanup on unmount.

Please discuss substantial new controls before adding them. The canvas and a few good defaults should remain the main experience.
