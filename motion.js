export const defaults = Object.freeze({
  mode: "portal",
  collection: "travel",
  format: "mixed",
  speed: 1,
  count: 12,
  size: 180,
  depth: 0.85,
  tilt: 28,
  direction: 1,
  center: true,
});
export function normalize(input = {}) {
  const number = (key, low, high) =>
    Number.isFinite(Number(input[key]))
      ? Math.min(high, Math.max(low, Number(input[key])))
      : defaults[key];
  return {
    mode: ["portal", "orbit", "cascade"].includes(input.mode)
      ? input.mode
      : defaults.mode,
    collection: ["travel", "objects", "editorial"].includes(input.collection)
      ? input.collection
      : defaults.collection,
    format: ["mixed", "photos", "cards"].includes(input.format)
      ? input.format
      : defaults.format,
    speed: number("speed", 0.25, 2.5),
    count: Math.round(number("count", 6, 20) / 2) * 2,
    size: number("size", 120, 260),
    depth: number("depth", 0, 1),
    tilt: number("tilt", 0, 45),
    direction: Number(input.direction) === -1 ? -1 : 1,
    center: input.center === false || input.center === "false" ? false : true,
  };
}
export function frameAt(p, index, config, width, height) {
  const cardWidth = Math.min(config.size, width * 0.35);
  let x = 0,
    y = 0,
    z = 0,
    rotateY = 0,
    rotateZ = 0,
    opacity = 1;
  if (config.mode === "portal") {
    const side = index % 2 === 0 ? -1 : 1;
    const scale = 1 - 0.72 * config.depth * Math.min(p / 0.84, 1);
    x = (side * (width / 2 + cardWidth) * Math.pow(1 - p, 1.4)) / scale;
    z = 1200 * (1 - 1 / scale);
    rotateY =
      side * config.tilt * (1 - Math.min(Math.max((p - 0.4) / 0.4, 0), 1));
    opacity = Math.min(p / 0.035, (1 - p) / 0.07, 1);
  } else if (config.mode === "orbit") {
    const theta = p * Math.PI * 2;
    const scale = 1 - (config.depth * 0.38 * (1 - Math.sin(theta))) / 2;
    x =
      (Math.cos(theta) * Math.max(38, width / 2 - cardWidth * 0.65 - 24)) /
      scale;
    y = (Math.sin(theta) * Math.min(height * 0.25, 130)) / scale;
    z = 1200 * (1 - 1 / scale);
    rotateY = Math.cos(theta) * config.tilt * 0.45;
    opacity = 0.65 + (0.35 * (1 + Math.sin(theta))) / 2;
  } else {
    const scale = 1 - config.depth * 0.18;
    x = ((width / 2 + cardWidth) * (1 - 2 * p)) / scale;
    y =
      (Math.sin(p * Math.PI * 2) * height * 0.15 + (p - 0.5) * height * 0.18) /
      scale;
    z = 1200 * (1 - 1 / scale);
    rotateZ = Math.sin(p * Math.PI * 2) * config.tilt * 0.35;
    opacity = Math.min(p / 0.05, (1 - p) / 0.05, 1);
  }
  return {
    x,
    y,
    z,
    rotateY,
    rotateZ,
    opacity: Math.max(0, opacity),
    cardWidth,
  };
}

export class MotionScene {
  constructor(root, items, config = {}, onState = () => {}) {
    this.root = root;
    this.items = items;
    this.config = normalize(config);
    this.onState = onState;
    this.phase = 0.08;
    this.last = 0;
    this.inView = true;
    this.destroyed = false;
    this.media = matchMedia("(prefers-reduced-motion: reduce)");
    this.playing = !this.media.matches;
    this.width = root.clientWidth;
    this.height = root.clientHeight;
    root.classList.add("motion-scene");
    this.layer = document.createElement("div");
    this.layer.className = "motion-layer";
    this.layer.setAttribute("aria-hidden", "true");
    this.hub = document.createElement("div");
    this.hub.className = "motion-hub";
    this.hub.setAttribute("aria-hidden", "true");
    this.hub.innerHTML = "<span>✳</span>";
    root.append(this.layer, this.hub);
    this.resize = new ResizeObserver((entries) => {
      this.width = entries[0].contentRect.width;
      this.height = entries[0].contentRect.height;
      this.draw();
    });
    this.resize.observe(root);
    this.intersection = new IntersectionObserver((entries) => {
      this.inView = entries[0].isIntersecting;
      this.schedule();
    });
    this.intersection.observe(root);
    this.onVisibility = () => this.schedule();
    document.addEventListener("visibilitychange", this.onVisibility);
    this.onPreference = () => {
      if (this.media.matches) this.setPlaying(false);
    };
    this.media.addEventListener("change", this.onPreference);
    this.build();
    this.draw();
    this.schedule();
  }
  build() {
    this.layer.replaceChildren();
    this.root.dataset.mode = this.config.mode;
    this.hub.hidden = !this.config.center;
    this.cards = Array.from({ length: this.config.count }, (_, index) => {
      const item = this.items[index % this.items.length];
      const card = document.createElement("article");
      const photo =
        this.config.format === "photos" ||
        (this.config.format === "mixed" && index % 3 !== 2);
      card.className =
        "scene-card " + (photo ? "scene-card--photo" : "scene-card--text");
      card.style.setProperty(
        "--tone",
        ["#eef1e6", "#f5e4d9", "#e7edf4"][index % 3],
      );
      if (photo) {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = "";
        img.draggable = false;
        img.decoding = "async";
        card.append(img);
      }
      const copy = document.createElement("div");
      copy.className = "scene-card-copy";
      const label = document.createElement("small");
      label.textContent = item.category || "Collection";
      const title = document.createElement("strong");
      title.textContent = item.title;
      const footer = document.createElement("span");
      footer.textContent = photo
        ? "A little inspiration ↗"
        : "A thought worth coming back to. ↗";
      copy.append(label, title, footer);
      card.append(copy);
      this.layer.append(card);
      return card;
    });
  }
  update(config, items = this.items) {
    const next = normalize(config);
    const rebuild =
      items !== this.items ||
      ["count", "format", "mode"].some((k) => next[k] !== this.config[k]);
    this.config = next;
    this.items = items;
    if (rebuild) this.build();
    this.hub.hidden = !next.center;
    this.draw();
  }
  setPlaying(value) {
    this.playing = value;
    this.onState(value);
    this.schedule();
  }
  restart() {
    this.phase = 0.08;
    this.draw();
  }
  schedule() {
    cancelAnimationFrame(this.raf);
    this.last = 0;
    if (!this.destroyed && this.playing && this.inView && !document.hidden)
      this.raf = requestAnimationFrame((t) => this.tick(t));
  }
  tick(now) {
    const delta = this.last ? Math.min((now - this.last) / 1000, 0.05) : 0;
    this.last = now;
    this.phase =
      (this.phase +
        (delta * this.config.speed * this.config.direction) / 6.321752 +
        1) %
      1;
    this.draw();
    this.raf = requestAnimationFrame((t) => this.tick(t));
  }
  draw() {
    this.cards?.forEach((card, index) => {
      const offset =
        this.config.mode === "portal"
          ? (Math.floor(index / 2) + (index % 2) * 0.5) /
            (this.cards.length / 2)
          : index / this.cards.length;
      const f = frameAt(
        (this.phase + offset) % 1,
        index,
        this.config,
        this.width,
        this.height,
      );
      card.style.width = f.cardWidth + "px";
      card.style.transform = `translate(-50%,-50%) translate3d(${f.x}px,${f.y}px,${f.z}px) rotateY(${f.rotateY}deg) rotateZ(${f.rotateZ}deg)`;
      card.style.opacity = f.opacity;
      card.style.zIndex = Math.round(f.z + 5000);
    });
  }
  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.resize.disconnect();
    this.intersection.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.media.removeEventListener("change", this.onPreference);
    this.layer.remove();
    this.hub.remove();
  }
}
