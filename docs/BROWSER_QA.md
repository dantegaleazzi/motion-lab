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
