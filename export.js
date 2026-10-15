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
  const [css, engine, images] = await Promise.all([
    read("./scene.css").then((r) => r.text()),
    read("./motion.js").then((r) => r.text()),
    Promise.all(
      items.map(async (item) => ({
        ...item,
        src: item.src.startsWith("data:")
          ? item.src
          : await blobData(await (await read(item.src)).blob()),
      })),
    ),
  ]);
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My motion — Sted Motion Lab</title><style>${css}\nbody{margin:0;background:#f5f3ee;color:#252722;font-family:system-ui,sans-serif}#motion{height:85vh;min-height:300px}footer{display:flex;align-items:center;justify-content:center;gap:20px;padding:16px;font-size:12px}button{background:#252722;color:white;border:0;border-radius:10px;padding:12px 22px;cursor:pointer}a{color:inherit}button:focus-visible,a:focus-visible{outline:3px solid #82915b;outline-offset:4px}</style></head><body><div id="motion" role="img" aria-label="Animated image collection"></div><footer><button id="play">Pause</button><a href="https://github.com/dantegaleazzi/sted-motion-lab">Made with Sted Motion Lab ↗</a></footer><script type="module">\n${engine.replace(/^export /gm, "")}\nconst config=${safeJSON(config)};\nconst items=${safeJSON(images)};\nconst button=document.querySelector('#play');\nconst scene=new MotionScene(document.querySelector('#motion'),items,config,playing=>button.textContent=playing?'Pause':'Play');\nbutton.textContent=scene.playing?'Pause':'Play';\nbutton.addEventListener('click',()=>scene.setPlaying(!scene.playing));\n</script></body></html>`;
}
