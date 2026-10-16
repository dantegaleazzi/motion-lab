# Motion Lab for React

A client component around the same six-motion engine used by the playground. No animation dependency; use the React already installed in your app.

Copy `MotionLab.jsx` plus the root `motion.js`, `scene.css` and `LICENSE`, preserving this layout:

```text
motion-lab/
  LICENSE
  motion.js
  scene.css
  react/MotionLab.jsx
```

```jsx
import MotionLab from "./motion-lab/react/MotionLab.jsx";
import "./motion-lab/scene.css"; // once in app entry / Next.js root layout

const images = [
  { src: "/images/mountains.jpg", title: "Mountains" },
  { src: "/images/coast.jpg", title: "Coast" },
];

export default function Hero() {
  return (
    <MotionLab
      images={images}
      config={{ mode: "portal", format: "full", frame: "none", center: false }}
      height={480}
    />
  );
}
```

Modes: `portal`, `orbit`, `cascade`, `tunnel`, `carousel`, `marquee`. Pass your full configuration; changes update the scene without restarting paused playback. `images` accepts only `src`, `title` and `category`; custom HTML markup is intentionally excluded. Use image URL strings, including `.src` when your framework returns an image object.

Optional props: `controls` (true), `height` (480 or CSS height string), `label`, `className`, `style`. Empty images show a placeholder and disable controls. Cleanup, reduced-motion preferences and visibility handling are built in. Keep the MIT license with copied code and use images you can distribute.

[Full integration instructions](../README.md#use-the-react-component) · [Runnable Strict Mode example](../examples/react/)
