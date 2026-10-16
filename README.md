<div align="center">

# Motion Lab

**Beautiful image animations. Tweak them. Take the code.**

An open-source playground by [Dante Galeazzi](https://github.com/dantegaleazzi).

[**Try the playground ↗**](https://dantegaleazzi.github.io/motion-lab/) · [**Get the landing starter**](templates/landing/) · [**Download v0.3.0**](https://github.com/dantegaleazzi/motion-lab/releases/tag/v0.3.0)

[![License: MIT](https://img.shields.io/badge/code-MIT-788650)](LICENSE)
[![Release](https://img.shields.io/badge/release-v0.3.0-788650)](https://github.com/dantegaleazzi/motion-lab/releases)
[![Checks](https://github.com/dantegaleazzi/motion-lab/actions/workflows/checks.yml/badge.svg)](https://github.com/dantegaleazzi/motion-lab/actions/workflows/checks.yml)
![Vanilla JS](https://img.shields.io/badge/vanilla-JavaScript-e8dc71?labelColor=30372a)

[![Motion Lab playground with image cards and live controls](docs/media/playground.jpg)](https://dantegaleazzi.github.io/motion-lab/)

**Your images. Your rhythm. Your next website.**

</div>

## Six ways to move

|                                                Portal                                                 |                                               Orbit                                                |                                                 Cascade                                                  |
| :---------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| [![Portal animation](docs/media/portal.gif)](https://dantegaleazzi.github.io/motion-lab/#mode=portal) | [![Orbit animation](docs/media/orbit.gif)](https://dantegaleazzi.github.io/motion-lab/#mode=orbit) | [![Cascade animation](docs/media/cascade.gif)](https://dantegaleazzi.github.io/motion-lab/#mode=cascade) |
|                                   Bring everything into one place.                                    |                                  Give your images room to orbit.                                   |                                        Let the inspiration flow.                                         |

**Also on main:** [Tunnel](https://dantegaleazzi.github.io/motion-lab/#mode=tunnel) · [Carousel](https://dantegaleazzi.github.io/motion-lab/#mode=carousel) · [Marquee](https://dantegaleazzi.github.io/motion-lab/#mode=marquee)

_Real recordings from the playground. Prefer less motion? Open the [static preview](docs/media/playground.jpg)._

## Make something yours in a minute

1. **Pick a motion.** Portal, Orbit, Cascade, Tunnel, Carousel or Marquee. Start with Travel, Objects or Editorial photos.
2. **Pick a look.** Original, Immersive, Gallery or Minimal presets combine motion and card styling in one click. Use Full image for edge-to-edge photography without text or frames.
3. **Bring your images.** Drop files or choose them from your device. They stay in your browser.
4. **Find your rhythm.** Change speed, count, size, depth, tilt and direction. Start with 16 cards at 210px.
5. **Take it with you.** Paste a website embed, use the React component, or download a standalone HTML file. Your chosen images are included in HTML and embed exports.

Make a hero for your portfolio, a product showcase, an editorial collection, or a landing page with a little more life. No sign-up. No runtime packages. No build step.

## Want a whole website? Start here.

[![Landing starter with an animated hero](docs/media/landing.jpg)](https://dantegaleazzi.github.io/motion-lab/templates/landing/)

A responsive landing page with the animation already wired up: hero, benefits, story and a final CTA. Change the copy, colors, images and motion in **one config file**, then make it your own.

[**Preview the starter ↗**](https://dantegaleazzi.github.io/motion-lab/templates/landing/) · [**Download template ZIP**](https://github.com/dantegaleazzi/motion-lab/releases/download/v0.3.0/motion-lab-landing-v0.3.0.zip) · [**Customization guide**](templates/landing/README.md)

## Run the playground locally

Download the [source ZIP](https://github.com/dantegaleazzi/motion-lab/archive/refs/heads/main.zip), or clone it:

```sh
git clone https://github.com/dantegaleazzi/motion-lab.git
cd motion-lab
python3 -m http.server 5186 --bind 127.0.0.1
```

Open **http://127.0.0.1:5186/**. No install is needed to use the playground. A static server is required because it uses JavaScript modules and loads export assets. The generated standalone HTML files work directly from disk.

## Paste an animation into your website

1. Open the [playground](https://dantegaleazzi.github.io/motion-lab/), choose your animation and add your images.
2. Click **Embed in your website**. Check the live preview, then **Copy embed**.
3. Paste the complete snippet into a **custom/raw HTML block** on your website. Publish or preview the page to run it.

The snippet is one sandboxed `<iframe srcdoc="…">`: animation code, styles, images, playback buttons and license notices are included. It does **not** depend on Motion Lab's hosting or upload your images. Multiple embeds are isolated from each other and your page's CSS. Width is 100%; change `height:520px` in the snippet to fit your layout. It starts paused when the visitor requests reduced motion.

Your editor must allow **iframes, srcdoc and scripts inside the frame**. Some website builders strip these or limit HTML size; restrictive Content Security Policy settings can also block inline scripts, styles or data images. If your editor rejects the snippet, use **Download HTML**, host that file alongside your website, then embed its URL:

```html
<iframe
  src="/animations/my-motion.html"
  title="Animated image collection"
  style="display:block;width:100%;height:520px;border:0"
  loading="lazy"
  sandbox="allow-scripts"
></iframe>
```

Many large photos make a large snippet. Use a small optimized image set or the React/engine integration with normally hosted images for lighter page downloads. The embed is a fixed snapshot: change it in the playground and copy again to update it. Playback controls are included; the editor's full control panel is not.

## Use the React component

Copy these files into your app **keeping their relative paths**:

```text
src/components/motion-lab/
├── LICENSE
├── motion.js
├── scene.css
└── react/
    └── MotionLab.jsx
```

The component uses your app's React installation; there is no additional animation package to install. Import the stylesheet **once** in your app entry, or in your root layout when using Next.js. The component includes `"use client"` and creates the animation only after mounting.

```jsx
// App.jsx (adjust paths to your project)
import MotionLab from "./components/motion-lab/react/MotionLab.jsx";
import "./components/motion-lab/scene.css";

const images = [
  { src: "/images/mountains.jpg", title: "Mountains", category: "Travel" },
  { src: "/images/coast.jpg", title: "Coast", category: "Travel" },
];

export default function App() {
  return (
    <MotionLab
      images={images}
      config={{
        mode: "carousel",
        format: "full",
        frame: "none",
        center: false,
        count: 16,
        speed: 1,
      }}
      height={480}
    />
  );
}
```

Use publicly served image paths or your bundler's imported image URLs. Supply `src`, not an entire image import object. Images stay under your control; the component does not upload or embed them. A parent page with a restrictive CSP must permit your chosen image origins.

| Prop                 | Default                       | Purpose                                                                                                                                           |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `images`             | `[]`                          | Array of `{ src, title?, category? }`; an empty array shows a helpful placeholder. Keep the array stable between renders when practical.          |
| `config`             | Engine defaults               | Any `normalize()` options, including all six modes. Changes update the existing scene and preserve paused playback. Pass your full configuration. |
| `height`             | `480`                         | Scene height: a number in pixels or a CSS string such as `"60vh"`.                                                                                |
| `controls`           | `true`                        | Show accessible backward, play/pause and forward buttons.                                                                                         |
| `label`              | `"Animated image collection"` | Accessible name for the visual collection.                                                                                                        |
| `className`, `style` | Empty                         | Customize the outer section.                                                                                                                      |

Multiple instances work independently. The component cleans up animation frames, observers and listeners on unmount, including React Strict Mode's development remount. Reduced-motion preferences and offscreen/background pauses come from the shared engine. Image cards are decorative within a named visual; present essential content as accessible page text too. Custom Sted HTML card markup is not part of this React API.

**Try the runnable example** (Node.js 22.12+; use a current Node 22 or 24 release):

```sh
npm ci
npm run dev:react
```

Open **http://127.0.0.1:5188/**. Change between all six modes, pause, step and unmount/remount. This optional example uses Vite; the main playground still runs without an install or build. [Component source and guide](react/) · [Example files](examples/react/).

## Use the engine directly

Copy `motion.js` and `scene.css` into your project, include the CSS and give the scene a height:

```html
<link rel="stylesheet" href="./scene.css" />
<div id="my-motion" style="height: 480px"></div>
<script type="module">
  import { MotionScene } from "./motion.js";

  const scene = new MotionScene(
    document.querySelector("#my-motion"),
    [
      {
        src: "./my-photo.jpg",
        title: "A little inspiration",
        category: "Explore",
      },
    ],
    { mode: "portal", speed: 1, count: 16, size: 210 },
  );

  // scene.setPlaying(false);
  // scene.step(1);  // move forward; -1 moves backward, including while paused
  // scene.update({ mode: 'orbit', speed: 0.5 });
  // scene.destroy(); // when removing the scene from your application
</script>
```

Pass at least one image item. `update()` uses defaults for omitted options; pass your full configuration to preserve customized values. The engine supports pause, restart, resize, visibility handling and cleanup. Keep the MIT notice with copies of the code.

## Controls & practical details

The expanded motion styles, visual presets and frame controls are available on `main`. The published v0.3.0 ZIPs retain the original three-motion release.

| Control         | Range / behavior                                                   |
| --------------- | ------------------------------------------------------------------ |
| Motion          | Portal, Orbit, Cascade, Tunnel, Carousel, Marquee                  |
| Speed           | 0.25×–2.5×, with Slow / Original / Fast presets                    |
| Card count      | 6–20; default 16                                                   |
| Card size       | 120–260px; default 210px, responsive to the canvas                 |
| Card appearance | Mixed, photo + text, text cards, or full image                     |
| Image border    | No frame or White frame, independent of card style                 |
| Advanced        | Depth, tilt, reverse direction, center mark                        |
| Playback        | Play/pause, step backward/forward, restart, fullscreen, reset      |
| Your images     | Up to 12 JPG, PNG, WebP, AVIF or GIF files, under 10 MB each       |
| Exports         | Standalone HTML and website embed with images and notices included |
| Sharing         | A URL with your configuration and a sample collection              |

Images are resized in the browser to a maximum dimension of 1000px. Animated inputs become a still frame. Local images disappear on refresh and are **not** included in shared preset links; they **are** included in exported HTML. The interface loads DM Sans from Google Fonts with a system-font fallback; exports use system fonts and do not need network requests to animate.

Current `main` includes the React component and website embed. Motion Lab does not export video/GIF and is not published as an npm package. The v0.3.0 release ZIPs predate these integrations; clone or download `main` for the latest source. See [release notes](CHANGELOG.md) and [browser QA](docs/BROWSER_QA.md) for the exact scope and verification limits.

## Originally built for Sted

[![Sted's original landing with cards converging on its mascot](examples/sted/preview.jpg)](https://dantegaleazzi.github.io/motion-lab/examples/sted/)

I built the original portal animation for Sted, then opened it up as Motion Lab. The historical landing is preserved as a case, with a button to load its cards and motion into the playground. Sted is an example; Motion Lab is an independent project.

[**Explore the original ↗**](https://dantegaleazzi.github.io/motion-lab/examples/sted/)

## Contribute a little movement

Ideas, browser fixes, useful presets and thoughtful new motions are welcome. [Read the contribution guide](CONTRIBUTING.md), [report a bug](https://github.com/dantegaleazzi/motion-lab/issues) or open a focused pull request with a screenshot or recording.

With a current Node.js 22 or 24 release, run `npm ci` then `npm test`. React, Vite, esbuild and JSDOM are development dependencies for the optional example and integration tests; the vanilla playground has no runtime packages. Checks run automatically on pushes and pull requests. Motion geometry lives in `motion.js`, the shared styles in `scene.css`, and exports reuse the same engine. [Possible next experiments](IDEAS.md).

## License & credits

**Code: [MIT](LICENSE). Assets: [separate notices](ASSET_LICENSES.md).** Sample photos use the Unsplash License. Sted brand artwork and third-party content previews belong to their respective owners and are included for the historical case. Use your own branding and images for your projects, or comply with the applicable asset license. Exported HTML carries the code and asset notices; the visible attribution link is optional under MIT.

Built by [**Dante Galeazzi**](https://github.com/dantegaleazzi). If you make something with it, [share it in an issue](https://github.com/dantegaleazzi/motion-lab/issues) — I'd love to see it.
