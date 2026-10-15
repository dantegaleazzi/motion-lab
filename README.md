# Motion Lab by Dante Galeazzi

**A little movement. A lot of possibility.**

A small, open-source playground for image and card animations. Pick a motion, bring your images, adjust the rhythm, and take a standalone example with you. Vanilla JavaScript, CSS transforms, no runtime packages or build step.

[Try the playground](https://dantegaleazzi.github.io/motion-lab/) · [Contribute](CONTRIBUTING.md) · [MIT code license](LICENSE)

## What you can make

- **Portal** — two streams of cards converge toward a central mark.
- **Orbit** — images move around an elliptical path, with adjustable depth.
- **Cascade** — a flowing diagonal stream of cards.
- Three photo collections: **Travel, Objects, Editorial**. Display photos, text cards, or a mix.
- Speed from **0.25× to 2.5×**, 6–20 cards, size, depth, tilt, reverse direction, and an optional center mark (Portal and Orbit).
- Pause, restart, fullscreen, and one-click reset.

## Run locally

```sh
git clone https://github.com/dantegaleazzi/motion-lab.git
cd motion-lab
python3 -m http.server 5186 --bind 127.0.0.1
```

Open http://127.0.0.1:5186/. Use a static server: the playground loads JavaScript modules and fetches export assets, so opening its `index.html` directly from disk is not supported.

## Bring your images

Drop images into the image picker or choose files. Up to 12 JPG, PNG, WebP, AVIF, or GIF files, each under 10 MB. Images are resized to a maximum dimension of 1000px in the browser; animated images become a still frame. Files remain in memory, never go to a server, and disappear on refresh. Sample photos are served from this repository; the interface loads DM Sans from Google Fonts with a system-font fallback.

## Use it in your own project

1. Choose a motion and adjust the controls.
2. **Copy code** or **Download** prepares a complete HTML document. In the export dialog, choose **Copy HTML** or **Save HTML file**.
3. Open the exported HTML directly in a modern browser, or adapt its scene markup, styles, and inline script to your site. Exports include embedded images, the shared animation engine, and a play/pause control. They require no server, external fonts, or network requests to animate.

You can also reuse `MotionScene` directly:

```js
import { MotionScene } from "./motion.js";
const scene = new MotionScene(
  document.querySelector("#my-scene"),
  [
    {
      src: "./my-photo.jpg",
      title: "A little inspiration",
      category: "Travel",
    },
  ],
  { mode: "portal", speed: 0.5, count: 10 },
);
// Include scene.css and give #my-scene a height.
scene.setPlaying(false);
scene.update({ mode: "orbit", speed: 1 }); // omitted options use defaults
// scene.destroy() when removing it from your application.
```

**Share preset** copies a URL containing the controls and the selected sample collection. It does not include your local images or filenames. When using your own images, the shared URL falls back to your last selected sample collection. Exported HTML, unlike shared links, does include your images.

## Accessibility & performance

The playground and exported examples start paused when `prefers-reduced-motion` is enabled. Visitors can explicitly press Play. Animation stops requesting frames while its canvas is offscreen or the document is hidden. Controls support keyboard use, visible focus, labels, and pressed states. Images are decorative; the scene has a short accessible description.

## Project map

| File                       | Purpose                                                |
| -------------------------- | ------------------------------------------------------ |
| `index.html`, `styles.css` | Playground interface and responsive layout             |
| `app.js`                   | Controls, local images, fullscreen, sharing            |
| `motion.js`, `scene.css`   | Shared animation engine and card appearance            |
| `export.js`                | Self-contained HTML export                             |
| `data.js`, `assets/`       | Sample collections, photos and source credits          |
| `motion.test.js`           | Geometry, preset validation and export escaping checks |

Run `npm test` with Node.js 20+; no install is needed. Browser QA covers the interactive behaviors separately.

## License & credits

Playground code is [MIT licensed](LICENSE). Sted archive assets, brand artwork and third-party saved-content previews are separately credited in [the archive notes](examples/sted/README.md). Sample photographs are **not covered by MIT**: they are distributed under the [Unsplash License](https://unsplash.com/license), with source links in [assets/credits.json](assets/credits.json). The interface includes Photo credits. The DM Sans interface font is provided by Google Fonts. Use images you have the right to distribute when sharing exported examples.

Built by [Dante Galeazzi](https://github.com/dantegaleazzi).

## The Sted original

[Explore the historical landing](https://dantegaleazzi.github.io/motion-lab/examples/sted/). The case recovers the original landing at commit `be5f8de` as a static snapshot with its original CSS animation. Its waitlist is demonstrative. “Try this animation” loads the Sted cards, mascot, 16-card layout and 6.321752-second portal preset into the editable playground. [Archive notes and asset licensing](examples/sted/README.md).

Motion Lab is an independent project by Dante Galeazzi. Sted is included as its original example case.
