import { initOrbit } from "./orbit-app.js";
import { dragRoom, edgeVelocity, advanceRoom } from "./room-motion.js";
import { preferredVoice, createDictationController } from "./voice-support.js";
import { guideAnswer } from "./guide-engine.js";

const root = document.documentElement;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const calm = () => motionQuery.matches;
const base = new URL(document.body.dataset.base, document.baseURI);
const knowledge = JSON.parse($("#guide-knowledge").textContent);
root.classList.add("world-ready");

// Spatial status. A demo label is shown rather than inventing a device percentage.
function tickClock() {
  $("[data-world-clock]").textContent = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}
tickClock();
setInterval(tickClock, 60000);
if (navigator.getBattery)
  Promise.resolve()
    .then(() => navigator.getBattery())
    .then((battery) => {
      const update = () => {
        $("[data-battery-label]").textContent =
          `${Math.round(battery.level * 100)}%`;
        $("[data-battery-fill]").setAttribute(
          "width",
          String(17 * battery.level),
        );
        $("[data-battery-description]").textContent =
          `Browser-reported battery ${Math.round(battery.level * 100)} percent${battery.charging ? ", charging" : ""}`;
        $(".hud-battery").title = battery.charging
          ? "Browser-reported battery, charging"
          : "Browser-reported battery";
      };
      update();
      battery.addEventListener("levelchange", update);
      battery.addEventListener("chargingchange", update);
    })
    .catch(() => {});
delete root.dataset.userMotion;
try { localStorage.removeItem("isha-ambient-motion"); } catch {}
function updateMotion() {
  root.classList.toggle("world-quiet", calm());
  document.dispatchEvent(new Event("worldmotionchange"));
}
updateMotion();
motionQuery.addEventListener("change", updateMotion);

// Room exploration is an explicit camera movement, separate from tiny pointer parallax.
const explorer = $(".room-explorer"),
  roomControls = $("#room-controls"),
  lookToggle = $("[data-look-toggle]");
let pan = { x: 0, y: 0 },
  savedVisible = [],
  roomActive = false,
  roomDrag = null;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
function moveRoom(x, y, announce = false) {
  pan = { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
  root.style.setProperty("--pan-x", String(pan.x));
  root.style.setProperty("--pan-y", String(pan.y));
  if (announce)
    $("[data-room-status]").textContent =
      `Room view ${pan.x < -0.1 ? "left" : pan.x > 0.1 ? "right" : "centered"}${pan.y < -0.1 ? ", looking up" : pan.y > 0.1 ? ", looking down" : ""}.`;
}
function roomMenu(open, restore = false) {
  roomControls.hidden = !open;
  lookToggle.setAttribute("aria-expanded", String(open));
  if (open) $('[data-pan="left"]').focus({ preventScroll: true });
  else if (restore) lookToggle.focus({ preventScroll: true });
}
function setRoomView(open, restore = true) {
  if (open === roomActive) return;
  stopRoomDrag();
  roomActive = open;
  root.classList.toggle("room-looking", open);
  $("[data-room-clear]").setAttribute("aria-pressed", String(open));
  $("[data-room-clear]").textContent = open ? "Show windows" : "Clear view";
  if (open) {
    closeGuide(false);
    roomMenu(false);
    savedVisible = $$(
      "[data-window]:not([hidden]),[data-home-orbit]:not([hidden]),.space-idle:not([hidden])",
    );
    savedVisible.forEach((el) => (el.hidden = true));
    explorer.hidden = false;
    const old = explorer.querySelector("h2");
    if (old) {
      const heading = document.createElement("h1");
      heading.textContent = old.textContent;
      old.replaceWith(heading);
    }
    explorer.focus({ preventScroll: true });
    if (innerHeight <= 540)
      explorer.scrollIntoView({ block: "start", behavior: "instant" });
    $("[data-room-status]").textContent =
      "Clear room view. Drag, use arrow keys, or choose the direction buttons to explore. The dock opens your portfolio windows.";
  } else {
    explorer.hidden = true;
    const old = explorer.querySelector("h1");
    if (old) {
      const heading = document.createElement("h2");
      heading.textContent = old.textContent;
      old.replaceWith(heading);
    }
    if (restore) {
      savedVisible.forEach((el) => (el.hidden = false));
      const content = $("[data-window]:not([hidden]) .spatial-scroll");
      content?.focus({ preventScroll: true });
    }
    savedVisible = [];
  }
}
let roomFrame = 0, roomTick = 0;
function continueRoomDrag(time) {
  roomFrame = 0;
  if (!roomDrag) return;
  const velocity = edgeVelocity(roomDrag, { width: innerWidth, height: innerHeight });
  const next = advanceRoom(pan, velocity, Math.min((time - roomTick) / 1000, 0.05));
  roomTick = time;
  moveRoom(next.x, next.y);
  roomFrame = requestAnimationFrame(continueRoomDrag);
}
document.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || event.target.closest("button,a,input,summary,dialog,.space-status,.spatial-dock,.room-controls,.portfolio-guide,[data-window]")) return;
  if (!roomActive && !event.target.matches("body,.spatial-workspace,.space-idle")) return;
  event.preventDefault();
  const target = event.target.closest(".room-explorer") || document.body;
  roomDrag = { id: event.pointerId, x: event.clientX, y: event.clientY, target };
  target.setPointerCapture(event.pointerId);
  root.classList.add("room-dragging");
  roomTick = performance.now();
  roomFrame = requestAnimationFrame(continueRoomDrag);
});
document.addEventListener("pointermove", (event) => {
  if (!roomDrag || roomDrag.id !== event.pointerId) return;
  const next = dragRoom(pan, { x: event.clientX - roomDrag.x, y: event.clientY - roomDrag.y }, { width: innerWidth, height: innerHeight });
  roomDrag.x = event.clientX;
  roomDrag.y = event.clientY;
  moveRoom(next.x, next.y);
});
function stopRoomDrag() {
  const drag = roomDrag;
  roomDrag = null;
  cancelAnimationFrame(roomFrame);
  roomFrame = 0;
  root.classList.remove("room-dragging");
  if (drag?.target.hasPointerCapture(drag.id)) drag.target.releasePointerCapture(drag.id);
}
document.addEventListener("pointerup", stopRoomDrag);
document.addEventListener("pointercancel", stopRoomDrag);
document.addEventListener("lostpointercapture", (event) => { if (roomDrag?.id === event.pointerId) stopRoomDrag(); });
window.addEventListener("blur", stopRoomDrag);
document.addEventListener("visibilitychange", () => { if (document.hidden) stopRoomDrag(); });
explorer.addEventListener("keydown", (event) => {
  if (event.target !== explorer || !event.key.startsWith("Arrow")) return;
  event.preventDefault();
  moveRoom(
    pan.x +
      (event.key === "ArrowLeft"
        ? -0.15
        : event.key === "ArrowRight"
          ? 0.15
          : 0),
    pan.y +
      (event.key === "ArrowUp" ? -0.15 : event.key === "ArrowDown" ? 0.15 : 0),
    true,
  );
});

// Keep native scrolling; add only reading progress, shadows and entry motion.
let readingFrame;
function updateReading() {
  cancelAnimationFrame(readingFrame);
  readingFrame = requestAnimationFrame(() => {
    $$("[data-window]").forEach((panel) => {
      if (panel.hidden) return;
      const content = $(".spatial-scroll", panel);
      const short = innerHeight <= 540;
      const available = short
        ? Math.max(0, panel.scrollHeight - innerHeight)
        : content.scrollHeight - content.clientHeight;
      const position = short
        ? Math.max(0, -panel.getBoundingClientRect().top)
        : content.scrollTop;
      const progress = available > 1 ? clamp(position / available, 0, 1) : 1;
      panel.style.setProperty("--reading-progress", String(progress));
      $(".window-reading-progress", panel).setAttribute(
        "aria-valuenow",
        String(Math.round(progress * 100)),
      );
      panel.classList.toggle("is-scrolled", position > 35);
    });
  });
}
$$(".spatial-scroll").forEach((content) =>
  content.addEventListener("scroll", updateReading, { passive: true }),
);
window.addEventListener("scroll", updateReading, { passive: true });
window.addEventListener("resize", updateReading);
new MutationObserver(updateReading).observe(root, {
  subtree: true,
  attributes: true,
  attributeFilter: ["hidden", "open"],
});
const observers = new Map();
function watchContent(content) {
  observers.get(content)?.disconnect();
  const seen = new WeakSet();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          if (!calm())
            entry.target.animate(
              [
                { opacity: 0.78, transform: "translateY(10px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" },
            );
        }
    },
    { root: innerHeight <= 540 ? null : content, threshold: 0.12 },
  );
  $$(".space-project,.case-section,.resume-role", content).forEach((el) =>
    observer.observe(el),
  );
  observers.set(content, observer);
}
$$(".spatial-scroll").forEach(watchContent);
new MutationObserver(() => {
  watchContent($(".panel-case .spatial-scroll"));
  updateReading();
}).observe($(".panel-case .spatial-scroll"), { childList: true });
updateReading();

// Siri: source-backed answers, optional browser voice, and a movable character.
const guide = $("#guide-panel"),
  launcher = $(".guide-launch"),
  log = $(".guide-conversation"),
  question = $("#guide-question");
let guideTopic = "",
  avatarDrag = null,
  suppressClick = false,
  avatarPosition = null,
  speakingButton = null,
  guideTrigger = null,
  speechStartTimer,
  currentUtterance = null;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const canSpeak = !!window.speechSynthesis && !!window.SpeechSynthesisUtterance;
if (canSpeak) window.speechSynthesis.getVoices(); // Request the device voice list early.
const status = (text) => {
  $("[data-guide-status]").textContent = text;
};
const voiceNotice = (text) => {
  status(text);
  $("[data-guide-voice-note]").textContent = text;
};
if (!SpeechRecognition) {
  $("[data-guide-mic]").disabled = true;
  $("[data-guide-voice-note]").textContent =
    "Voice typing isn’t supported in this browser. Type a question or use your device keyboard’s dictation. Read aloud uses available browser voices.";
}
function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel();
  speakingButton?.setAttribute("aria-pressed", "false");
  if (speakingButton) speakingButton.textContent = "Read aloud";
  speakingButton = null;
  clearTimeout(speechStartTimer);
  currentUtterance = null;
  root.classList.remove("siri-speaking");
}
function closeGuide(restore = true) {
  if (guide.hidden) return;
  guide.close();
  guide.hidden = true;
  $$("[data-guide-open]").forEach((b) =>
    b.setAttribute("aria-expanded", "false"),
  );
  dictation.abort();
  stopSpeaking();
  if (restore)
    (guideTrigger?.getClientRects().length
      ? guideTrigger
      : innerWidth <= 780
        ? $("[data-guide-open].guide-inline")
        : launcher
    ).focus({
      preventScroll: true,
    });
}
function openGuide(trigger = launcher) {
  guideTrigger = trigger;
  if (!guide.hidden) return closeGuide();
  roomMenu(false);
  guide.hidden = false;
  guide.showModal();
  $$("[data-guide-open]").forEach((b) =>
    b.setAttribute("aria-expanded", "true"),
  );
  question.focus();
}
function setAvatar(x, y, announce = false) {
  const rect = launcher.getBoundingClientRect();
  avatarPosition = {
    x: clamp(x, 12, Math.max(12, innerWidth - rect.width - 12)),
    y: clamp(y, 12, Math.max(12, innerHeight - rect.height - 12)),
  };
  launcher.style.left = `${avatarPosition.x}px`;
  launcher.style.top = `${avatarPosition.y}px`;
  launcher.style.right = "auto";
  launcher.style.bottom = "auto";
  if (announce) status("Siri moved.");
}
function resetAvatar() {
  avatarPosition = null;
  for (const property of ["left", "top", "right", "bottom"]) launcher.style.removeProperty(property);
  status("Siri returned to its home position.");
}
launcher.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const rect = launcher.getBoundingClientRect();
  avatarDrag = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    origin: { x: rect.x, y: rect.y },
    moved: false,
  };
  launcher.setPointerCapture(event.pointerId);
});
launcher.addEventListener("pointermove", (event) => {
  if (!avatarDrag || avatarDrag.id !== event.pointerId) return;
  const dx = event.clientX - avatarDrag.x,
    dy = event.clientY - avatarDrag.y;
  if (Math.hypot(dx, dy) > 6) avatarDrag.moved = true;
  if (avatarDrag.moved) {
    event.preventDefault();
    root.classList.add("siri-dragging");
    setAvatar(avatarDrag.origin.x + dx, avatarDrag.origin.y + dy);
  }
});
function stopAvatarDrag() {
  suppressClick = !!avatarDrag?.moved;
  avatarDrag = null;
  root.classList.remove("siri-dragging");
}
launcher.addEventListener("pointerup", stopAvatarDrag);
launcher.addEventListener("pointercancel", stopAvatarDrag);
launcher.addEventListener("lostpointercapture", () => {
  avatarDrag = null;
  root.classList.remove("siri-dragging");
});
launcher.addEventListener("keydown", (event) => {
  if (!event.key.startsWith("Arrow")) return;
  event.preventDefault();
  const rect = launcher.getBoundingClientRect();
  setAvatar(
    rect.x +
      (event.key === "ArrowLeft" ? -20 : event.key === "ArrowRight" ? 20 : 0),
    rect.y +
      (event.key === "ArrowUp" ? -20 : event.key === "ArrowDown" ? 20 : 0),
    true,
  );
});
window.addEventListener("resize", () => {
  if (avatarPosition) setAvatar(avatarPosition.x, avatarPosition.y);
});
function reply(value) {
  const query = value.trim().slice(0, 500);
  if (!query) return;
  const user = document.createElement("div");
  user.className = "guide-message guide-question";
  const speaker = document.createElement("span");
  speaker.className = "guide-speaker";
  speaker.textContent = "YOU";
  const text = document.createElement("p");
  text.textContent = query;
  user.append(speaker, text);
  log.append(user);
  const answer = guideAnswer(query, knowledge, guideTopic);
  guideTopic = answer.topic;
  const message = document.createElement("div");
  message.className = "guide-message guide-answer";
  const author = document.createElement("span");
  author.className = "guide-speaker";
  author.textContent = "SIRI";
  const title = document.createElement("p");
  title.className = "guide-answer-title";
  title.textContent = answer.title;
  const copy = document.createElement("p");
  copy.className = "guide-answer-copy";
  copy.textContent = answer.answer;
  message.append(author, title, copy);
  const actions = document.createElement("div");
  actions.className = "guide-answer-actions";
  if (answer.project || answer.link) {
    const link = document.createElement("a");
    link.textContent = answer.label + " →";
    link.href = new URL(
      answer.project ? `projects/${answer.project}/` : `#${answer.link}`,
      base,
    ).href;
    if (answer.project) link.dataset.case = answer.project;
    else link.dataset.open = answer.link;
    actions.append(link);
  }
  if (canSpeak) {
    const speak = document.createElement("button");
    speak.type = "button";
    speak.textContent = "Read aloud";
    speak.dataset.guideSpeak = "";
    speak.setAttribute("aria-pressed", "false");
    actions.append(speak);
  }
  message.append(actions);
  log.append(message);
  question.value = "";
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 21) log.firstElementChild.remove();
}
$(".guide-form").addEventListener("submit", (event) => {
  event.preventDefault();
  reply(question.value);
  question.focus();
});
question.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    if (question.value.trim()) reply(question.value);
  }
});
const mic = $("[data-guide-mic]");
const dictation = createDictationController({
  Recognition: SpeechRecognition,
  secure: window.isSecureContext,
  onState(state) {
    mic.disabled = state === "starting";
    mic.setAttribute("aria-pressed", String(state === "listening"));
    const label = state === "listening" ? "Stop voice input" : "Start voice input";
    mic.setAttribute("aria-label", label);
    mic.title = label;
    root.classList.toggle("siri-listening", state === "listening");
    guide.dataset.dictation = state;
  },
  onTranscript(text) { question.value = text; },
  onNotice: voiceNotice,
});
function dictate() {
  stopSpeaking();
  dictation.toggle(question.value);
}
function speakAnswer(button) {
  if (!canSpeak) return;
  if (speakingButton === button) {
    stopSpeaking();
    return;
  }
  stopSpeaking();
  dictation.abort();
  speakingButton = button;
  const message = button.closest(".guide-answer");
  const utterance = new SpeechSynthesisUtterance(
    $(".guide-answer-title", message).textContent +
      ". " +
      $(".guide-answer-copy", message).textContent,
  );
  utterance.voice = preferredVoice(speechSynthesis.getVoices());
  button.dataset.voice = utterance.voice?.name || "Default browser voice";
  utterance.lang = utterance.voice?.lang || "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  currentUtterance = utterance; // Keep a reference while WebKit reads the answer.
  utterance.onstart = () => {
    if (currentUtterance !== utterance) return;
    clearTimeout(speechStartTimer);
    root.classList.add("siri-speaking");
    button.textContent = "Stop reading";
    button.setAttribute("aria-pressed", "true");
  };
  utterance.onend = () => {
    if (currentUtterance === utterance) stopSpeaking();
  };
  utterance.onerror = () => {
    if (currentUtterance === utterance) {
      stopSpeaking();
      voiceNotice(
        "This browser could not read the answer aloud. The text remains available.",
      );
    }
  };
  button.textContent = "Stop reading";
  button.setAttribute("aria-pressed", "true");
  speechSynthesis.resume();
  speechSynthesis.speak(utterance);
  speechStartTimer = setTimeout(() => {
    if (speakingButton === button && !speechSynthesis.speaking) {
      stopSpeaking();
      voiceNotice(
        "Read aloud needs an available browser voice. You can still read the answer here.",
      );
    }
  }, 4000);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    dictation.abort();
    stopSpeaking();
  }
});
document.addEventListener("click", (event) => {
  const target = event.target.closest("button,a");
  if (!target) return;
  if (target.hasAttribute("data-guide-open")) {
    if (target === launcher && suppressClick) {
      suppressClick = false;
      return;
    }
    openGuide(target);
  }
  if (target.hasAttribute("data-guide-close")) closeGuide();
  if (target.hasAttribute("data-guide-question"))
    reply(target.dataset.guideQuestion);
  if (target.hasAttribute("data-guide-mic")) dictate();
  if (target.hasAttribute("data-guide-speak")) speakAnswer(target);
  if (target.hasAttribute("data-guide-clear")) {
    dictation.abort();
    stopSpeaking();
    log.replaceChildren();
    guideTopic = "";
    status("Conversation cleared. Ask a new question to begin.");
    question.focus();
  }
  if (target.hasAttribute("data-look-toggle")) {
    closeGuide(false);
    roomMenu(roomControls.hidden);
  }
  if (target.hasAttribute("data-pan")) {
    const d = target.dataset.pan;
    moveRoom(
      d === "center"
        ? 0
        : pan.x + (d === "left" ? -0.25 : d === "right" ? 0.25 : 0),
      d === "center"
        ? 0
        : pan.y + (d === "up" ? -0.25 : d === "down" ? 0.25 : 0),
      true,
    );
  }
  if (target.hasAttribute("data-room-clear")) setRoomView(!roomActive);
  if (target.hasAttribute("data-room-return")) setRoomView(false);
  if (target.hasAttribute("data-scroll-top")) {
    const panel = target.closest("[data-window]");
    if (innerHeight <= 540)
      panel.scrollIntoView({
        block: "start",
        behavior: calm() ? "instant" : "smooth",
      });
    else
      $(".spatial-scroll", panel).scrollTo({
        top: 0,
        behavior: calm() ? "instant" : "smooth",
      });
    $(".spatial-scroll", panel).focus({ preventScroll: true });
  }
  if (target.matches(".space-recenter")) {
    moveRoom(0, 0, true);
    resetAvatar();
  }
  if (target.hasAttribute("data-open") || target.hasAttribute("data-case")) {
    if (roomActive) {
      setRoomView(false, false);
      requestAnimationFrame(() =>
        $(".spatial-panel:not([hidden]) .spatial-scroll")?.focus({
          preventScroll: true,
        }),
      );
    }
    roomMenu(false);
    if (target.closest(".guide-panel")) {
      closeGuide(false);
      requestAnimationFrame(() =>
        $(".spatial-panel:not([hidden]) .spatial-scroll")?.focus({
          preventScroll: true,
        }),
      );
    }
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!guide.hidden) {
    event.preventDefault();
    closeGuide();
  } else if (!roomControls.hidden) {
    event.preventDefault();
    roomMenu(false, true);
  } else if (roomActive) {
    event.preventDefault();
    setRoomView(false);
  }
});

new MutationObserver(() => {
  if (roomActive) setRoomView(false, false);
  if (!guide.hidden) {
    closeGuide(false);
    requestAnimationFrame(() =>
      $(".spatial-panel:not([hidden]) .spatial-scroll")?.focus({
        preventScroll: true,
      }),
    );
  }
}).observe(root, { attributes: true, attributeFilter: ["data-view"] });

guide.addEventListener("click", (event) => {
  if (event.target !== guide) return;
  const r = guide.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    closeGuide();
});

initOrbit();
