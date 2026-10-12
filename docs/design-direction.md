# Design direction — Isha’s spatial portfolio

The user’s governing vision is that opening the website feels like being **inside an Apple Vision Pro**. The spatial environment is the navigation model for the whole experience, not a decorative hero on a conventional scrolling website.

- A persistent room surrounds the visitor throughout navigation.
- Work, About, Playground, Contact, Résumé, and case studies open as floating glass windows.
- The dock is the primary navigation. Scrolling happens within a window.
- Windows support moving, expanding, closing, and recentering on desktop.
- Mobile retains the room and dock, with windows adapted to usable touch sizes.
- Motion should communicate depth and focus while respecting device reduced-motion settings.
- Keep content useful to recruiters and collaborators; preserve direct project links and all case-study material.
- The “ik” logo and atmosphere/snowflake control were explicitly removed. Do not reintroduce them.
- Save and commit progress in chunks; the user’s Mac can crash under memory pressure.
- Publish only to the separate GitHub Pages project. The existing Framer deployment and custom domain remain untouched.

Reference links and content provenance are in `content-sources.md`. The interface is inspired by visionOS and is implemented as an independent website.

## Accessibility and responsive requirements

Desktop, tablet, and mobile usability and **WCAG 2.2 Level AA** are governing requirements for every release. Preserve the spatial environment while making content usable with screen readers, keyboard navigation, touch, zoom, reduced motion, and high-contrast settings.

- Never rely on dragging, pointer position, color, or hover alone to complete an action.
- Provide meaningful landmarks and headings, control labels, focus management, keyboard scrolling, and announcements for navigation and asynchronous content.
- Meet text contrast (4.5:1 for normal text; 3:1 for large text) and meaningful non-text contrast (3:1), accounting for glass backgrounds.
- Support 200% text resizing and reflow at 320 CSS pixels, including a readable layout when zoom or landscape leaves a short viewport.
- Use at least 24×24 CSS px targets or permitted spacing exceptions; prefer 44×44 for standalone controls.
- Keep focus visible and unobscured, avoid keyboard traps, and respect reduced motion and forced colors.
- Use meaningful image alternatives. Add captions/transcripts if audio or video is introduced later.
- Audit visible windows and menus, not only the homepage. Combine automated checks with manual keyboard, zoom, responsive, and assistive-technology review. Never describe an automated pass as a full WCAG certification.

## Project and résumé interactions

The user wants work to feel like inspecting an app inside Vision Pro, informed by the ryOS/iPod motion reference. Project launch motion, a dimensional artifact stage, selectable visual assets, and a focused zoom viewer implement that direction. Keep artifact captions and the full research narrative accessible. The résumé is an in-site spatial reader, with its PDF retained as an optional source link. Dock controls should have strong visual priority and legible labels rather than washed-out colors. The displayed name and preview title must remain Isha.
