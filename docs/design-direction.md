# Design direction — Isha’s spatial portfolio

The user’s governing vision is that opening the website feels like being **inside an Apple Vision Pro**. The spatial environment is the navigation model for the whole experience, not a decorative hero on a conventional scrolling website.

- A persistent room surrounds the visitor throughout navigation.
- Work, About, Playground, Contact, and case studies open as floating glass windows.
- The dock is the primary navigation. Scrolling happens within a window.
- Windows support moving, expanding, closing, and recentering on desktop.
- Mobile retains the room and dock, with windows adapted to usable touch sizes.
- Motion should communicate depth and focus while respecting device reduced-motion settings.
- Keep content useful to recruiters and collaborators; preserve direct project links and all case-study material.
- The “ik” logo and atmosphere/snowflake control were explicitly removed. Do not reintroduce them.
- Save and commit progress in chunks; the user’s Mac can crash under memory pressure.
- Publish only to the separate GitHub Pages project. The existing Framer deployment and custom domain remain untouched.

Reference links and content provenance are in `content-sources.md`. The interface is inspired by visionOS and is implemented as an independent website.
