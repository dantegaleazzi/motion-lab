import { defaults, normalize, MotionScene } from "./motion.js";
import { collections } from "./data.js";
import { makeExample } from "./export.js";
const $ = (selector) => document.querySelector(selector);
const icons = {
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  restart: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  download: '<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  code: '<path d="m7 7-5 5 5 5m10-10 5 5-5 5m-4-14-2 18"/>',
  link: '<path d="m10 14 4-4m-6 6-2 2a4 4 0 0 1-6-6l4-4m12 0 2-2a4 4 0 0 0-6-6L8 4" transform="translate(3 3) scale(.85)"/>',
  github:
    '<path d="M9 21v-3c-4 1-4-2-6-3m12 6v-4c0-1 0-2-1-2 4 0 6-2 6-5 0-2-1-3-2-4 0-1 0-2-1-3-2 0-3 1-4 1h-2c-1 0-2-1-4-1-1 1-1 2-1 3-1 1-2 2-2 4 0 3 2 5 6 5-1 0-1 1-1 2"/>',
};
function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
}
document
  .querySelectorAll("[data-icon]")
  .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
let config = normalize(
  Object.fromEntries(new URLSearchParams(location.hash.slice(1))),
);
let custom = null,
  uploadGeneration = 0,
  toastTimer,
  exportBusy = false;
const scene = new MotionScene(
  $("#scene"),
  collections[config.collection],
  config,
  updatePlayback,
);
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 5000);
}
function updatePlayback(playing) {
  $("#play-label").textContent = playing ? "Pause" : "Play";
  $("#play [data-icon]").innerHTML = icon(playing ? "pause" : "play");
  $("#playback-note").textContent = playing
    ? "A continuous loop. Yours to slow down."
    : "Paused. Take a closer look.";
}
function sync() {
  scene.update(config, custom || collections[config.collection]);
  for (const key of ["mode", "collection", "format"])
    document
      .querySelectorAll(`[data-${key}]`)
      .forEach((el) =>
        el.setAttribute(
          "aria-pressed",
          String(
            el.dataset[key] === config[key] &&
              !(key === "collection" && custom),
          ),
        ),
      );
  for (const key of ["speed", "count", "size", "depth", "tilt"]) {
    const input = $("#" + key);
    input.value = config[key];
    input.style.setProperty(
      "--fill",
      `${((input.value - input.min) / (input.max - input.min)) * 100}%`,
    );
    $("#" + key + "-value").textContent =
      key === "speed"
        ? `${Number(config[key].toFixed(2))}×`
        : key === "size"
          ? `${config[key]}px`
          : key === "depth"
            ? `${Math.round(config[key] * 100)}%`
            : key === "tilt"
              ? `${config[key]}°`
              : config[key];
  }
  document
    .querySelectorAll("[data-speed]")
    .forEach((el) =>
      el.setAttribute(
        "aria-pressed",
        String(Number(el.dataset.speed) === config.speed),
      ),
    );
  $("#reverse").checked = config.direction === -1;
  $("#center").checked = config.center;
  $("#motion-name").textContent = {
    portal: "01 / Portal",
    orbit: "02 / Orbit",
    cascade: "03 / Cascade",
  }[config.mode];
  $("#sted-preset-note").hidden = config.collection !== "sted" || !!custom;
  $("#clear-images").hidden = !custom;
  $("#upload-label").textContent = custom
    ? `${custom.length} of your images · choose to replace`
    : "Or drop your own images";
  $("#export-note").textContent = custom
    ? "Exports include your images. Shared links use the sample collection."
    : config.collection === "sted"
      ? "Sted case assets included. Use your own images and branding for your project."
      : "One HTML file. No dependencies. All yours.";
}
function set(patch) {
  config = normalize({ ...config, ...patch });
  sync();
}
document
  .querySelectorAll("[data-mode],[data-format],[data-speed]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      const key = ["mode", "format", "speed"].find((k) => button.dataset[k]);
      set({ [key]: button.dataset[key] });
    }),
  );
document.querySelectorAll("[data-collection]").forEach((button) =>
  button.addEventListener("click", () => {
    uploadGeneration++;
    custom = null;
    set({ collection: button.dataset.collection });
  }),
);
for (const key of ["speed", "count", "size", "depth", "tilt"])
  $("#" + key).addEventListener("input", (event) =>
    set({ [key]: event.target.value }),
  );
$("#reverse").addEventListener("change", (e) =>
  set({ direction: e.target.checked ? -1 : 1 }),
);
$("#center").addEventListener("change", (e) =>
  set({ center: e.target.checked }),
);
$("#play").addEventListener("click", () => scene.setPlaying(!scene.playing));
$("#restart").addEventListener("click", () => scene.restart());
$("#reset").addEventListener("click", () => {
  uploadGeneration++;
  custom = null;
  config = { ...defaults };
  history.replaceState(null, "", location.pathname + location.search);
  sync();
  scene.restart();
  toast("Back to the original rhythm.");
});
$("#clear-images").addEventListener("click", () => {
  uploadGeneration++;
  custom = null;
  $("#images").value = "";
  sync();
});
async function readImage(file) {
  if (
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ].includes(file.type)
  )
    throw new Error("Use JPG, PNG, WebP, AVIF or GIF images.");
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Each image must be smaller than 10 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas
      .getContext("2d")
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return {
      src: canvas.toDataURL("image/webp", 0.85),
      title: file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]/g, " ")
        .slice(0, 60),
      category: "Your collection",
    };
  } finally {
    bitmap.close();
  }
}
async function upload(files) {
  if (!files.length) return;
  const generation = ++uploadGeneration;
  const selected = Array.from(files).slice(0, 12);
  $("#upload-label").textContent = "Preparing your images…";
  try {
    const images = [];
    for (const file of selected) images.push(await readImage(file));
    if (generation !== uploadGeneration) return;
    custom = images;
    if (config.collection === "sted")
      config = normalize({ ...config, collection: "travel" });
    sync();
    toast(
      `${images.length} images ready. ${files.length > 12 ? "Only the first 12 were used." : "Nothing was uploaded."}`,
    );
  } catch (error) {
    if (generation !== uploadGeneration) return;
    sync();
    toast(error.message || "This image could not be opened. Try a JPG or PNG.");
  } finally {
    $("#images").value = "";
  }
}
$("#images").addEventListener("change", (e) => upload(e.target.files));
const drop = $("#dropzone");
for (const name of ["dragenter", "dragover"])
  drop.addEventListener(name, (e) => {
    e.preventDefault();
    drop.classList.add("dragging");
  });
for (const name of ["dragleave", "drop"])
  drop.addEventListener(name, (e) => {
    e.preventDefault();
    drop.classList.remove("dragging");
  });
drop.addEventListener("drop", (e) => upload(e.dataTransfer.files));
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());
const panel = $(".preview-panel");
async function fullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }
  if (panel.classList.contains("expanded")) {
    panel.classList.remove("expanded");
    updateFullscreen();
    return;
  }
  try {
    await panel.requestFullscreen();
  } catch {
    panel.classList.add("expanded");
    updateFullscreen();
  }
}
function updateFullscreen() {
  const active =
    !!document.fullscreenElement || panel.classList.contains("expanded");
  $("#fullscreen").setAttribute(
    "aria-label",
    active ? "Exit fullscreen" : "Enter fullscreen",
  );
}
$("#fullscreen").addEventListener("click", fullscreen);
document.addEventListener("fullscreenchange", updateFullscreen);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    panel.classList.remove("expanded");
    updateFullscreen();
  }
});
function openDialog(title, content) {
  $("#dialog-title").textContent = title;
  $("#dialog-content").replaceChildren(content);
  $("#dialog").showModal();
}
$("#close-dialog").addEventListener("click", () => $("#dialog").close());
$("#dialog").addEventListener("click", (e) => {
  if (e.target === $("#dialog")) {
    const r = e.target.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      e.target.close();
  }
});
async function copyText(value, title) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.readOnly = true;
    area.value = value;
    area.setAttribute("aria-label", title);
    openDialog(title, area);
    area.focus();
    area.select();
    return false;
  }
}
function save(text, mode) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/html" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `motion-lab-${mode}.html`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
function showExport(html, mode, action) {
  const content = document.createElement("div");
  const description = document.createElement("p");
  description.textContent =
    "A complete HTML file, with your images included. Save it and open it in any modern browser.";
  const area = document.createElement("textarea");
  area.readOnly = true;
  area.value = html;
  area.setAttribute("aria-label", "Exported HTML");
  const actions = document.createElement("div");
  actions.className = "export-dialog-actions";
  const copy = document.createElement("button");
  copy.className = "button button-ink";
  copy.textContent = "Copy HTML";
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(html);
      copy.textContent = "Copied!";
    } catch {
      area.focus();
      area.select();
      toast("Select and copy the HTML below.");
    }
  });
  const download = document.createElement("button");
  download.className = "button button-yellow";
  download.textContent = "Save HTML file";
  download.addEventListener("click", () => {
    save(html, mode);
    toast("Your HTML file is ready to save.");
  });
  actions.append(copy, download);
  content.append(description, actions, area);
  openDialog("Take a little motion with you.", content);
  (action === "copy" ? copy : download).focus();
}
async function exportExample(action) {
  if (exportBusy) return;
  exportBusy = true;
  $("#copy").disabled = $("#download").disabled = true;
  toast("Preparing your self-contained example…");
  try {
    const snapshot = { ...config };
    const html = await makeExample(
      snapshot,
      custom || collections[config.collection],
    );
    showExport(html, snapshot.mode, action);
    $("#toast").classList.remove("visible");
  } catch (error) {
    toast(
      error.name === "TimeoutError"
        ? "Loading took too long. Please try the export again."
        : error.message || "Export failed. Please try again.",
    );
  } finally {
    exportBusy = false;
    $("#copy").disabled = $("#download").disabled = false;
  }
}
$("#copy").addEventListener("click", () => exportExample("copy"));
$("#download").addEventListener("click", () => exportExample("download"));
$("#share").addEventListener("click", async () => {
  const url = new URL(location.href);
  url.hash = new URLSearchParams(config).toString();
  history.replaceState(null, "", url);
  if (await copyText(url.href, "Share this preset"))
    toast(
      custom
        ? "Preset copied. Your local images are excluded; the sample collection will appear."
        : "Preset link copied. Send a little movement.",
    );
});
window.addEventListener("hashchange", () => {
  uploadGeneration++;
  custom = null;
  config = normalize(
    Object.fromEntries(new URLSearchParams(location.hash.slice(1))),
  );
  sync();
  if (config.collection === "sted")
    $("#sted-preset-note").scrollIntoView({ block: "start" });
});
$("#credits").addEventListener("click", async () => {
  try {
    const r = await fetch("./assets/credits.json");
    if (!r.ok) throw new Error();
    const items = await r.json();
    const content = document.createElement("div");
    const p = document.createElement("p");
    p.append("Sample photography from Unsplash, used under the ");
    const license = document.createElement("a");
    license.href = "https://unsplash.com/license";
    license.target = "_blank";
    license.rel = "noreferrer";
    license.textContent = "Unsplash License";
    p.append(
      license,
      ". Code is MIT licensed; sample photos are licensed separately.",
    );
    content.append(p);
    const list = document.createElement("ul");
    items.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.source;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = item.file;
      li.append(a);
      list.append(li);
    });
    content.append(list);
    openDialog("A little credit, where it’s due.", content);
  } catch {
    toast("Photo credits are available in assets/credits.json on GitHub.");
  }
});
sync();
updatePlayback(scene.playing);

if (config.collection === "sted")
  requestAnimationFrame(() =>
    $("#sted-preset-note").scrollIntoView({ block: "start" }),
  );
