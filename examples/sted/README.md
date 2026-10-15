# The Sted original

This case preserves the Sted landing at commit [`be5f8de`](https://github.com/dantegaleazzi/sted-website/tree/be5f8de), “feat: finalize winning Sted landing and navigation”. The original source remains in the Sted repository. No Sted application or backend is included here.

`original/index.html` is a static render of the original `LandingPage`, `StedMenu`, logo and footer structure. `original/styles.css` preserves the original layout, source-card styles and portal keyframes. The animation retains the 6.321752-second cycle and sixteen original content cards. The waitlist is visual only; its input is disabled and submissions remain in the browser. Navigation opens today's Sted site. `archive.js` supplies menu, pause and visibility behavior without React or network services.

The case page wraps the archived landing in an iframe to isolate its original styles from Motion Lab. Its “Try this animation” link opens a shared preset with the original cards and mascot. The playground uses the common editable engine, preserving the original portal geometry, synchronized lane spacing and rhythm; the canvas responds to its available width. Changing images or motions uses the regular playground controls. The historical snapshot stays frozen.

## Assets and attribution

- **Playground code:** MIT, see the root LICENSE.
- **Sted logo, mascot, landing copy and visual identity:** belong to Sted / Finiks Labs LLC. Included here as part of Dante Galeazzi's historical project case. They are not included in the playground's MIT license.
- **Saved-content cards:** thumbnails, platform logos, titles and excerpts retain their original owners' rights. They illustrate saved links in the historical design; they are not offered as a stock-image collection. Original source links are retained in `sted-data.js` and available in the original Sted repository.
- **Inter:** the original font is retained with its upstream OFL license where available.
- **Generated exports:** code remains reusable under MIT. Exports made with the Sted preset include its case-study assets; replace them with your own images and branding for your project.

The archive is presentation-only. It contains no Sted credentials, account data, analytics, checkout, auth or live waitlist integration.
