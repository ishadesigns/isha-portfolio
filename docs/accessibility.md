# Accessibility and responsive design

The governing target is **WCAG 2.2 Level AA**, alongside usable desktop, tablet, and mobile layouts. This applies to future releases, not only the initial build. Reference: [W3C WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

## Implemented behavior

- Named header, navigation, main, window, and scroll-region landmarks; one active primary heading with correctly ordered section headings.
- Navigation precedes main content in the reading order. Hidden windows are removed from the accessibility tree. The decorative room is hidden from assistive technology.
- Skip navigation, descriptive image alternatives, native links/buttons/disclosures, visible focus rings, and no positive tabindex values.
- Focus follows window navigation. Case loading announces busy/loaded/error state. Filter counts and copy confirmations use live status messages.
- Scrollable windows can receive keyboard focus and support ordinary Page Up, Page Down, and arrow-key scrolling. Tab can leave the window; no modal focus trap.
- Desktop windows can be positioned through drag handles, arrow keys, or single-click Arrange controls. Escape closes the Arrange group first and returns focus to its trigger. Positioning is constrained outside the header and dock. Small-screen fixed windows do not expose unusable drag controls.
- Standalone touch controls generally target 44 CSS pixels. Navigation retains visible text labels. Selected filters and material colors expose pressed state; selection is not communicated solely by color.
- Text uses rem sizing, readable body typography, wrapping, and unrestricted zoom. Window height accounts for actual header/dock height, including enlarged text.
- At short viewport heights, the same room remains visible but navigation and the active window enter document flow. This permits vertical reading without fixed navigation covering the content.
- Reduced-motion behavior and forced-colors/reduced-transparency styling are present. No interaction requires pointer depth effects.
- Static direct project pages and ordinary navigation remain usable without JavaScript.

## Development verification — 2026-10-12 UTC

`docs/accessibility-audit-results.json` preserves 37 successful automated scan states after the corresponding repairs. These are development snapshots, not an exhaustive conformance report. Axe-core 4.14.0 used WCAG 2 A/AA, 2.1 A/AA, 2.2 AA, and best-practice rules. The initial scan found missing landmark coverage and skipped heading levels; both were repaired.

Checked states included:

| Check | Evidence |
| --- | --- |
| Desktop | Welcome, Work, About, Playground, Contact, all three full cases, and Arrange disclosure; zero reported violations in tested states |
| Narrow mobile | All five windows at 320×740; no horizontal content overflow; mobile project tap opened its case |
| Phone | Welcome at 390×844 and a full case; zero reported violations |
| Tablet | Work at 768×1024; all five windows at 1024×768 with a white backdrop |
| Landscape | Work at 812×375 in vertical document flow |
| Zoom reflow | Work at 320×196 CSS pixels, approximating the viewport of a 1280×784 window at 400% zoom; document scrolling and skip-link focus checked |
| Text preferences | 200% root text size combined with 1.5 line height, .12em letter spacing, .16em word spacing, and 2em paragraph spacing; all five windows at 390px and all three cases at 320px |
| Keyboard | Window navigation, case links, filter selection/status, Page Down, Arrange movement, Escape/focus restoration, and skip navigation |
| Glass contrast | Black/white stress backdrops plus conservative color calculations |

Axe reports some contrast checks as **incomplete**, rather than passed, where an image, gradient, transformed satellite, or scroll clipping prevents background calculation. These remain explicitly listed in the evidence. The main glass surfaces use `rgba(244,247,239,.96)`, bounding the darkest possible surface at approximately RGB (234,237,229). Against that bound, ink `#202c24` is 12.28:1, body/muted text `#425047` is 7.19:1, accent `#355541` is 7.03:1, labels `#35463b` are 8.50:1, and focus `#21517a` is 7.04:1. White text over the project-category overlay retains at least 9.90:1 even above a pure-white image. These calculations cover those specified tokens, not every pixel or original case-study image.

The production build passes 467 static checks, including image alternatives, routes, unique IDs, ARIA references, skip navigation, named navigation, status announcements, unrestricted zoom, and inclusion of the accessibility stylesheet. Checks reject local audit instrumentation and custom-domain configuration. Audit scripts and axe are excluded from deployment.

## Remaining manual release checks

A full VoiceOver + Safari and NVDA + Firefox/Chrome walkthrough has **not** been performed. Actual browser zoom, physical iOS/Android touch, forced-colors settings, and reduced-motion settings still need device/assistive-technology confirmation. Viewport and text stress tests are useful proxies, not replacements. Review the clarity and completeness of image alternatives with a screen-reader user, especially project diagrams containing embedded UI text.

Do not claim complete WCAG compliance or certification based on automated scans. Keep these manual checks in the release process, and repeat affected checks when navigation, content, or visual tokens change.

## Résumé and project studio verification

The follow-up implementation adds a native résumé reader and artifact studios to all three projects. `experience-audit-results.json` records 19 successful automated states covering the six dock destinations, three project studios and focused dialogs, mobile résumé and inspection, enlarged text/spacing, and short-viewport résumé reading. A shortened dock label initially caused a Label in Name finding; it was repaired by using consistent Home/Play labels. The focused viewer uses a native modal dialog, Escape, focus restoration, descriptive image labels, announced selection/zoom, and ordinary keyboard-scrollable zoom content. Buttons stay reachable at zoom limits. Mobile artifact trays reflow into a two-column grid instead of requiring sideways scrolling.

Manually exercised résumé section jumps, project links, artifact selection, next image, 150% image zoom, Close/Escape, and reading-story jumps. Verified the selected inspector artifact persists when returning to the studio, and that the case window stays open. Project launch and gallery transitions respect reduced-motion preferences and use short compositor animations rather than a continuous 3D renderer. The manual assistive-technology/device limitations above still apply.
