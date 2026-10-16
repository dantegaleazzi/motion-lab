# v0.3.0 browser QA — 2026-10-16

This records what was actually verified for the first release, rather than claiming universal browser compatibility.

| Environment                                               | Verification                                                                                                                                                                        | Result                                                               |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Google Chrome on macOS, 1512px viewport                   | Portal, Orbit, Cascade, fullscreen, collection rendering and live controls; captured the real preview recordings                                                                    | Passed                                                               |
| Google Chrome, 390 × 844 viewport override                | Playground layout; no horizontal document overflow                                                                                                                                  | Passed; responsive simulation, not a physical phone                  |
| Codex in-app browser on macOS                             | Selected two local JPGs, confirmed loaded data images and no upload, generated HTML, checked embedded MIT and asset notices, clicked Copy HTML, downloaded `motion-lab-portal.html` | Passed; copy reported “Copied!”, download path returned              |
| Google Chrome, template ZIP contents served independently | 16 animated cards and images, populated config copy, pause button; desktop and 390px layout with no document overflow                                                               | Passed                                                               |
| Node automated checks                                     | Geometry, URL normalization, historical assets, standalone export syntax, embedded images and required license notices                                                              | Passed locally; also configured for Node 22 and 24 in GitHub Actions |

## Verification limits

- **Safari on a physical iPhone was not available.** The 390px check is responsive desktop emulation, not an iPhone/Safari certification.
- Direct opening of downloaded HTML from disk was not browser-automated because the browser tool does not allow `file:` navigation. Exported documents contain inline code, CSS and image data, with no module imports. Their syntax and embedded assets were checked; the same engine was exercised in the playground. The downloadable landing template was separately exercised over HTTP, which is its documented setup.
- Chrome file-selection automation was blocked by the extension's file-access setting. Its exact message was: “To enable file upload, open chrome://extensions, click Details under the ChatGPT browser extension, and enable \"Allow access to file URLs.\" See [here](https://developers.openai.com/codex/app/chrome-extension#upload-files) for details.” No browser permission settings were changed. Local image selection was verified in the in-app browser instead.
- Native app capture was unavailable on this host, so no separate desktop Safari run is claimed.

Reduced-motion pause and visibility handling are implemented in the shared engine. A physical-device review remains useful before promising a supported mobile-browser matrix.

## Navigation and visual options follow-up — 2026-10-16

- Ten Node tests pass, including all six motions, navigation wrap/reverse, paused easing and the full-image frame default.
- In-app browser: all six motion buttons set the matching engine mode and label. All four visual presets select the intended geometry and card styling.
- Full image / No frame: computed border is 0px and there are no caption elements on the sample image cards. White frame restores the border; No frame removes it again.
- Forward/backward navigation moves cards while keeping playback paused. The landing starter and standalone carousel HTML also respond to manual steps.
- Desktop and narrow layouts checked. The narrow browser reported an actual CSS viewport of 354px (390px override with existing browser zoom): no horizontal overflow; step controls are approximately 44px square. Template also has no horizontal overflow at the narrow viewport.
- All six full-image standalone HTML exports parse and include navigation plus frame configuration; a standalone carousel export was opened through a separate local HTTP server and checked for borderless images and a working forward step. Direct file: opening and physical-device checks were not repeated.
- Entry modules and changed styles use a cache version so existing preview sessions receive the new controls.

## Website embed and React follow-up — 2026-10-16

- Thirteen Node tests pass: iframe escaping and isolation, embedded image/config/license preservation, server rendering without browser globals, and real React Strict Mode mounting/updating/unmounting. Tests check independent instances, preserved pause, reduced motion, empty inputs and cleanup of frames, observers and listeners.
- The optional React/Vite example builds successfully for production. Vite notes that the `use client` directive is not retained in its client-only bundle; the copied JSX source retains it. A full Next.js app build was not run.
- In-app browser: generated the full-image website embed, rendered its sandboxed live preview and clicked Copy embed (reported “Copied!”).
- Pasted the complete generated snippet twice into an independent HTTP-served page with deliberately conflicting button/article styles. Both frames render 16 cards and independent play/pause controls; manual forward navigation moves the first frame while paused. The host heading and frame styles remain separate. No browser console errors were recorded.
- React example: all six mode buttons update the scene, all selected sample photos load, changing mode preserves pause, and unmount/remount removes/recreates exactly one scene layer. No browser console errors were recorded.
- The independent embed page and React example have no horizontal overflow at an actual CSS viewport of 354px (390px override with the existing browser zoom). This is desktop responsive simulation, not physical iPhone/Safari testing.
- Compatibility limits: builders may strip srcdoc/scripts or limit snippet size; site CSP may block inline code/styles/data images. The README includes a hosted-HTML iframe fallback. No claim of testing every website builder or framework is made.
