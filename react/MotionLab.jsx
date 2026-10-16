"use client";

// Motion Lab by Dante Galeazzi. MIT — keep the accompanying LICENSE.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MotionScene, normalize } from "../motion.js";

const EMPTY_IMAGES = [];
const EMPTY_CONFIG = {};

/** Import ../scene.css once in your app entry (or Next.js root layout). */
export default function MotionLab({
  images = EMPTY_IMAGES,
  config = EMPTY_CONFIG,
  height = 480,
  controls = true,
  label = "Animated image collection",
  className = "",
  style,
}) {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const items = useMemo(
    () =>
      (Array.isArray(images) ? images : EMPTY_IMAGES)
        .filter(
          (item) => item && typeof item.src === "string" && item.src.trim(),
        )
        .map((item, index) => ({
          src: item.src,
          title: item.title || `Image ${index + 1}`,
          category: item.category || "Collection",
        })),
    [images],
  );
  // Stable by value: inline config objects do not recreate the animation.
  const configKey = JSON.stringify(normalize(config));

  useEffect(() => {
    if (!items.length) {
      sceneRef.current?.destroy();
      sceneRef.current = null;
      setPlaying(false);
      return;
    }
    const options = JSON.parse(configKey);
    if (sceneRef.current) {
      sceneRef.current.update(options, items);
    } else {
      const scene = new MotionScene(
        hostRef.current,
        items,
        options,
        setPlaying,
      );
      sceneRef.current = scene;
      setPlaying(scene.playing);
    }
  }, [items, configKey]);

  useEffect(
    () => () => {
      sceneRef.current?.destroy();
      sceneRef.current = null;
    },
    [],
  );

  return (
    <section
      className={`motion-react ${className}`.trim()}
      style={style}
      aria-label={label}
    >
      <div
        ref={hostRef}
        className="motion-react-scene"
        style={{ height }}
        role="img"
        aria-label={label}
      />
      {!items.length && (
        <p className="motion-react-empty" role="status">
          Add at least one image to start.
        </p>
      )}
      {controls && (
        <div
          className="motion-react-controls"
          role="group"
          aria-label="Animation playback"
        >
          <button
            type="button"
            disabled={!items.length}
            aria-label="Step backward"
            onClick={() => sceneRef.current?.step(-1)}
          >
            ←
          </button>
          <button
            type="button"
            disabled={!items.length}
            onClick={() => {
              const scene = sceneRef.current;
              if (scene) scene.setPlaying(!scene.playing);
            }}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            disabled={!items.length}
            aria-label="Step forward"
            onClick={() => sceneRef.current?.step(1)}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
