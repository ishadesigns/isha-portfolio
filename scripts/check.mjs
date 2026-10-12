// Validate deployed artifacts and relative paths, including GitHub Pages subdirectory hosting.
import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import assert from "node:assert/strict";
import { projects } from "../content.mjs";
const root = resolve("dist");
const htmlFiles = [
  "index.html",
  ...projects.map((p) => `projects/${p.slug}/index.html`),
];
let checks = 0;
for (const file of htmlFiles) {
  const html = await readFile(resolve(root, file), "utf8");
  if (file !== "index.html") {
    assert.match(html, /data-studio/, `${file}: project artifact studio`);
    assert.match(html, /data-inspect/, `${file}: focused inspection entry`);
    checks += 2;
  }
  assert.equal(
    (html.match(/<h1[ >]/g) || []).length,
    1,
    `${file}: one page heading`,
  );
  checks++;
  assert.match(html, /<html lang="en"/);
  checks++;
  assert.match(html, /<title>[^<]+<\/title>/);
  checks++;
  assert(
    !/\bkumari\b/i.test(html.replace(/<[^>]+>/g, " ")),
    `${file}: visible branding is Isha only`,
  );
  checks++;
  assert.match(html, /data-window="resume"/, `${file}: in-site résumé window`);
  checks++;
  assert.match(html, /data-window="awards"/, `${file}: separate Awards window`);
  assert.match(html, /aria-label="Send question"/, `${file}: named icon send control`);
  assert.match(html, /aria-label="Start voice input"/, `${file}: named microphone control`);
  assert(!/Lumi|résumé|Résumé|data-guide-place|data-guide-motion/.test(html), `${file}: requested companion and Resume presentation`);
  checks += 4;
  assert.match(html, /world-app.js/, `${file}: spatial world behavior`);
  checks++;
  assert.match(
    html,
    /id="guide-knowledge"/,
    `${file}: built-in guide knowledge`,
  );
  checks++;
  assert.match(html, /aria-modal="true"/, `${file}: native focused dialogs`);
  checks++;
  assert.match(html, /data-orbit-reset/, `${file}: interactive orbit`);
  assert.match(html, /data-battery-label>100%<\//, `${file}: full-charge illustration`);
  assert(!/data-arrival-skip|data-arrival-sound|arrival-caption|arrival-portal|arrival-scan/.test(html), `${file}: clean visual arrival`);
  assert.match(html, /data-arrival-replay/, `${file}: replayable arrival`);
  const orbitData = JSON.parse(html.match(/id="orbit-data">([^<]+)<\/script>/)[1]);
  assert.equal(orbitData.find(i=>i.id==='instax').label, 'Instax');
  assert.equal(orbitData.find(i=>i.id==='teddy').label, 'Teddy');
  checks += 2;
  assert.equal(orbitData.length, 11, `${file}: requested personal orbit objects`);
  assert(!orbitData.some(item => item.project || ['bmw','bloom'].includes(item.id)), `${file}: personal favorites only in Play`);
  checks += 5;
  assert.match(html, /type="text" id="guide-question"/, `${file}: single-line composer`);
  assert.match(html, /class="dock-look-toggle" data-look-toggle/, `${file}: room controls in dock`);
  assert(!/data-ambient-motion|data-game-reset|SPATIAL PAIRS/.test(html), `${file}: retired controls and game removed`);
  checks += 3;
  checks++;
  assert.match(
    html,
    /data-room-clear/,
    `${file}: room exploration alternative`,
  );
  checks++;
  assert.match(html, /experience-app.js/, `${file}: inspection interactions`);
  checks++;
  assert.match(html, /<meta name="description"/);
  checks++;
  assert(
    !html.includes("audit-assets"),
    `${file}: local audit scripts must not deploy`,
  );
  checks++;
  assert.match(html, /class="skip-link"/, `${file}: skip navigation`);
  checks++;
  assert.match(
    html,
    /aria-label="Spatial navigation"/,
    `${file}: named navigation landmark`,
  );
  checks++;
  assert.match(
    html,
    /id="navigation-status"[^>]*aria-live="polite"/,
    `${file}: navigation announcements`,
  );
  checks++;
  assert.match(html, /accessibility.css/, `${file}: accessibility layer`);
  checks++;
  assert(
    !html.includes("user-scalable=no") && !html.includes("maximum-scale="),
    `${file}: zoom unrestricted`,
  );
  checks++;
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: unique IDs`);
  checks++;
  for (const reference of html.matchAll(
    /aria-(?:controls|describedby)="([^"]+)"/g,
  )) {
    for (const id of reference[1].split(/\s+/))
      assert(ids.includes(id), `${file}: missing ARIA reference ${id}`);
    checks++;
  }
  for (const image of html.matchAll(/<img\b([^>]+)>/g)) {
    assert.match(image[1], /alt="[^"]*"/, `${file}: image alternative text`);
    if (image[1].includes('alt=""'))
      assert.match(
        image[1],
        /aria-hidden="true"/,
        `${file}: empty alt only for decoration`,
      );
    checks++;
  }
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (!target || /^(https?:|mailto:|data:)/.test(target)) continue;
    assert(
      !target.startsWith("/"),
      `${file}: must support repository subdirectories`,
    );
    let path = resolve(dirname(resolve(root, file)), target);
    assert(path.startsWith(root), `${file}: path inside deployment`);
    const info = await stat(path).catch(() => null);
    assert(info, `${file}: missing local asset ${target}`);
    if (info.isDirectory())
      assert((await stat(resolve(path, "index.html"))).isFile());
    checks++;
  }
}
const home = await readFile(resolve(root, "index.html"), "utf8");
for (const p of projects) {
  assert(home.includes(`data-case="${p.slug}"`));
  checks++;
}
assert(
  !home.includes("framerusercontent.com"),
  "Project assets must be hosted locally",
);
checks++;
assert(
  !(await readdir(root)).includes("audit-assets"),
  "Local audit tooling must not deploy",
);
checks++;
assert(
  !(await readdir(root)).includes("CNAME"),
  "Existing custom domain must remain untouched",
);
checks++;
console.log(
  `Passed ${checks} static checks: page structure, images, routes, repository-relative links, local assets, and domain isolation.`,
);
