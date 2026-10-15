const frame = document.querySelector("#original-site");
const button = document.querySelector("#archive-play");
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
function sync() {
  const doc = frame.contentDocument;
  if (!doc) return;
  doc.documentElement.dataset.userPaused = String(paused);
  button.textContent = paused ? "Play motion" : "Pause motion";
}
frame.addEventListener("load", () => {
  paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
  sync();
});
button.addEventListener("click", () => {
  paused = !paused;
  sync();
});
