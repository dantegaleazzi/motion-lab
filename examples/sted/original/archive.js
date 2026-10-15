const notice = document.createElement("p");
notice.className = "archive-notice";
notice.textContent =
  "Historical landing · The waitlist is a visual demo. No email is collected.";
document.querySelector(".hero-waitlist").append(notice);
const status = document.querySelector("#form-status");
document.querySelectorAll("form").forEach((form) =>
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent =
      "This is the original waitlist design. Visit sted.ai to see Sted today.";
  }),
);
document.querySelector(".header-cta").addEventListener("click", () => {
  document.querySelector(".hero-waitlist").scrollIntoView({ block: "center" });
  status.textContent = "Historical demo — visit sted.ai to see Sted today.";
});
const menu = document.querySelector(".sted-menu__trigger"),
  panel = document.querySelector(".sted-menu__panel"),
  control = document.querySelector(".sted-menu__control");
function closeMenu() {
  panel.hidden = true;
  menu.setAttribute("aria-expanded", "false");
  control.dataset.open = "false";
}
menu.addEventListener("click", () => {
  panel.hidden = !panel.hidden;
  menu.setAttribute("aria-expanded", String(!panel.hidden));
  control.dataset.open = String(!panel.hidden);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".sted-menu")) closeMenu();
});
const scene = document.querySelector(".sct");
new IntersectionObserver(([entry]) => {
  scene.dataset.paused = String(!entry.isIntersecting);
}).observe(scene);
document.addEventListener("visibilitychange", () => {
  document.documentElement.dataset.documentHidden = String(document.hidden);
});
document.documentElement.dataset.userPaused = String(
  matchMedia("(prefers-reduced-motion: reduce)").matches,
);
