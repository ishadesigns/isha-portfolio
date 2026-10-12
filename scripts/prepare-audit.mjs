// Local-only audit instrumentation. Rebuild dist before publication.
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { projects } from "../content.mjs";
const axePath = process.argv[2];
if (!axePath)
  throw new Error(
    "Pass an absolute path to axe.min.js from a temporary installation.",
  );
await mkdir("dist/audit-assets", { recursive: true });
await cp(axePath, "dist/audit-assets/axe.min.js");
await cp("scripts/browser-audit.js", "dist/audit-assets/runner.js");
for (const path of [
  "index.html",
  ...projects.map((p) => `projects/${p.slug}/index.html`),
]) {
  const file = "dist/" + path;
  const html = (await readFile(file, "utf8")).replace(
    /<script src="\/audit-assets\/[^"]+" defer><\/script>/g,
    "",
  );
  await writeFile(
    file,
    html.replace(
      "</head>",
      '<script src="/audit-assets/axe.min.js" defer></script><script src="/audit-assets/runner.js" defer></script></head>',
    ),
  );
}
console.log(
  "Local audit prepared. Navigate to a preview page with ?audit=1. Rebuild before deployment.",
);
