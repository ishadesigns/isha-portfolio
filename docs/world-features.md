# Spatial space, Siri, and Play

Implemented October 12, 2026, following the user’s explicit choice of a browser-only guide.

## Room and scrolling

The expanded illustrative room supports bounded horizontal and vertical panning. Look around is in the navigation dock and exposes touch-friendly direction buttons and Center. Clear view temporarily hides app windows; dragging or arrow keys move the camera. Held dragging near a viewport edge continues panning until the full bounded view is reached. Empty room areas also support dragging while app windows are open. Return to portfolio, dock navigation, and Escape restore app reading. Browser Back/Forward remains usable. This is an image-based environment, not a live camera feed or a reconstructed 3D scene.

Scrolling remains native for touch, wheels, trackpads, and keyboard. Reading progress, custom scrollbar styling, scroll-edge shadows, short entry transitions, and Back to top add motion and feedback without hijacking wheel events. Site-level motion switches are removed; device reduced-motion preferences remain respected.

Open to opportunities is a distinct green, non-interactive callout inside the unified status capsule. Its visual order is availability, a lighter Siri action, local time, and battery. The status bar shows local time and the browser-reported battery value when available. Unsupported browsers show a labeled Demo battery illustration; the site does not claim to read Vision Pro hardware.

## Siri

Siri’s body, visor, ring, and highlights are editable CSS. A brief panel-opening transition and restrained idle floating establish the character. Dragging and arrow keys move it. The separate placement and floating-pause controls were removed at the user’s request; the room-wide motion switch is also removed. Device reduced-motion preferences still stop decorative motion. The avatar has a layered orbital ring, fine shell outlines, reflective visor, a frequent blink, and a shifting gaze. Its ring spins on hover or keyboard focus. The avatar stays present in Clear view and on small screens. The guide uses a native modal dialog with Close/Escape, focus restoration, and a scrollable conversation.

`world.mjs` builds 50 content entries from the existing portfolio, resume, FAQ, and the site’s own interaction instructions. `guide-engine.js` retrieves built-in answers and handles project follow-ups, current-role questions, comparisons, unknown queries, and requests for unpublished details. It does not use an LLM, AI API key, or server. Answers have links to the relevant case study, resume, Awards, About, Play, or Contact window. User questions are inserted as text, never HTML. The conversation is bounded and not persisted; no chat or preferences are persisted; the former ambient-motion storage key is removed.

Dictate uses SpeechRecognition or webkitSpeechRecognition when exposed by the browser. Only a user click starts microphone permission/capture. Pending startup prevents duplicate requests and times out after 12 seconds. `voice-support.js` distinguishes blocked access, microphone capture, speech-service connection, unsupported language, and no-speech failures. Late events from closed or replaced sessions cannot change the question field. Dictation appends to the existing typed question; interim results replace the current transcript without duplication. Dictated text remains editable and must be sent explicitly. Recognition is stopped on Close and when the page is hidden. Browser recognition may use a remote speech service; this is disclosed in the interface. Unsupported, rejected, or failed recognition leaves text chat usable.

Read aloud uses SpeechSynthesis, preferring enhanced/premium/natural/neural English voices and selected device voices such as Samantha as fallback. Stop reading, Close, and page hiding cancel speech. Playback errors and a startup timeout produce visible feedback. The site does not clone Isha’s voice. See [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) and [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) for browser support and behavior.

## Isha’s Orbit

Spatial Pairs is replaced with a tactile orbit of ten projects and favorite things. BMW × Vision Pro and Bloom link into their case studies. Journals, Japanese stationery, iced lattes, pistachio iced lattes, white New Balance 9060 sneakers, Friends, Gossip Girl, and Sex and the City accompany them. Dragging and release velocity toss an object. Walls and neighboring objects respond with gentle bounces. Clicking or pressing Enter reveals a source-backed project story or a short interest caption. Tab focuses a stable object and arrow keys reposition it; Remix reshuffles the layout.

The simulation uses one capped 30 fps requestAnimationFrame loop, pauses when the app is hidden or a dialog is open, and stops for device reduced-motion preferences. Artwork is local WebP or generated, editable SVG. Decorative lettering stays within image assets while control names use the visible object labels. Field notes and the experiments link now live in About Me; the material color demo is retired.

## Earlier verification (before Orbit)

- 523 production-artifact checks passed, including routes, local images, ARIA references, unrestricted zoom, Isha branding, guide/game/room markup, and exclusion of audit instrumentation/custom-domain changes.
- 25 guide behavior checks and 50 source-entry validations passed. GitHub Actions runs these before publication.
- Tested six main destinations, room controls and Clear view, guide opening and answers, contextual BMW research, unknown-question behavior, and game completion/reset.
- Completed all six game pairs, then verified reset returned to zero pairs/moves.
- Verified native Page Down updated reading progress and exposed Back to top.
- Verified direct avatar and room dragging, one-click placement, keyboard panning/movement, motion pause, Escape, and return/dock/history navigation.
- Tested 320×740 mobile, 768×1024 tablet, 320×196 short-viewport reflow, and 200% text plus WCAG text-spacing overrides. Repaired dialog/control overflow rather than suppressing zoom.
- Automated axe scans of tested states reported no violations after repairs. Initial scans found conflicting game-card labels and inherited chat text color; both were fixed. Some image/gradient contrast checks remain automated incomplete results and require manual review, as recorded in the audit summaries.

A full VoiceOver/NVDA walkthrough, physical touch-device tests, and end-to-end microphone/audio-hardware tests remain manual release checks. Browser speech availability is not a guarantee of a working voice service or installed voice. The automated and viewport checks are not WCAG conformance certification. Existing accessibility requirements in `accessibility.md` still govern every release.

## October 12 interface refinement verification

The companion is now Siri. Its initial prompts are full leading questions with right arrows, and the composer has named, 44-pixel icon-only microphone/send buttons. Clear chat is the sole toolbar action. Resume uses unaccented spelling throughout the built site. Home has a saturated teal icon. At desktop height the close control has 13.5 pixels of clearance from the panel. About’s primary portrait has no rotation. Its four interests use the original cutouts and native folder-like disclosure controls.

The new Awards window uses the two exact Featured thumbnails and shared description from LinkedIn, with verified direct IDA and Indigo destinations. The dock has seven destinations and uses two rows on narrow phones to keep touch controls usable. Availability sits inside the status capsule with a distinct green background and no link/button behavior. Contact includes the supplied X profile.

- 607 production checks; 29 guide behavior checks; 50 source-entry validations; 24 speech-helper assertions passed.
- Desktop scans of all seven destinations, desktop/mobile Siri, mobile Awards, tablet About with the Friends folder open, a 200% text/spacing Siri stress state, and Awards opened from a direct Bloom page reported no automated violations. See `refinement-audit-results.json`. Image/gradient contrast checks include manual-review results; this is not accessibility certification.
- Clear chat emptied the conversation; leading questions produced relevant answers; the avatar moved using arrow keys; the portrait computed transform was `none`; the availability callout was inside the status capsule. No horizontal page or dialog overflow was observed at 320×740 and 768×1024, or in the enlarged-text dialog.
- Voice checks selected the available Samantha device voice. Actual audio quality was not judged. Both browser microphone attempts remained pending and hit the new startup timeout; successful human speech transcription is **not verified** in this environment. The button recovered and displayed specific guidance. Unit assertions cover interim transcript replacement, preserving an existing question, stale events after close, errors, timeouts, and unsupported/unsafe contexts. Microphone/audio-hardware testing remains a user-device check.


## Orbit and room refinement verification — October 12, 2026

707 production checks, guide/voice tests, and motion tests passed. Motion assertions cover held dragging at all four viewport edges reaching the full view, camera bounds, wall bounce, stable focused objects, collisions, and sustained bounded movement. Browser-native dragging reached x=-1, x=1, y=-1, and y=1. Clear view kept Siri visible. Keyboard focus activated the ring animation; blink and gaze animations were present. An orbit drag did not open its detail, while keyboard activation showed BMW’s story and its link opened the BMW case study. The simulation stopped when hidden. The single-line composer sent a typed BMW question and received the correct role answer.

Automated scans of all seven destinations, the compact Siri dialog, mobile Orbit/Siri/Clear view, enlarged text with spacing overrides, medium-width Orbit, and tablet About Me are recorded in `orbit-audit-results.json`. Decorative SVG text was separated into image assets after an initial accessible-name mismatch. A medium-width overlap between Siri and Recenter was repaired by placing Siri above the dock. No horizontal overflow was observed in the tested layouts. Some image/gradient contrast checks remain manual-review results; a full assistive-technology and physical-device walkthrough remains outstanding. Voice-hardware verification limitations from the earlier refinement remain unchanged.
