export function safeJSON(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
export function blobData(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read an image."));
    reader.readAsDataURL(blob);
  });
}
export async function makeExample(config, items) {
  const read = async (url) => {
    const r = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) throw new Error("Could not load export assets.");
    return r;
  };
  const embedded = new Map();
  const embed = async (src) => {
    if (!src || src.startsWith("data:")) return src;
    if (!embedded.has(src))
      embedded.set(
        src,
        read(src)
          .then((r) => r.blob())
          .then(blobData),
      );
    return embedded.get(src);
  };
  const exportItem = async (item) => {
    const result = { ...item, src: item.markup ? "" : await embed(item.src) };
    if (item.hub) result.hub = await embed(item.hub);
    if (item.markup) {
      let markup = item.markup;
      for (const match of [...markup.matchAll(/src="([^"]+)"/g)])
        markup = markup.replace(match[0], `src="${await embed(match[1])}"`);
      result.markup = markup;
    }
    return result;
  };
  const [css, engine, images] = await Promise.all([
    Promise.all([
      read("./scene.css").then((r) => r.text()),
      config.collection === "sted"
        ? read("./assets/sted/cards.css").then((r) => r.text())
        : "",
    ]).then((parts) => parts.join("\n")),
    read("./motion.js").then((r) => r.text()),
    Promise.all(items.map(exportItem)),
  ]);
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My motion — Motion Lab by Dante Galeazzi</title><style>${css}\nbody{margin:0;background:#f5f3ee;color:#252722;font-family:system-ui,sans-serif}#motion{height:85vh;min-height:300px}body>footer{display:flex;align-items:center;justify-content:center;gap:20px;padding:16px;font-size:12px}button{background:#252722;color:white;border:0;border-radius:10px;padding:12px 22px;cursor:pointer}a{color:inherit}button:focus-visible,a:focus-visible{outline:3px solid #82915b;outline-offset:4px}</style></head><body><div id="motion" role="img" aria-label="Animated image collection"></div><footer><button id="play">Pause</button><a href="https://github.com/dantegaleazzi/motion-lab">Made with Motion Lab by Dante Galeazzi ↗</a></footer><script type="module">\n${engine.replace(/^export /gm, "")}\nconst config=${safeJSON(config)};\nconst items=${safeJSON(images)};\nconst button=document.querySelector('#play');\nconst scene=new MotionScene(document.querySelector('#motion'),items,config,playing=>button.textContent=playing?'Pause':'Play');\nbutton.textContent=scene.playing?'Pause':'Play';\nbutton.addEventListener('click',()=>scene.setPlaying(!scene.playing));\n</script></body></html>`;
}
