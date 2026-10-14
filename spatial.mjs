import { arrivalMarkup } from "./arrival.mjs";
import { orbitPlay } from "./orbit.mjs";
import {
  worldStatus,
  roomExplorer,
  roomControls,
  guideWidget,
} from "./world.mjs";
import { resumeApp } from "./resume.mjs";
import { artifactDialog } from "./artifact-studio.mjs";
import { profile, projects, faq, awards, interests, bloomAwardDescription } from "./content.mjs";
import { siteUrl } from "./config.mjs";
import { icon, caseArticle } from "./site.mjs";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

export const version = createHash("sha256")
  .update(readFileSync(new URL("./styles.css", import.meta.url)))
  .update(readFileSync(new URL("./spatial.css", import.meta.url)))
  .update(readFileSync(new URL("./spatial-app.js", import.meta.url)))
  .update(readFileSync(new URL("./accessibility.css", import.meta.url)))
  .update(readFileSync(new URL("./experience.css", import.meta.url)))
  .update(readFileSync(new URL("./experience-app.js", import.meta.url)))
  .update(readFileSync(new URL("./world.css", import.meta.url)))
  .update(readFileSync(new URL("./world-app.js", import.meta.url)))
  .update(readFileSync(new URL("./guide-engine.js", import.meta.url)))
  .update(readFileSync(new URL("./voice-support.js", import.meta.url)))
  .update(readFileSync(new URL("./room-motion.js", import.meta.url)))
  .update(readFileSync(new URL("./orbit-app.js", import.meta.url)))
  .update(readFileSync(new URL("./orbit-motion.js", import.meta.url)))
  .update(readFileSync(new URL("./orbit.css", import.meta.url)))
  .update(readFileSync(new URL("./chrome.css", import.meta.url)))
  .update(readFileSync(new URL("./chrome-app.js", import.meta.url)))
  .update(readFileSync(new URL("./arrival.css", import.meta.url)))
  .update(readFileSync(new URL("./arrival-app.js", import.meta.url)))
  .update(readFileSync(new URL("./sound-app.js", import.meta.url)))
  .update(readFileSync(new URL("./spatial-audio.js", import.meta.url)))
  .update(readFileSync(new URL("./welcome-media.js", import.meta.url)))
  .update(readFileSync(new URL("./public/assets/welcome-chime.wav", import.meta.url)))
  .digest("hex")
  .slice(0, 12);
const image = (base, name, alt, eager = false, cls = "") =>
  `<img class="${cls}" src="${base}assets/${name}.webp" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const external = (href, label) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer">${label} ${icon("up")}<span class="sr-only"> (opens in a new tab)</span></a>`;
const expandIcon =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>';
const apps = [
  ["home", "home", "Home"],
  ["work", "work", "Work"],
  ["about", "person", "About Me"],
  ["resume", "document", "Resume"],
  ["awards", "award", "Awards"],
  ["playground", "spark", "Play"],
  ["contact", "mail", "Contact"],
];

function windowFrame(id, title, symbol, body, context = "") {
  return `<section class="spatial-panel panel-${id}" id="${id}" data-window="${id}" role="region" aria-label="${title} window" tabindex="-1">
    <div class="spatial-titlebar"><button class="window-grip" data-drag type="button" aria-label="Move ${title} window" title="Drag to move. Use arrow keys when focused." aria-describedby="window-move-help">${icon(symbol)}<span>${title}</span></button><span class="window-context">${context}</span><button type="button" class="window-scroll-top" data-scroll-top aria-label="Back to top of ${title} content">${icon("arrow", "scroll-up-icon")}</button><button class="window-expand" type="button" aria-label="Expand ${title} window" aria-pressed="false">${expandIcon}</button></div>
    <div class="window-reading-progress" role="progressbar" aria-label="${title} reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><div class="spatial-scroll" tabindex="0" role="region" aria-label="${title} content" aria-describedby="navigation-help">${body}</div>
    <div class="spatial-controls"><button class="window-dismiss" type="button" aria-label="Close ${title} window">${icon("close")}</button><button class="window-handle" data-drag type="button" aria-label="Move ${title} window using handle" title="Drag to move" aria-describedby="window-move-help"><span></span></button></div>
  </section>`;
}

function welcome(base, hasCase) {
  const heading = hasCase ? "h2" : "h1";
  return `<div class="welcome-content"><p class="space-eyebrow">WELCOME TO MY SPACE</p><${heading}>A little beyond<br>the <em>screen.</em></${heading}><p class="welcome-intro">I'm Isha, a product designer turning human insights into intuitive experiences.</p><div class="welcome-disciplines"><span>Product design</span><span>UX research</span><span>Spatial computing</span></div><a class="space-button" href="${base}#work" data-open="work">Step into my work ${icon("arrow")}</a><p class="welcome-guide">Use the dock to explore. Scroll inside the open window.</p><button type="button" class="arrival-replay" data-arrival-replay>Play welcome sound ${icon("spark")}</button><div class="welcome-bottom"><span class="status-dot"></span> Open to thoughtful opportunities<a href="${base}#about" data-open="about">Meet the human ${icon("up")}</a></div></div>`;
}
function work(base) {
  return `<div class="work-app"><div class="app-heading"><div><p class="space-eyebrow">SELECTED WORK / 2023 — 2024</p><h2>Different worlds.<br>The same human focus.</h2></div><p>Choose a project.<br>Take a closer look.</p></div><div class="spatial-filters" role="group" aria-label="Filter projects"><button data-filter="all" aria-pressed="true">All work <span>03</span></button><button data-filter="spatial" aria-pressed="false">Spatial</button><button data-filter="product" aria-pressed="false">Product</button><button data-filter="research" aria-pressed="false">Research</button></div><div class="space-projects">${projects.map((p) => `<article class="space-project" data-category="${p.category}"><a class="space-project-image" href="${base}projects/${p.slug}/" data-case="${p.slug}">${image(base, p.cover, p.coverAlt)}<span class="space-project-category">${p.categoryLabel}</span><span class="space-project-launch">${icon("up")}</span></a><div class="space-project-copy"><span class="project-number">${p.number} / ${p.year}</span><h2><a href="${base}projects/${p.slug}/" data-case="${p.slug}">${p.name}</a></h2><p>${p.summary}</p><div class="space-project-result"><strong>${p.metrics[0][0]}</strong><span>${p.metrics[0][1]}</span></div></div></article>`).join("")}</div><p class="filter-status sr-only" role="status" aria-live="polite">Showing all 3 projects</p><div class="work-app-footer"><span>EXPERIENCE ACROSS</span><div>Geny <i>·</i> BMW Group <i>·</i> Myntra <i>·</i> Deloitte</div></div><div class="spatial-coming"><p class="space-eyebrow">ON THE DRAWING BOARD</p><div><span>Landing page + onboarding refresh<small>Mobile onboarding & design systems</small></span><span>Tindoori<small>Coming soon</small></span></div></div></div>`;
}
function about(base) {
  return `<div class="about-app"><div class="about-app-intro"><div class="about-app-photo">${image(base, "portrait", "Isha outdoors during her travels")}<span>curious by default :)</span></div><div><p class="space-eyebrow">THE HUMAN BEHIND THE WORK</p><h2>Curious by default.<br>Reflective by habit.</h2><p class="about-app-lead">Before I design anything, I try to understand <em>why</em> people behave the way they do.</p><p>Design starts long before screens—in conversations, observations, and moments of friction. I'm drawn to the human patterns beneath an interface, and I shape products that feel intuitive.</p><div class="about-tags"><span>Systems thinker</span><span>Research-led</span><span>Always exploring</span></div><a class="space-button resume-open" href="${base}#resume" data-open="resume">Read my resume ${icon("arrow")}</a></div></div><div class="about-app-story"><div><p class="space-eyebrow">MY FIRST LESSON IN UX</p><h2>Finding my compass.</h2><p>Solo travel taught me to navigate uncertainty, make trade-offs, and find connection across cultures. Those lessons still shape how I design: staying calm in ambiguity, listening closely, and trusting a considered decision.</p></div>${image(base, "workshop", "Isha mapping research insights with sticky notes")}</div>${personalInterests(base)}${studioNotes(base)}<div class="spatial-faq"><p class="space-eyebrow">IF YOU'RE WONDERING</p>${faq.map(([q, a]) => `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join("")}</div></div>`;
}
function personalInterests(base) {
  return `<section class="about-interests"><p class="space-eyebrow">BEYOND THE SCREEN</p><h2>Things that fuel me.</h2><p class="interests-intro">I move between analog and digital—scribbled notebooks, iced lattes, long runs, music on loop, and ideas that unfold somewhere between screen and page.</p><div class="interest-folders">${interests.map((i) => `<details class="interest-folder"><summary><span class="interest-art">${image(base, i.image, i.alt)}</span><span class="interest-label">${i.title}<span class="interest-toggle" aria-hidden="true">+</span></span></summary><p>${i.text}</p></details>`).join("")}</div><a class="about-play-link" href="${base}#playground" data-open="playground"><span class="about-play-symbol" aria-hidden="true">${icon("spark")}</span><span><strong>Step into my orbit.</strong><span>Play with the little things that inspire me.</span></span>${icon("arrow")}</a></section>`;
}
function awardsApp(base) {
  return `<div class="awards-app"><p class="space-eyebrow">RECOGNITION / BLOOM</p><h2>Thoughtful design.<br>Recognized.</h2><p class="awards-intro">One multi-sensory sleep experience. Two international design awards.</p><p class="awards-intro awards-bloom-description">${bloomAwardDescription}</p><div class="award-cards">${awards.map((a) => `<article class="award-card"><div class="award-image">${image(base, a.image, "Bloom sleep device and app with Indigo and IDA award marks")}</div><div class="award-copy"><h2><a href="${a.href}" target="_blank" rel="noopener noreferrer">${a.title} ${icon("up")}<span class="sr-only"> (opens in a new tab)</span></a></h2></div></article>`).join("")}</div><a class="space-button" href="${base}projects/bloom/" data-case="bloom">Explore the Bloom case study ${icon("arrow")}</a></div>`;
}
function genyPlaceholder(base) {
  return `<section class="geny-placeholder"><p class="space-eyebrow">CONVERSATIONAL AI / COMING SOON</p><h2>Geny Labs</h2><p>Luke is inspired by Isha’s work on AI voice agents at Geny Labs.</p><p>A closer look at this work is coming soon.</p><a class="space-button" href="${base}#resume" data-open="resume">Explore Isha’s experience ${icon("arrow")}</a></section>`;
}

function studioNotes(base) {
  return `<section class="about-studio-notes"><div class="spatial-field-notes"><p class="space-eyebrow">FIELD NOTES / 001</p><h2>Stay curious.<br>Notice the small things.</h2><p>Scribbled notebooks. Iced lattes. Long runs.<br>Ideas that unfold somewhere in between.</p><div>${image(base, "notebook", "Open notebook and pen")}${image(base, "coffee", "An iced latte")}</div></div><a class="spatial-experiments" href="${profile.github}" target="_blank" rel="noopener noreferrer">${icon("grid")}<div><h2>Curiosity, in progress.</h2><p>Explore my projects and experiments on GitHub.</p></div>${icon("up")}<span class="sr-only"> (opens in a new tab)</span></a></section>`;
}
function playground(base) {
  return `<div class="play-app">${orbitPlay(base)}</div>`;
}

function contact() {
  return `<div class="contact-app"><p class="space-eyebrow"><span class="status-dot"></span> OPEN TO PRODUCT DESIGN & UX ROLES</p><h2>Good things start<br>with a <em>conversation.</em></h2><p>Thoughtful products. Complex experiences.<br>Research that shapes what gets built.<br>I'd love to hear what you're working on.</p><a class="space-button" href="mailto:${profile.email}">Say hello ${icon("mail")}</a><button class="copy-email" type="button" data-copy-email="${profile.email}">${profile.email} ${icon("copy")}</button><div class="contact-socials">${external(profile.linkedin, "LinkedIn")}${external(profile.instagram, "Instagram")}${external(profile.github, "GitHub")}${external(profile.twitter, "X / Twitter")}</div><span class="contact-signoff">Thoughtfully made. Independently built.</span></div>`;
}
function satellite(base, p, cls) {
  return `<a class="project-satellite ${cls}" href="${base}projects/${p.slug}/" data-case="${p.slug}" data-home-orbit><div class="satellite-label">${icon(p.slug === "bmw" ? "layers" : "spark")}<span>${p.slug === "bmw" ? "A new dimension" : "A softer kind of technology"}</span>${icon("up")}</div>${image(base, p.cover, p.coverAlt, true)}<div class="satellite-caption"><span>${p.name}</span><small>${p.categoryLabel}</small></div></a>`;
}
export function spatialPage(initialCase = null) {
  const base = initialCase ? "../../" : "./";
  const title = initialCase
    ? `${initialCase.name} — Isha`
    : "Isha — A Spatial Design Portfolio";
  const description =
    initialCase?.summary ||
    "Step into Isha’s design space. Product design, UX research, and spatial experiences across BMW, Chemistry, and Bloom.";
  const canonical =
    siteUrl + (initialCase ? `projects/${initialCase.slug}/` : "");
  return `<!doctype html><html lang="en" data-theme="day"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#d3d0c5"><meta name="description" content="${description}"><title>${title}</title><link rel="canonical" href="${canonical}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta property="og:image" content="${siteUrl}assets/${initialCase?.cover || "bmw-cover"}.webp"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${base}favicon.svg?v=${version}" type="image/svg+xml"><link rel="preload" href="${base}assets/spatial-room-wide.webp" as="image"><link rel="stylesheet" href="${base}styles.css?v=${version}"><link rel="stylesheet" href="${base}spatial.css?v=${version}"><link rel="stylesheet" href="${base}accessibility.css?v=${version}"><link rel="stylesheet" href="${base}experience.css?v=${version}"><link rel="stylesheet" href="${base}world.css?v=${version}"><link rel="stylesheet" href="${base}orbit.css?v=${version}"><link rel="stylesheet" href="${base}arrival.css?v=${version}"><link rel="stylesheet" href="${base}chrome.css?v=${version}"><script type="module" src="${base}arrival-app.js?v=${version}"></script><script src="${base}spatial-app.js?v=${version}" defer></script><script src="${base}chrome-app.js?v=${version}" defer></script><script src="${base}experience-app.js?v=${version}" defer></script><script type="module" src="${base}world-app.js?v=${version}"></script></head><body class="spatial-site" data-base="${base}" data-initial-case="${initialCase?.slug || ""}"><a class="skip-link" href="#main">Skip to content</a><div class="spatial-environment" aria-hidden="true" style="--room-image:url('${base}assets/spatial-room-wide.webp')"><div class="environment-room"></div><div class="environment-vignette"></div></div><header class="space-status"><button type="button" class="space-island" data-island-toggle aria-label="Open space status" aria-expanded="false" aria-controls="space-status-details"><span class="island-capsule" aria-hidden="true"><span class="island-eyes"><i></i><i></i></span><span class="island-line"></span><span class="island-ring"></span></span></button><div id="space-status-details" class="space-status-details" role="region" aria-label="Space status"><a class="space-identity" href="${base}#home" data-open="home"><span>Isha</span><span>Product designer</span></a>${worldStatus()}</div></header><div class="sr-only" id="navigation-status" role="status" aria-live="polite" aria-atomic="true"></div><div class="dock-sensor"><button class="dock-reveal" type="button" data-dock-toggle aria-label="Show navigation" aria-expanded="false" aria-controls="spatial-navigation"><span aria-hidden="true"></span></button></div><nav class="spatial-dock" id="spatial-navigation" aria-label="Spatial navigation">${apps.map(([id, symbol, label]) => `<a href="${base}#${id}" data-open="${id}" data-app="${id}" aria-label="${label}"><span class="dock-app-icon app-${id}">${icon(symbol)}</span><span class="dock-app-label"><span class="dock-label-wide">${label}</span></span><i aria-hidden="true"></i></a>`).join("")}<span class="spatial-dock-divider"></span><button type="button" class="dock-look-toggle" aria-label="Explore Vision Pro" data-look-toggle aria-expanded="false" aria-controls="room-controls">${icon("compass")}<span>Explore<br>Vision Pro</span></button></nav>${roomControls()}<main class="spatial-workspace" id="main"><p class="sr-only" id="window-move-help">When the window is compact, move it with arrow keys on the title or handle, or drag it. Recenter is available inside Explore Vision Pro in the dock.</p><p class="sr-only" id="navigation-help">Use the navigation dock to switch windows. Use Page Down, Page Up, or arrow keys to scroll this content. Tab moves between controls.</p><div class="space-idle" hidden><h2>Your space.<br>Your perspective.</h2><a href="${base}#home" data-open="home">Open Welcome ${icon("arrow")}</a></div>${satellite(base, projects[0], "satellite-bmw")}${satellite(base, projects[2], "satellite-bloom")}${windowFrame("home", "Welcome", "home", welcome(base, !!initialCase), "MAKE YOURSELF AT HOME")}${windowFrame("work", "Selected work", "work", work(base), "03 PROJECTS")}${windowFrame("about", "About Isha", "person", about(base), "CURIOUS BY DEFAULT")}${windowFrame("resume", "Resume", "document", resumeApp(base), "EXPERIENCE & TOOLKIT")}${windowFrame("awards", "Awards", "award", awardsApp(base), "BLOOM / 2024 — 2025")}${windowFrame("geny", "Geny Labs", "spark", genyPlaceholder(base), "AI VOICE AGENTS")}${windowFrame("playground", "Playground", "spark", playground(base), "ISHA’S ORBIT")}${windowFrame("contact", "Let’s connect", "mail", contact(), "SAY HELLO")}${windowFrame("case", initialCase?.name || "Case study", "layers", initialCase ? caseArticle(initialCase, base) : '<div class="case-loading"><p>Opening case study…</p></div>', '<a class="case-back" href="' + base + '#work" data-open="work">← Work</a>')}<div class="space-hint" data-home-orbit>Choose a window. Follow your curiosity.</div>${artifactDialog()}${roomExplorer()}</main>${guideWidget(base)}${arrivalMarkup(base,version)}<div class="space-toast" role="status" aria-live="polite" aria-atomic="true"></div><noscript><p class="no-script-note">Use the links to explore the portfolio. Spatial window interactions work when JavaScript is enabled.</p></noscript></body></html>`;
}
