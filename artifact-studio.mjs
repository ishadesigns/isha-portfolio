const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

export function projectArtifacts(p) {
  const images = [
    {
      image: p.cover,
      alt: p.coverAlt,
      label: "The concept",
      caption: p.summary,
    },
  ];
  for (const s of p.sections) {
    if (s.image)
      images.push({
        image: s.image,
        alt: s.alt,
        label: s.label.split(" / ")[1] || s.title,
        caption: s.title,
      });
    if (s.secondaryImage)
      images.push({
        image: s.secondaryImage,
        alt: s.secondaryAlt,
        label: "A closer look",
        caption: s.secondaryAlt,
      });
  }
  return images.filter(
    (image, i, all) => all.findIndex((x) => x.image === image.image) === i,
  );
}

export function artifactStudio(p, base) {
  const items = projectArtifacts(p);
  return `<section class="artifact-studio studio-${p.slug}" aria-label="${p.name} artifact studio" data-studio><div class="studio-toolbar"><span><span class="studio-indicator" aria-hidden="true"></span> PROJECT STUDIO</span><button type="button" data-read-story>Read the story ↓</button></div><div class="artifact-stage"><button type="button" class="artifact-focus" data-inspect aria-label="Inspect image: ${escape(items[0].alt)}"><img src="${base}assets/${items[0].image}.webp" alt="${escape(items[0].alt)}" decoding="async" data-studio-image><span class="artifact-inspect-hint">Inspect image <span aria-hidden="true">↗</span></span></button><span class="artifact-stage-shadow" aria-hidden="true"></span></div><div class="artifact-caption"><div><p class="artifact-caption-title" data-artifact-title>${items[0].label}</p><p data-artifact-caption>${items[0].caption}</p></div><span class="artifact-count" data-artifact-count>01 / ${String(items.length).padStart(2, "0")}</span></div><div class="artifact-tray" role="group" aria-label="Choose a ${p.name} artifact">${items.map((item, i) => `<button type="button" class="artifact-thumb" data-artifact="${i}" data-src="${base}assets/${item.image}.webp" data-alt="${escape(item.alt)}" data-caption="${escape(item.caption)}" aria-label="${escape(item.label)}: ${escape(item.alt)}" aria-pressed="${i === 0}"><img src="${base}assets/${item.image}.webp" alt="" aria-hidden="true" loading="lazy" decoding="async"><span>${item.label}</span></button>`).join("")}</div><p class="sr-only" data-artifact-status role="status" aria-live="polite" aria-atomic="true"></p></section>`;
}

export function artifactDialog() {
  return `<dialog class="artifact-dialog" aria-labelledby="artifact-dialog-title"><div class="inspector-shell"><div class="inspector-header"><div><p class="space-eyebrow">FOCUSED VIEW</p><h2 id="artifact-dialog-title">Design artifact</h2></div><button type="button" data-inspector-close aria-label="Close focused view">×</button></div><div class="inspector-viewport" tabindex="0" role="region" aria-label="Zoomable artifact image"><img data-inspector-image alt="Selected design artifact"></div><div class="inspector-controls"><div class="inspector-navigation" role="group" aria-label="Browse artifacts"><button type="button" data-inspector-step="-1" aria-label="Previous artifact">←</button><span data-inspector-count></span><button type="button" data-inspector-step="1" aria-label="Next artifact">→</button></div><div class="inspector-zoom" role="group" aria-label="Image zoom"><button type="button" data-zoom="out" aria-label="Zoom out">−</button><span data-zoom-level>100%</span><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="reset">Reset</button></div></div><p class="inspector-description" data-inspector-caption></p><p class="sr-only" data-inspector-status role="status" aria-live="polite" aria-atomic="true"></p></div></dialog>`;
}
