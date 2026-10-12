# Content sources and design decisions

Migrated on October 11, 2026 (America/New_York).

## Source material

- https://www.isha-kumari.com/ — introduction, selected projects, experience domains, upcoming work, contact and résumé links.
- https://www.isha-kumari.com/about-me — personal story, solo travel, approach to design, personal and workshop photographs.
- https://www.isha-kumari.com/bmw — BMW case study, project roles, research counts, outcomes, constraints, solution, reflections, and imagery.
- https://www.isha-kumari.com/myntra — Chemistry case study, outcome metrics, role, NDA limitation, discovery and trust-signal decisions, and imagery.
- https://www.isha-kumari.com/bloom — Bloom case study, research findings, device and app concept, role, constraints, and imagery.

## Editorial decisions

The pages have been rewritten into a consistent narrative while retaining the published facts. Repeated Framer breakpoint content and obvious layout artifacts were removed. The original site exposes FAQ questions without answers; the answers in this initial rebuild are new drafts grounded in the published project narratives and about page.

BMW and Chemistry metrics are carried over as reported project outcomes. Their original pages do not document measurement methodology, sample definitions, or whether every outcome reflects prototype testing or production behavior. The rebuild does not add those details or imply a verified live deployment.

Bloom's percentages are research findings, not outcome metrics. Sample size is not stated in the original content. The original images display Indigo Design Award Winner 2025 and IDA Honorable Mention 2024; these are attributed to the Bloom concept.

Chemistry's original timeline says “6 Months, Sep – Mar 2023,” an ambiguous date range. This initial version displays “6 months · 2023” without inventing calendar endpoints. Its NDA limitation is retained.

Landing Page + Onboarding Refresh and Tindoori remain coming-soon entries; no case-study detail or outcome has been invented for them. The résumé points to the Google Drive file linked by the original About page. Contact uses the email already published on the original site.

Project and personal images are optimized local WebP assets. Their underlying original artwork belongs to the user according to the task. No third-party reference artwork is redistributed.

## Visual inspiration

- https://www.behance.net/gallery/222546091/Apple-Vision-Pro-3D-Launch-Film-Brand-Design
- https://www.behance.net/gallery/203859095/Top-2025-ARVR-Concepts-Amazon-Airbnb-More
- https://www.behance.net/gallery/173818447/Spatial-UI-Design-Apple-vision-PRO
- https://www.behance.net/gallery/187050225/Apple-Vision-Pro-UI-Design
- https://x.com/z1hanhuang/status/2109166600763179015
- https://github.com/ryokun6/ryos

The accessible Behance references establish translucent panels, rounded windows, depth, environmental lighting, and focused interface content. The X post could not be retrieved directly; the linked inspiration was researched through the public ryOS repository. The code here was written independently and does not embed a complete operating system or represent native visionOS.

## Hosting references

- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://vercel.com/docs/plans/hobby
- https://vercel.com/pricing

## Résumé app source

The original homepage links to two Drive PDFs. The rebuilt résumé uses the homepage’s first link: `https://drive.google.com/file/d/1bMh25tbI3JcUFS4FD0a6Ta2a8GJ4GFv4/view?usp=drive_link`. It includes Geny Labs (Oct 2025–Present), Tindoori Labs (May–Oct 2025), BMW (Mar–May 2024), Walmart–Myntra (Oct 2020–May 2023), and Reliance (Sep 2018–Oct 2020). This version was downloaded, text-extracted, and visually reviewed.

The About-page PDF (`1G4TvDpUMEDjZkQifp59djIf087OMFKzG`) is a different version: it describes Tindoori as the current role and contains different metrics and a 200 CLUB entry. We do not merge the two versions. `resume.mjs` retains the homepage version’s dates, education, awards, skill groups, and reported impact. Its introduction is a concise editorial summary, not a verbatim quotation. The displayed name is Isha and contact uses the already-public email/social links. The source PDF remains optional; the original remote file is not changed. Résumé metrics are attributed to that source, not independently verified.

Project studios inspect the user’s existing visual artifacts. Switching images, opening focused view, browsing, and zoom are real interactions; screenshots are presented as design artifacts and are not represented as running BMW/Myntra/Bloom apps. No new project outcomes or 3D product models were invented.


## Featured awards and personal interests — October 12, 2026

The two Featured links on [Isha’s LinkedIn profile](https://www.linkedin.com/in/ishakumari7/) were inspected in the browser. Both use the identical Bloom description preserved verbatim in `bloomAwardDescription` in `content.mjs`. The two matching product thumbnails were saved as `bloom-featured-ida.webp` and `bloom-featured-indigo.webp` so the deployed page does not rely on expiring LinkedIn media URLs.

- [IDA Design Award 2024](https://www.idesignawards.com/social/zoom.php?eid=9-59317-24): the official entry confirms Bloom’s Honorable Mention.
- [Indigo Design Award 2025](https://www.indigoaward.com/winners/9906): this is the exact Featured destination, confirming three Silver and two Bronze awards for Bloom. It lists Isha and Helena Chien as lead designers.

The Awards app links directly to those entries and also offers a separate route into the Bloom case study. It does not describe two different projects.

[The original About page](https://www.isha-kumari.com/about-me) was inspected again. Its New Balance sneaker, notebook, coffee, and Friends cast cutouts are represented in the About interest folders; Friends was also explicitly identified by the user. Short folder captions are editorial copy based on those interests, while “I explore AI tools, but I think best with pen and paper” is quoted from the original page. `friends.webp` is an older travel photograph and is not the TV show asset; the new `friends-sticker.webp` uses the actual Friends cutout. The user supplied [X / Twitter](https://x.com/mehtaisha16), now included in Contact.
