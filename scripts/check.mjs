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
  assert.match(html, /<meta name="description"/);
  checks++;
  for (const image of html.matchAll(/<img\b([^>]+)>/g)) {
    assert.match(image[1], /alt="[^"]+"/, `${file}: image alternative text`);
    checks++;
  }
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const target = match[1].split("#")[0];
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
  !(await readdir(root)).includes("CNAME"),
  "Existing custom domain must remain untouched",
);
checks++;
console.log(
  `Passed ${checks} static checks: page structure, images, routes, repository-relative links, local assets, and domain isolation.`,
);
