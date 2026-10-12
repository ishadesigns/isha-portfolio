import { guideAnswer } from "./guide-engine.js";

const root = document.documentElement;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const calm = () => motionQuery.matches || root.dataset.userMotion === "off";
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
  navigator
    .getBattery()
    .then((battery) => {
      const update = () => {
        $("[data-battery-label]").textContent =
          `${Math.round(battery.level * 100)}%`;
        $("[data-battery-fill]").setAttribute(
          "width",
          String(17 * battery.level),
        );
        $("[data-battery-description]").textContent =
          `Device battery ${Math.round(battery.level * 100)} percent${battery.charging ? ", charging" : ""}`;
        $(".hud-battery").title = battery.charging
          ? "Device battery, charging"
          : "Device battery";
      };
      update();
      battery.addEventListener("levelchange", update);
      battery.addEventListener("chargingchange", update);
    })
    .catch(() => {});
try {
  if (localStorage.getItem("isha-ambient-motion") === "off")
    root.dataset.userMotion = "off";
} catch {}
function updateMotion() {
  root.classList.toggle("world-quiet", calm());
  $("[data-ambient-motion]").setAttribute(
    "aria-pressed",
    String(root.dataset.userMotion === "off"),
  );
  $("[data-ambient-motion] span").textContent =
    root.dataset.userMotion === "off"
      ? "Resume ambient motion"
      : "Pause ambient motion";
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
explorer.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || event.target.closest("button,a")) return;
  event.preventDefault();
  roomDrag = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    origin: { ...pan },
  };
  explorer.setPointerCapture(event.pointerId);
  root.classList.add("room-dragging");
});
explorer.addEventListener("pointermove", (event) => {
  if (!roomDrag || roomDrag.id !== event.pointerId) return;
  moveRoom(
    roomDrag.origin.x - (event.clientX - roomDrag.x) / (innerWidth * 0.35),
    roomDrag.origin.y - (event.clientY - roomDrag.y) / (innerHeight * 0.35),
  );
});
function stopRoomDrag() {
  roomDrag = null;
  root.classList.remove("room-dragging");
}
explorer.addEventListener("pointerup", stopRoomDrag);
explorer.addEventListener("pointercancel", stopRoomDrag);
explorer.addEventListener("lostpointercapture", stopRoomDrag);
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

// Untimed memory game. Mismatches stay visible until the player chooses another card.
const board = $(".game-board");
const shapes = [
  ["Orbit", "◉"],
  ["Bloom", "✿"],
  ["Spark", "✦"],
  ["Wave", "≋"],
  ["Moon", "☾"],
  ["Diamond", "◇"],
];
let deck = [],
  selection = [],
  matched = new Set(),
  moves = 0;
function newGame() {
  deck = [...shapes, ...shapes].map(([name, symbol], id) => ({
    name,
    symbol,
    id,
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  selection = [];
  matched = new Set();
  moves = 0;
  board.replaceChildren();
  deck.forEach((card, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "game-card";
    button.dataset.gameCard = String(i);
    button.setAttribute("aria-label", `Card ${i + 1}, face down`);
    const inner = document.createElement("span");
    inner.className = "game-card-inner";
    inner.setAttribute("aria-hidden", "true");
    const front = document.createElement("span");
    front.className = "game-card-front";
    front.innerHTML =
      '<span class="game-card-orbit">✧</span><span class="game-card-number">' +
      String(i + 1).padStart(2, "0") +
      "</span>";
    const back = document.createElement("span");
    back.className = "game-card-back";
    back.dataset.shape = String(shapes.findIndex((s) => s[0] === card.name));
    const glyph = document.createElement("span");
    glyph.className = "game-card-symbol";
    glyph.textContent = card.symbol;
    const name = document.createElement("span");
    name.className = "game-card-name";
    name.textContent = card.name;
    back.append(glyph, name);
    inner.append(front, back);
    button.append(inner);
    board.append(button);
  });
  updateGame("Choose two cards to begin.");
}
function updateGame(message) {
  $("[data-game-moves]").textContent = String(moves);
  $("[data-game-pairs]").textContent = `${matched.size / 2} / 6`;
  $("[data-game-feedback]").textContent = message;
}
function flipCard(index) {
  if (matched.has(index) || selection.includes(index)) return;
  if (selection.length === 2) {
    selection.forEach((i) => {
      const b = $(`[data-game-card="${i}"]`);
      b.classList.remove("is-flipped");
      b.setAttribute("aria-label", `Card ${i + 1}, face down`);
    });
    selection = [];
  }
  const button = $(`[data-game-card="${index}"]`);
  button.classList.add("is-flipped");
  button.setAttribute("aria-label", `Card ${index + 1}, ${deck[index].name}`);
  selection.push(index);
  if (selection.length === 1)
    return updateGame(
      `Card ${index + 1}: ${deck[index].name}. Choose a second card.`,
    );
  moves++;
  const [a, b] = selection;
  if (deck[a].name === deck[b].name) {
    [a, b].forEach((i) => {
      matched.add(i);
      const card = $(`[data-game-card="${i}"]`);
      card.classList.add("is-matched");
      card.setAttribute(
        "aria-label",
        `Card ${i + 1}, ${deck[i].name}, matched`,
      );
      card.setAttribute("aria-disabled", "true");
    });
    selection = [];
    updateGame(
      matched.size === 12
        ? `A perfect little constellation. All six pairs found in ${moves} moves! Choose New game to play again.`
        : `${deck[a].name} pair found. ${matched.size / 2} of six pairs matched.`,
    );
    board.classList.toggle("game-won", matched.size === 12);
  } else
    updateGame(
      `${deck[a].name} and ${deck[b].name}: different shapes. Choose another card to turn these back over.`,
    );
}
board.addEventListener("click", (event) => {
  const button = event.target.closest("[data-game-card]");
  if (button) flipCard(Number(button.dataset.gameCard));
});
board.addEventListener("keydown", (event) => {
  if (
    !event.key.startsWith("Arrow") ||
    !event.target.matches("[data-game-card]")
  )
    return;
  event.preventDefault();
  const index = Number(event.target.dataset.gameCard),
    columns = getComputedStyle(board).gridTemplateColumns.split(" ").length;
  const next = clamp(
    index +
      (event.key === "ArrowLeft"
        ? -1
        : event.key === "ArrowRight"
          ? 1
          : event.key === "ArrowUp"
            ? -columns
            : columns),
    0,
    11,
  );
  $(`[data-game-card="${next}"]`).focus();
});
newGame();

// Lumi: source-backed answers, optional browser voice, and a movable character.
const guide = $("#guide-panel"),
  launcher = $(".guide-launch"),
  log = $(".guide-conversation"),
  question = $("#guide-question");
let guideTopic = "",
  avatarDrag = null,
  suppressClick = false,
  avatarPosition = null,
  recognition = null,
  dictating = false,
  speakingButton = null,
  guidePaused = false;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const canSpeak = !!window.speechSynthesis && !!window.SpeechSynthesisUtterance;
const status = (text) => {
  $("[data-guide-status]").textContent = text;
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
  root.classList.remove("lumi-speaking");
}
function closeGuide(restore = true) {
  if (guide.hidden) return;
  guide.hidden = true;
  $$("[data-guide-open]").forEach((b) =>
    b.setAttribute("aria-expanded", "false"),
  );
  recognition?.abort();
  stopSpeaking();
  if (restore)
    (innerWidth <= 780 ? $("[data-guide-open].guide-inline") : launcher).focus({
      preventScroll: true,
    });
}
function openGuide() {
  if (!guide.hidden) return closeGuide();
  if (roomActive) setRoomView(false);
  roomMenu(false);
  guide.hidden = false;
  $$("[data-guide-open]").forEach((b) =>
    b.setAttribute("aria-expanded", "true"),
  );
  question.focus({ preventScroll: true });
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
  if (announce) status("Lumi moved.");
}
function placeAvatar(corner) {
  const rect = launcher.getBoundingClientRect(),
    safeTop = parseFloat(root.style.getPropertyValue("--space-top")) || 100;
  setAvatar(
    corner.endsWith("left") ? 18 : innerWidth - rect.width - 18,
    corner.startsWith("top") ? safeTop + 12 : innerHeight - rect.height - 18,
    true,
  );
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
    root.classList.add("lumi-dragging");
    setAvatar(avatarDrag.origin.x + dx, avatarDrag.origin.y + dy);
  }
});
function stopAvatarDrag() {
  suppressClick = !!avatarDrag?.moved;
  avatarDrag = null;
  root.classList.remove("lumi-dragging");
}
launcher.addEventListener("pointerup", stopAvatarDrag);
launcher.addEventListener("pointercancel", stopAvatarDrag);
launcher.addEventListener("lostpointercapture", () => {
  avatarDrag = null;
  root.classList.remove("lumi-dragging");
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
  author.textContent = "LUMI";
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
  question.focus({ preventScroll: true });
});
question.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    if (question.value.trim()) reply(question.value);
  }
});
function dictate() {
  if (!SpeechRecognition) return;
  if (dictating) {
    recognition?.stop();
    return;
  }
  stopSpeaking();
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onstart = () => {
    dictating = true;
    $("[data-guide-mic]").setAttribute("aria-pressed", "true");
    $("[data-guide-mic] span").textContent = "Stop";
    root.classList.add("lumi-listening");
    status("Listening. Your words will appear in the question field.");
  };
  recognition.onresult = (event) => {
    question.value = [...event.results]
      .map((result) => result[0].transcript)
      .join(" ")
      .slice(0, 500);
  };
  recognition.onerror = (event) => {
    status(
      event.error === "not-allowed"
        ? "Microphone permission was not granted. You can still type your question."
        : event.error === "no-speech"
          ? "No speech was detected. Try again or type your question."
          : "Voice input is unavailable right now. You can still type your question.",
    );
  };
  recognition.onend = () => {
    dictating = false;
    $("[data-guide-mic]").setAttribute("aria-pressed", "false");
    $("[data-guide-mic] span").textContent = "Dictate";
    root.classList.remove("lumi-listening");
    if (!guide.hidden) question.focus({ preventScroll: true });
  };
  try {
    recognition.start();
  } catch {
    status("Voice input could not start. Type a question instead.");
  }
}
function speakAnswer(button) {
  if (!canSpeak) return;
  if (speakingButton === button) {
    stopSpeaking();
    return;
  }
  stopSpeaking();
  recognition?.abort();
  speakingButton = button;
  const message = button.closest(".guide-answer");
  const utterance = new SpeechSynthesisUtterance(
    $(".guide-answer-title", message).textContent +
      ". " +
      $(".guide-answer-copy", message).textContent,
  );
  const voices = speechSynthesis.getVoices();
  utterance.voice =
    voices.find((v) => v.localService && /^en/.test(v.lang)) ||
    voices.find((v) => /^en/.test(v.lang)) ||
    null;
  utterance.rate = 0.98;
  utterance.onstart = () => {
    root.classList.add("lumi-speaking");
    button.textContent = "Stop reading";
    button.setAttribute("aria-pressed", "true");
  };
  utterance.onend = () => {
    if (speakingButton === button) stopSpeaking();
  };
  utterance.onerror = () => {
    if (speakingButton === button) {
      stopSpeaking();
      status(
        "This browser could not read the answer aloud. The text remains available.",
      );
    }
  };
  speechSynthesis.speak(utterance);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    recognition?.abort();
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
    openGuide();
  }
  if (target.hasAttribute("data-guide-close")) closeGuide();
  if (target.hasAttribute("data-guide-question"))
    reply(target.dataset.guideQuestion);
  if (target.hasAttribute("data-guide-mic")) dictate();
  if (target.hasAttribute("data-guide-speak")) speakAnswer(target);
  if (target.hasAttribute("data-guide-clear")) {
    recognition?.abort();
    stopSpeaking();
    log.replaceChildren();
    guideTopic = "";
    status("Conversation cleared. Ask a new question to begin.");
    question.focus();
  }
  if (target.hasAttribute("data-guide-place-toggle")) {
    const placement = $("#guide-placement");
    placement.hidden = !placement.hidden;
    target.setAttribute("aria-expanded", String(!placement.hidden));
  }
  if (target.hasAttribute("data-guide-place"))
    placeAvatar(target.dataset.guidePlace);
  if (target.hasAttribute("data-guide-motion")) {
    guidePaused = !guidePaused;
    root.classList.toggle("lumi-quiet", guidePaused);
    target.setAttribute("aria-pressed", String(guidePaused));
    target.textContent = guidePaused ? "Resume floating" : "Pause floating";
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
  if (target.hasAttribute("data-ambient-motion")) {
    root.dataset.userMotion = root.dataset.userMotion === "off" ? "on" : "off";
    try {
      localStorage.setItem("isha-ambient-motion", root.dataset.userMotion);
    } catch {}
    updateMotion();
  }
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
  if (target.hasAttribute("data-game-reset")) {
    board.classList.remove("game-won");
    newGame();
  }
  if (target.matches(".space-recenter")) {
    moveRoom(0, 0, true);
    placeAvatar("bottom-right");
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
    if (target.closest(".guide-panel")) closeGuide(false);
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
