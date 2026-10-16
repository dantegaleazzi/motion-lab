import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import MotionLab from "../../react/MotionLab.jsx";
import "../../scene.css";
import "./styles.css";
import alpine from "../../assets/alpine.jpg";
import lake from "../../assets/lake.jpg";
import ocean from "../../assets/ocean.jpg";
import forest from "../../assets/forest.jpg";

const images = [alpine, lake, ocean, forest].map((src, index) => ({
  src,
  title: `A little inspiration ${index + 1}`,
}));
function App() {
  const [mode, setMode] = useState("portal");
  const [mounted, setMounted] = useState(true);
  return (
    <main>
      <a href="https://dantegaleazzi.github.io/motion-lab/">
        ← Motion Lab playground
      </a>
      <p className="eyebrow">REACT COMPONENT · SAME MOTION ENGINE</p>
      <h1>
        A little motion.
        <br />
        <span>Inside your app.</span>
      </h1>
      <p>
        Change the mode, pause, step through the images, or unmount the
        component.
      </p>
      <nav aria-label="Animation style">
        {["portal", "orbit", "cascade", "tunnel", "carousel", "marquee"].map(
          (value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              {value}
            </button>
          ),
        )}
      </nav>
      <div className="example-canvas">
        {mounted ? (
          <MotionLab
            images={images}
            config={{
              mode,
              format: "full",
              frame: "none",
              center: false,
              count: 16,
            }}
            height={420}
          />
        ) : (
          <p className="unmounted">
            Component unmounted. Animation and observers cleaned up.
          </p>
        )}
      </div>
      <button type="button" onClick={() => setMounted(!mounted)}>
        {mounted ? "Unmount component" : "Mount component"}
      </button>
      <p className="note">
        Rendered inside React Strict Mode. The base playground still needs no
        React.
      </p>
    </main>
  );
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
