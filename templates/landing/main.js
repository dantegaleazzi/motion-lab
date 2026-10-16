import { MotionScene } from "../../motion.js?v=controls-2";
import { site, motion, images } from "./config.js";
const $ = (selector) => document.querySelector(selector);
document.title = site.brand + " — " + site.headline + " " + site.highlight;
document.documentElement.style.setProperty("--accent", site.accent);
$("#brand").textContent = "✳ " + site.brand;
$("#footer-brand").textContent = site.brand;
for (const [key, id] of Object.entries({
  eyebrow: "eyebrow",
  headline: "headline",
  highlight: "highlight",
  description: "description",
  storyTitle: "story-title",
  storyCopy: "story-copy",
  ctaTitle: "cta-title",
}))
  $("#" + id).textContent = site[key];
for (const [id, label, href] of [
  ["hero-cta", site.primaryLabel, site.primaryHref],
  ["contact-cta", site.contactLabel, site.contactHref],
]) {
  const a = $("#" + id);
  a.textContent = label + " ↗";
  a.href = href;
}
$("#story-image").src = site.storyImage;
$("#story-image").alt = site.storyImageAlt;
const button = $("#play");
const scene = new MotionScene($("#motion"), images, motion, (playing) => {
  button.textContent = playing ? "Pause motion" : "Play motion";
});
button.textContent = scene.playing ? "Pause motion" : "Play motion";
button.addEventListener("click", () => scene.setPlaying(!scene.playing));

document
  .querySelector("#previous")
  .addEventListener("click", () => scene.step(-1));
document.querySelector("#next").addEventListener("click", () => scene.step(1));
