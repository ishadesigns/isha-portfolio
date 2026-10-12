# Isha — Spatial Portfolio

An independent, static UX design portfolio inspired by spatial interfaces. The existing Framer site and custom domain are untouched.

**Production:** https://ishadesigns.github.io/isha-portfolio/

## Run locally

Requires Node.js 20 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Stop with Control-C. After editing, run `npm run build` and reload the page. For a production preview, run `npm run preview`.

```sh
npm run build
npm run check
```

## Where to edit

| File | Controls |
| --- | --- |
| `world.mjs` | Room status, game markup, Lumi UI, and public guide knowledge |
| `world-app.js` | Room camera controls, scrolling effects, game, guide movement, and browser voice |
| `world.css` | Spatial status, game cards, Lumi, and room styling |
| `guide-engine.js` | Deterministic answers and follow-up routing; no API calls |
| `resume.mjs` | Source-backed résumé content and résumé window |
| `artifact-studio.mjs` | Project galleries and focused image viewer markup |
| `experience-app.js` | Artifact selection, focused viewing, zoom, and résumé section navigation |
| `experience.css` | Résumé, project studio, inspector, and dock appearance |
| `content.mjs` | Project copy, metrics, contact links, résumé, FAQ |
| `config.mjs` | Published site URL for canonical links and social metadata |
| `spatial.mjs` | Immersive room, windows, dock, project cards, and page metadata |
| `site.mjs` | Shared icons and full case study content templates |
| `spatial.css` | Room, glass windows, dock, transitions, and responsive spatial layouts |
| `accessibility.css` | Contrast, touch targets, focus, text resizing, short-viewport reflow, and forced colors |
| `styles.css` | Shared typography and case-study article styling |
| `spatial-app.js` | Window navigation, movement, expansion, recentering, filters, and case studies |
| `public/assets/` | Local optimized project images and personal photos |
| `scripts/build.mjs` | Static page generation |
| `.github/workflows/pages.yml` | Automatic GitHub Pages publication |

`dist/` is generated and ignored by Git. Edit the source, not the generated files.

## Deploy

Push a commit to `main`. GitHub Actions builds the site, checks local links and image references, and deploys `dist/` to GitHub Pages. Set repository **Settings → Pages → Source** to **GitHub Actions**.

This is a **project site**, deliberately isolated from any user site or custom domain. No `CNAME` is created. All application links and assets are relative, including nested case-study pages.

## What works

- A persistent room with floating glass windows for Welcome, Work, About, Playground, Contact, Résumé, and case studies.
- Three complete, directly linkable case studies. Direct URLs open the same immersive workspace.
- Desktop window movement using a title bar or grab handle, plus keyboard arrow movement, single-click Arrange controls, expansion, closing, and recentering.
- Navigation through the dock; content scrolls inside the active window. Browser Back/Forward and hash deep links work.
- In-site résumé reader with career disclosures, section navigation, skills, education, awards, and an optional PDF source link.
- Project studios with animated artifact selection, focused image inspection, zoom, and keyboard/touch controls.
- Responsive desktop, tablet, and mobile layouts.
- A consistent daylight appearance, a wider room, directional/drag/keyboard camera controls, and Clear view.
- A spatial status bar with local time and browser-reported battery, or a clearly labeled Demo indicator.
- Lumi, a movable browser-only portfolio guide with built-in answers, source links, optional dictation and read-aloud, and motion controls.
- Spatial Pairs, an untimed memory game with keyboard/touch play, score, matching feedback, and restart.
- Native scrolling enhanced with progress, edge shadows, entry motion, and Back to top.
- Project filters, animated window transitions, and pointer-driven environmental depth.
- Interactive glass material study with three palettes.
- Native FAQ disclosure controls, résumé and social links, and email contact.
- Device reduced-motion support, keyboard focus indicators, skip navigation, meaningful image alternatives, and readable content without JavaScript.
- No tracking, accounts, paid APIs, remote project assets, framework runtime, or required backend.

## Static versus dynamic

Motion and interactive UI do not require a server. This portfolio is static: the hosting service serves HTML, CSS, JavaScript, and images. The visitor's browser runs the interactions.

A server becomes useful for future features such as persistent accounts, database content, secure AI requests, or a custom contact-form inbox. You can retain this frontend and add a backend later, or migrate to a server-capable host.

GitHub Pages is suitable for this version. Vercel currently offers a free Hobby tier for personal/non-commercial projects within its usage limits. Free tiers are ongoing plans, not a guarantee of permanent pricing. Vercel is optional, not a requirement for these animations.

## Content and attribution

Content and assets were migrated from Isha's public portfolio. See `docs/content-sources.md` for provenance, editorial decisions, and reference links. Inspiration informed the visual direction; no ryOS source code or Behance imagery is included.

Work is committed in checkpoints so it can be recovered after a browser or machine crash.

## Governing design direction

Opening and navigating the portfolio should feel like being inside an Apple Vision Pro. See `docs/design-direction.md` before future layout or navigation changes. The removed ik logo and atmosphere control must stay removed.

The room is a generated visual environment, not a photograph of Isha’s actual home or studio. Its generation prompt and provenance are in `docs/spatial-environment.md`.

## Accessibility release checks

WCAG 2.2 AA and usability on desktop, tablet, and mobile are governing requirements. See `docs/accessibility.md` for implemented behavior, verification results, and remaining manual assistive-technology checks. Automated checks do not certify conformance.

For a local axe audit, install `axe-core` into a temporary directory outside this repository, build, then run:

```sh
node scripts/prepare-audit.mjs /absolute/path/to/axe-core/axe.min.js
npm run preview
```

Visit `http://127.0.0.1:4173/?audit=1`. Reports appear as JSON in `#audit-results`. Optional local stress modes: `contrast=dark`, `contrast=light`, `text=200`, and `spacing=1`. Navigate through all windows and projects. Rebuild with `npm run build` afterward; `npm run check` intentionally rejects an instrumented build. The deployed site includes neither axe nor the audit runner.

## Browser voice and Lumi

No AI API key or backend is used. Answers are retrieved from the portfolio and résumé data in `world.mjs`; `npm test` checks routing, follow-ups, unknown/private questions, and source-entry validity. GitHub Actions runs these checks before deployment.

Dictate uses SpeechRecognition / webkitSpeechRecognition where available. A user click starts permission and capture; text is editable before Send. Browser speech services may send audio to their provider. Read aloud uses SpeechSynthesis, preferring an English local device voice. Support, installed voices, and permission behavior vary by browser. Unsupported or failed voice input leaves text chat available. Chat is not saved; only the ambient-motion preference is stored locally.

See `docs/world-features.md` for verification and remaining hardware/assistive-technology checks.

## Wider view — October 12, 2026

The current environment uses `public/assets/spatial-room-wide.webp`, a sibling asset generated by outpainting the original room. The original `spatial-room.webp` is retained. The PNG was saved at `/Users/ArpitSidana/.codex/generated_images/01a12da1-cf23-7043-9736-bf920fb8a5e0/exec-5dab912e-ac91-4046-8290-93b58a3b8160.png`, then converted to WebP at quality 88. Dimensions: 1672×941.

Prompt: Expand the supplied room photo in every direction with a wider rectilinear architectural view. Preserve the warm ivory plaster room, garden/glazing at left, oak floor and curtains, beige sofa and leafy plant at right, central quiet wall, and late-afternoon light. Place the original scene in approximately the central 65 percent. Add plausible extra garden/glazing at far left, room continuation at far right, more ceiling, and substantial foreground floor/rug. Keep straight verticals, no fisheye, no people, screens, UI, text, logos, or watermarks.

The site pans a bounded oversized image plane. It is an illustrative room with peripheral detail, not a live camera feed, reconstructed 3D room, or a photograph of Isha’s home.

## Spatial space, guide, and Play

The user requested a larger field of view with room panning, more expressive native scrolling, spatial status details, a cute movable guide with optional voice, and an actual game in Play. The user explicitly chose a browser-only guide with built-in answers rather than an API-backed AI assistant. Preserve that choice: no API keys, hidden paid calls, or backend dependency. Keep explicit controls and keyboard alternatives for panning and character placement, a way to pause ambient motion, and fallback text interaction when browser voice is unavailable. Play is now an untimed attention/memory game, with the original field notes and material sketch retained under a disclosure.
