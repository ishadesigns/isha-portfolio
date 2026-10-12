# Spatial space, Siri, and Play

Implemented October 12, 2026, following the user’s explicit choice of a browser-only guide.

## Room and scrolling

The expanded illustrative room supports bounded horizontal and vertical panning. Look around exposes touch-friendly direction buttons and Center. Clear view temporarily hides app windows; dragging or arrow keys moves the camera. Return to portfolio, dock navigation, and Escape restore app reading. Browser Back/Forward remains usable. This is an image-based environment, not a live camera feed or a reconstructed 3D scene.

Scrolling remains native for touch, wheels, trackpads, and keyboard. Reading progress, custom scrollbar styling, scroll-edge shadows, short entry transitions, and Back to top add motion and feedback without hijacking wheel events. User motion pause and device reduced-motion preferences are respected.

Open to opportunities is a distinct green, non-interactive callout inside the unified status capsule. The status bar shows local time and the browser-reported battery value when available. Unsupported browsers show a labeled Demo battery illustration; the site does not claim to read Vision Pro hardware.

## Siri

Siri’s body, visor, ring, and highlights are editable CSS. A brief panel-opening transition and restrained idle floating establish the character. Dragging and arrow keys move it. The separate placement and floating-pause controls were removed at the user’s request; room-wide Pause ambient motion and reduced-motion preferences still stop idle movement. The avatar has a layered orbital ring, fine shell outlines, reflective visor, and a slow blink. The guide uses a native modal dialog with Close/Escape, focus restoration, and a scrollable conversation.

`world.mjs` builds 50 content entries from the existing portfolio, resume, FAQ, and the site’s own interaction instructions. `guide-engine.js` retrieves built-in answers and handles project follow-ups, current-role questions, comparisons, unknown queries, and requests for unpublished details. It does not use an LLM, AI API key, or server. Answers have links to the relevant case study, resume, Awards, About, Play, or Contact window. User questions are inserted as text, never HTML. The conversation is bounded and not persisted; ambient-motion preference is the only local-storage item.

Dictate uses SpeechRecognition or webkitSpeechRecognition when exposed by the browser. Only a user click starts microphone permission/capture. Pending startup prevents duplicate requests and times out after 12 seconds. `voice-support.js` distinguishes blocked access, microphone capture, speech-service connection, unsupported language, and no-speech failures. Late events from closed or replaced sessions cannot change the question field. Dictation appends to the existing typed question; interim results replace the current transcript without duplication. Dictated text remains editable and must be sent explicitly. Recognition is stopped on Close and when the page is hidden. Browser recognition may use a remote speech service; this is disclosed in the interface. Unsupported, rejected, or failed recognition leaves text chat usable.

Read aloud uses SpeechSynthesis, preferring enhanced/premium/natural/neural English voices and selected device voices such as Samantha as fallback. Stop reading, Close, and page hiding cancel speech. Playback errors and a startup timeout produce visible feedback. The site does not clone Isha’s voice. See [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) and [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) for browser support and behavior.

## Spatial Pairs

Play now leads with an untimed memory game: twelve cards and six matching shapes. The deck shuffles on New game. Matching updates pair and move counts, with descriptive accessible names and live feedback. A mismatch remains visible until another card is chosen. Tab, arrow keys, Enter, and touch are supported. Shape names accompany color, and matched state is explicit. Mobile uses a three-column board. The original field notes and material sketch remain under Studio sketches & field notes.

## Verification

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
