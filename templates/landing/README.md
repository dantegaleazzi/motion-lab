# Landing starter

A responsive website with a Motion Lab hero, feature blocks, story section and a final CTA. HTML, CSS and vanilla JavaScript. No build, account, backend or package install.

[Live preview](https://dantegaleazzi.github.io/motion-lab/templates/landing/) · [Download template ZIP](https://github.com/dantegaleazzi/motion-lab/releases/download/v0.3.0/motion-lab-landing-v0.3.0.zip)

1. Download and extract the ZIP.
2. Run `python3 -m http.server 5186` in that folder and open http://localhost:5186/.
3. Edit **config.js**: brand, headlines, accent, images, animation and CTA destinations. Replace the sample email before publishing.
4. Edit **index.html** for navigation, feature descriptions and structure; edit **styles.css** for the layout.
5. Upload the folder to any static host, such as GitHub Pages or Cloudflare Pages.

With the full repo, serve its root and open `/templates/landing/`. The source references the shared engine and photos two directories above. The template ZIP includes local copies and adjusted paths so it works independently.

Set `motion.mode` to `portal`, `orbit`, `cascade`, `tunnel`, `carousel` or `marquee`, and adjust speed, count, size, depth and tilt. It starts with 16 cards at 210px. Set `motion.format` to `full` for edge-to-edge images without text or borders. Visitors can pause or step backward/forward; reduced-motion preferences start it paused. Use configuration values from the playground's shared URL to customize it.

Code: MIT; retain LICENSE. Sample photos: Unsplash, credited separately in ASSET_LICENSES.md and assets/credits.json in the ZIP. Replace them or follow their license. “Elsewhere” is illustrative starter copy. The starter includes no Sted branding, analytics, auth, checkout or form service; its contact button is a sample email link.
