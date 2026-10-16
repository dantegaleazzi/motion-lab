// Maintainer helper: node scripts/package-release.mjs /tmp/motion-lab-v0.3.0
// Uses the same exporter and engine as the playground. Requires Node 22+ and Python 3 for ZIPs.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { makeExample } from "../export.js";
import { normalize } from "../motion.js";
import { collections } from "../data.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.resolve(process.argv[2] || "/tmp/motion-lab-v0.3.0");
await fs.mkdir(output, { recursive: true });
globalThis.fetch = async (url) => {
  const file = path.resolve(root, url);
  if (!file.startsWith(root + path.sep))
    throw new Error("Asset outside repository");
  const bytes = await fs.readFile(file);
  const type =
    {
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
    }[path.extname(file)] || "text/plain";
  return new Response(bytes, { headers: { "content-type": type } });
};
globalThis.FileReader = class {
  async readAsDataURL(blob) {
    try {
      this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")}`;
      this.onload();
    } catch {
      this.onerror();
    }
  }
};
const examples = path.join(output, "examples");
await fs.mkdir(examples, { recursive: true });
for (const mode of ["portal", "orbit", "cascade"])
  await fs.writeFile(
    path.join(examples, `motion-lab-${mode}.html`),
    await makeExample(normalize({ mode }), collections.travel),
  );
for (const file of ["LICENSE", "ASSET_LICENSES.md"])
  await fs.copyFile(path.join(root, file), path.join(examples, file));
await fs.writeFile(
  path.join(examples, "README.txt"),
  "Open any HTML file in a modern browser. The animation and images are embedded. Code: MIT; sample photos: Unsplash. See the included notices. Make your own at https://dantegaleazzi.github.io/motion-lab/\n",
);
const landing = path.join(output, "landing");
await fs.mkdir(path.join(landing, "assets"), { recursive: true });
for (const file of [
  "index.html",
  "styles.css",
  "main.js",
  "config.js",
  "README.md",
]) {
  let content = await fs.readFile(
    path.join(root, "templates/landing", file),
    "utf8",
  );
  if (file !== "README.md")
    content = content
      .replaceAll("../../assets/", "./assets/")
      .replaceAll("../../motion.js", "./motion.js")
      .replaceAll("../../scene.css", "./scene.css")
      .replace(
        'href="../../"',
        'href="https://dantegaleazzi.github.io/motion-lab/"',
      );
  await fs.writeFile(path.join(landing, file), content);
}
for (const file of ["motion.js", "scene.css", "LICENSE", "ASSET_LICENSES.md"])
  await fs.copyFile(path.join(root, file), path.join(landing, file));
for (const file of [
  "alpine.jpg",
  "lake.jpg",
  "ocean.jpg",
  "forest.jpg",
  "credits.json",
])
  await fs.copyFile(
    path.join(root, "assets", file),
    path.join(landing, "assets", file),
  );
function zip(folder, name) {
  execFileSync(
    "python3",
    [
      "-c",
      'import pathlib,sys,zipfile; root=pathlib.Path(sys.argv[1]); out=pathlib.Path(sys.argv[2]); z=zipfile.ZipFile(out,"w",zipfile.ZIP_DEFLATED); [z.write(p,p.relative_to(root)) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()',
      folder,
      path.join(output, name),
    ],
    { stdio: "inherit" },
  );
}
zip(examples, "motion-lab-examples-v0.3.0.zip");
zip(landing, "motion-lab-landing-v0.3.0.zip");
console.log(
  JSON.stringify({
    output,
    archives: [
      "motion-lab-examples-v0.3.0.zip",
      "motion-lab-landing-v0.3.0.zip",
    ],
  }),
);
