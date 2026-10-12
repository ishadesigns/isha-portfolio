import { mkdir, cp, writeFile, rm, readFile } from "node:fs/promises";
import { spatialPage } from "../spatial.mjs";
import { projects } from "../content.mjs";
import { siteUrl } from "../config.mjs";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
for (const file of ["styles.css", "app.js", "spatial.css", "spatial-app.js"]) await cp(file, `dist/${file}`);
await writeFile("dist/index.html", spatialPage());
for (const p of projects) {
  await mkdir(`dist/projects/${p.slug}`, { recursive: true });
  await writeFile(`dist/projects/${p.slug}/index.html`, spatialPage(p));
}
await writeFile("dist/.nojekyll", "");
await writeFile(
  "dist/404.html",
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Isha Kumari</title><body style="font-family:system-ui;background:#f2f3ef;color:#242a2c;margin:10vh 10vw"><p>ISHA KUMARI / PRODUCT DESIGNER</p><h1 style="font-weight:500;font-size:48px">A little outside the frame.</h1><p>This page couldn’t be found.</p><a href="/isha-portfolio/">Back to the portfolio →</a></body></html>',
);
console.log("Built static portfolio: home + 3 complete case studies.");

await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["", ...projects.map((p) => `projects/${p.slug}/`)].map((path) => `<url><loc>${siteUrl}${path}</loc></url>`).join("")}</urlset>`,
);
