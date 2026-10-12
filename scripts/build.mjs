import { orbitItems, orbitArtFile } from "../orbit.mjs";
import { mkdir, writeFile, rm, readFile, readdir } from "node:fs/promises";
import { spatialPage, version } from "../spatial.mjs";
import { projects } from "../content.mjs";
import { siteUrl } from "../config.mjs";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
// Byte copies avoid macOS native copyFile stalls in cloud-backed Documents folders.
async function copyTree(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = `${source}/${entry.name}`, to = `${destination}/${entry.name}`;
    if (entry.isDirectory()) await copyTree(from, to);
    else if (entry.isFile()) await writeFile(to, await readFile(from));
  }
}
await copyTree("public", "dist");
for (const item of orbitItems.filter(i => i.art)) await writeFile(`dist/assets/${orbitArtFile(item)}`, item.art.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '));
for (const file of [
  "styles.css",
  "app.js",
  "spatial.css",
  "spatial-app.js",
  "accessibility.css",
  "experience.css",
  "experience-app.js",
  "world.css",
  "world-app.js",
  "guide-engine.js",
  "voice-support.js",
  "room-motion.js",
  "orbit-app.js",
  "orbit-motion.js",
  "orbit.css",
  "arrival.css",
  "arrival-app.js",
  "sound-app.js",
  "welcome-media.js",
  "spatial-audio.js",
])
  await writeFile(`dist/${file}`, await readFile(file));
const runtimeModules = ["welcome-media", "arrival-app", "sound-app", "spatial-audio", "world-app", "guide-engine", "voice-support", "room-motion", "orbit-app", "orbit-motion"];
for (const name of runtimeModules) {
  let code = await readFile(`${name}.js`, "utf8");
  for (const dep of runtimeModules) {
    for (const quote of ['"', "'"]) code = code.replaceAll(`${quote}./${dep}.js${quote}`, `${quote}./${dep}.js?v=${version}${quote}`);
  }
  await writeFile(`dist/${name}.js`, code);
}
await writeFile("dist/index.html", spatialPage());
for (const p of projects) {
  await mkdir(`dist/projects/${p.slug}`, { recursive: true });
  await writeFile(`dist/projects/${p.slug}/index.html`, spatialPage(p));
}
await writeFile("dist/.nojekyll", "");
await writeFile(
  "dist/404.html",
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Isha</title><body style="font-family:system-ui;background:#f2f3ef;color:#242a2c;margin:10vh 10vw"><p>ISHA / PRODUCT DESIGNER</p><h1 style="font-weight:500;font-size:48px">A little outside the frame.</h1><p>This page couldn’t be found.</p><a href="/isha-portfolio/">Back to the portfolio →</a></body></html>',
);
console.log("Built static portfolio: home + 3 complete case studies.");

await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["", ...projects.map((p) => `projects/${p.slug}/`)].map((path) => `<url><loc>${siteUrl}${path}</loc></url>`).join("")}</urlset>`,
);
