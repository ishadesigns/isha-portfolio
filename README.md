# Isha Kumari — Spatial Portfolio

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
| `content.mjs` | Project copy, metrics, contact links, résumé, FAQ |
| `config.mjs` | Published site URL for canonical links and social metadata |
| `site.mjs` | Page structure, navigation, hero, project cards, case study templates |
| `styles.css` | Colors, typography, glass materials, animations, all responsive layouts |
| `app.js` | Filtering, motion, material demo, case study dialogs |
| `public/assets/` | Local optimized project images and personal photos |
| `scripts/build.mjs` | Static page generation |
| `.github/workflows/pages.yml` | Automatic GitHub Pages publication |

`dist/` is generated and ignored by Git. Edit the source, not the generated files.

## Deploy

Push a commit to `main`. GitHub Actions builds the site, checks local links and image references, and deploys `dist/` to GitHub Pages. Set repository **Settings → Pages → Source** to **GitHub Actions**.

This is a **project site**, deliberately isolated from any user site or custom domain. No `CNAME` is created. All application links and assets are relative, including nested case-study pages.

## What works

- Three complete, directly linkable case studies, also available in native accessible dialog windows.
- Responsive desktop, tablet, and mobile layouts.
- A consistent daylight appearance.
- Project filters, smooth anchor navigation, a floating navigation dock, scroll reveals, and pointer-driven depth.
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
