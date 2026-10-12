import { projects, profile, faq } from "./content.mjs";
import { resume } from "./resume.mjs";
import { icon } from "./site.mjs";

const thirdPerson = (text) =>
  text
    .replace(/\bI connect\b/g, "She connects")
    .replace(/\bI\b/g, "Isha")
    .replace(/\bWe\b/g, "The team")
    .replace(/\bwe\b/g, "the team")
    .replace(/\bus\b/g, "the team")
    .replace(/\bour\b/g, "their");
export function guideKnowledge() {
  const entries = [
    {
      id: "siri",
      topic: "siri",
      tags: ["siri", "bot", "guide", "dictate", "read aloud", "voice input"],
      title: "Your little portfolio companion",
      answer:
        "I’m Siri, a browser-only guide with built-in answers from Isha’s portfolio and resume. Ask about her projects, research, experience, skills, or getting in touch. I can link you to the relevant window. Dictate fills the question field for you to review, and Read aloud uses an available browser voice. I’m not a generative AI service.",
      link: "work",
      label: "Explore the portfolio",
    },
    {
      id: "play",
      topic: "play",
      tags: ["game", "play", "pairs", "memory", "cards"],
      title: "A little room to play",
      answer:
        "Spatial Pairs is an untimed memory game: uncover twelve cards and find six matching shapes. It is a playful experiment in attention and noticing patterns. Mismatched cards stay visible until you choose another card, so there is no rush. Tap, press Enter, or use arrow keys to play.",
      link: "playground",
      label: "Play Spatial Pairs",
    },
    {
      id: "room",
      topic: "room",
      tags: [
        "pan",
        "room",
        "look around",
        "background",
        "environment",
        "battery",
      ],
      title: "Look beyond the window",
      answer:
        "Use Look around in the status bar, then Clear view to explore the wider room. Drag, use arrow keys, or tap the direction buttons. The dock opens your portfolio windows again. The status bar shows your local time; battery is a device reading when the browser supports it, and clearly labeled Demo otherwise.",
      link: "home",
      label: "Return to the space",
    },
    {
      id: "intro",
      topic: "intro",
      tags: [
        "who is isha",
        "intro",
        "introduce",
        "overview",
        "designer",
        "hello",
        "hi",
      ],
      title: "Meet Isha",
      answer: thirdPerson(resume.summary),
      link: "about",
      label: "Meet Isha",
    },
    {
      id: "current",
      topic: "geny",
      tags: [
        "current",
        "now",
        "currently",
        "latest",
        "geny",
        "voice",
        "conversational",
        "ai",
      ],
      title: "Current work",
      answer: `Isha’s resume lists Product Designer at Geny Labs from Oct 2025 to Present, on the founding team for an AI voice assistant. ${resume.experience[0].points.join(" ")}`,
      link: "resume",
      label: "Read her resume",
    },
    {
      id: "career",
      topic: "career",
      tags: [
        "experience",
        "career",
        "employment",
        "employers",
        "jobs",
        "worked",
        "background",
        "years",
      ],
      title: "Career",
      answer: resume.experience
        .map((j) => `${j.role} at ${j.company} (${j.dates}).`)
        .join("\n\n"),
      link: "resume",
      label: "Explore experience",
    },
    {
      id: "resume",
      topic: "career",
      tags: ["resume", "resume", "cv", "credentials"],
      title: "Resume",
      answer: `${thirdPerson(resume.summary)}\n\nHer experience spans Geny Labs, Tindoori Labs, BMW Group, Walmart–Myntra, and Reliance. You can read roles, impact, education, and skills inside the resume window.`,
      link: "resume",
      label: "Open resume",
    },
    {
      id: "education",
      topic: "education",
      tags: [
        "education",
        "study",
        "studied",
        "college",
        "university",
        "degree",
        "scad",
        "nift",
        "school",
        "masters",
      ],
      title: "Education",
      answer: resume.education
        .map(([degree, school, dates]) => `${degree} — ${school}, ${dates}.`)
        .join("\n\n"),
      link: "resume",
      label: "Read education",
    },
    {
      id: "skills",
      topic: "skills",
      tags: [
        "skills",
        "tool",
        "tools",
        "figma",
        "software",
        "programming",
        "code",
        "coding",
        "react",
        "swiftui",
        "typescript",
        "javascript",
        "html",
        "css",
        "technical",
      ],
      title: "Skills & toolkit",
      answer: resume.skills
        .map(([title, copy]) => `${title}: ${copy}`)
        .join("\n\n"),
      link: "resume",
      label: "Explore her toolkit",
    },
    {
      id: "awards",
      topic: "awards",
      tags: ["awards", "award", "indigo", "ida", "honorable", "recognition"],
      title: "Recognition",
      answer:
        "The resume lists 3 Silver and 2 Bronze Indigo Design Awards and an International Design Awards honorable mention. The Bloom case study also lists Indigo Design Award Winner 2025 and IDA Honorable Mention 2024.",
      project: "bloom",
      label: "Explore Bloom",
    },
    {
      id: "about",
      topic: "about",
      tags: [
        "about",
        "human",
        "personal",
        "hobbies",
        "hobby",
        "travel",
        "travels",
        "personality",
        "fun",
        "outside",
        "coffee",
        "running",
      ],
      title: "The human behind the work",
      answer:
        "Isha is curious by default and reflective by habit. Solo travel taught her to navigate uncertainty, make trade-offs, and connect across cultures. She starts design with conversations and observations, looking for the human patterns beneath an interface. Her playground notes mention notebooks, iced lattes, and long runs.",
      link: "about",
      label: "Read about Isha",
    },
    {
      id: "approach",
      topic: "about",
      tags: [
        "approach",
        "process",
        "method",
        "methods",
        "philosophy",
        "thinking",
        "systems",
        "design",
        "research",
      ],
      title: "Design approach",
      answer:
        "Isha connects research, systems thinking, and interaction design. She uses conversations, observations, and synthesis to understand why people behave as they do, then balances product value with platform and business constraints. BMW, Chemistry, and Bloom each show that approach in a different context.",
      link: "work",
      label: "See the projects",
    },
    {
      id: "projects",
      topic: "projects",
      tags: [
        "projects",
        "portfolio",
        "work",
        "case",
        "cases",
        "case studies",
        "recommend",
        "recommendation",
        "best",
        "selected",
      ],
      title: "Selected work",
      answer: projects.map((p) => `${p.name}: ${p.summary}`).join("\n\n"),
      link: "work",
      label: "Open selected work",
    },
    {
      id: "contact",
      topic: "contact",
      tags: [
        "contact",
        "email",
        "reach",
        "hire",
        "hiring",
        "available",
        "availability",
        "opportunities",
        "collaborate",
        "collaboration",
        "connect",
        "recruiter",
      ],
      title: "Get in touch",
      answer: `The portfolio says Isha is open to product design and UX opportunities. Email her at ${profile.email}, or use the LinkedIn link in Contact. For details that aren’t published here, Isha is the right person to ask.`,
      link: "contact",
      label: "Open contact",
    },
  ];
  for (const p of projects) {
    const tags =
      p.slug === "bmw"
        ? ["bmw", "vision pro", "apple", "spatial", "automotive", "car"]
        : p.slug === "chemistry"
          ? [
              "chemistry",
              "myntra",
              "fashion",
              "shopping",
              "ecommerce",
              "e-commerce",
            ]
          : ["bloom", "sleep", "device", "diffuser", "bedside", "sensory"];
    entries.push({
      id: p.slug,
      topic: p.slug,
      tags,
      title: p.name,
      answer: `${p.summary}\n\n${p.overview}`,
      project: p.slug,
      label: `Open ${p.name} studio`,
    });
    entries.push({
      id: p.slug + "-role",
      topic: p.slug,
      tags: [
        ...tags,
        "role",
        "contribution",
        "responsibilities",
        "contributed",
        "did",
        "team",
        "timeline",
      ],
      kind: "role",
      title: `Isha’s role in ${p.name}`,
      answer: `${p.role}. ${p.timeline}. Team: ${p.team}.\n\n${thirdPerson(p.roleText)}`,
      project: p.slug,
      label: "Read the full case study",
    });
    entries.push({
      id: p.slug + "-results",
      topic: p.slug,
      tags: [
        ...tags,
        "results",
        "outcomes",
        "metrics",
        "impact",
        "measured",
        "numbers",
        "success",
      ],
      kind: "results",
      title: `${p.name}: results & findings`,
      answer: `${p.metrics.map(([n, label]) => `${n} ${label}`).join("; ")}.\n\n${p.metricsLabel || "These are reported project outcomes. The original project does not publish a complete measurement methodology."}`,
      project: p.slug,
      label: "Read the reported findings",
    });
    const research = p.sections.filter((s) =>
      /research|understand/i.test(s.label),
    );
    entries.push({
      id: p.slug + "-research",
      topic: p.slug,
      tags: [
        ...tags,
        "research",
        "interviews",
        "interview",
        "testing",
        "usability",
        "users",
        "insights",
      ],
      kind: "research",
      title: `Research behind ${p.name}`,
      answer: research.length
        ? research.map((s) => `${s.title}\n${thirdPerson(s.text)}`).join("\n\n")
        : thirdPerson(p.roleText),
      project: p.slug,
      label: "Explore the process",
    });
  }
  for (const p of projects) {
    const sectionText = (section) =>
      `${section.title}\n${thirdPerson(section.text)}${section.points ? "\n" + section.points.map(([t, d]) => `${t}: ${thirdPerson(d)}`).join("\n") : ""}`;
    const select = (pattern) =>
      p.sections
        .filter((section) => pattern.test(section.label))
        .map(sectionText)
        .join("\n\n");
    for (const [kind, title, words, copy] of [
      ["tools", "Tools & platform", ["tools", "software", "figma"], p.tools],
      [
        "design",
        "The experience",
        [
          "design",
          "solution",
          "concept",
          "features",
          "interface",
          "device",
          "app",
        ],
        select(/design|concept|product|interface|experience/i) || p.overview,
      ],
      [
        "constraints",
        "Constraints & trade-offs",
        ["constraints", "limitations", "challenges", "trade-offs"],
        select(/constraints|trade.off/i) || thirdPerson(p.reflection),
      ],
      [
        "reflection",
        "What stayed with Isha",
        ["reflection", "lessons", "learned"],
        thirdPerson(p.reflection),
      ],
      [
        "process",
        "The full process",
        ["process", "stages", "steps"],
        p.sections.map(sectionText).join("\n\n"),
      ],
    ])
      entries.push({
        id: p.slug + "-" + kind,
        topic: p.slug,
        kind,
        tags: words,
        title: `${p.name}: ${title}`,
        answer: copy,
        project: p.slug,
        label: "Read the full case study",
      });
  }
  for (const job of resume.experience.slice(1))
    entries.push({
      id: "job-" + job.company,
      topic: job.project || "career",
      kind: "job",
      tags: [
        ...job.company.toLowerCase().split(/\s|—/).filter(Boolean),
        "job",
        "employment",
        "worked",
        "career",
      ],
      title: job.company,
      answer: `${job.role}, ${job.dates}. ${job.domain}.\n\n${job.points.join("\n\n")}`,
      link: "resume",
      label: "Read career details",
    });
  entries.push({
    id: "nda",
    topic: "chemistry",
    tags: [
      "nda",
      "confidential",
      "confidentiality",
      "protected",
      "private",
      "full process",
    ],
    title: "Public work & confidentiality",
    answer:
      "The Chemistry project shares selected public work. The full process is protected by an NDA. This guide only uses the public portfolio and the linked resume, and cannot share confidential material.",
    project: "chemistry",
    label: "Read the public case study",
  });
  for (const [i, [q, a]] of faq.entries())
    entries.push({
      id: "faq-" + i,
      topic: "about",
      tags: q
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 4),
      title: q,
      answer: `From Isha’s published portfolio: “${a}”`,
      link: "about",
      label: "Read the portfolio FAQ",
    });
  return {
    name: "Isha",
    entries,
    topics: ["bmw", "chemistry", "bloom"],
    privateTopics: [
      "salary",
      "visa",
      "citizenship",
      "address",
      "phone number",
      "relationship",
      "religion",
      "medical",
      "health history",
      "age",
      "date of birth",
    ],
  };
}

const batterySvg =
  '<svg viewBox="0 0 28 16" class="hud-battery-icon" aria-hidden="true"><rect x="1" y="2" width="22" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M25 6v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect data-battery-fill x="3" y="4" width="17" height="8" rx="1.5" fill="currentColor"/></svg>';
export function worldStatus() {
  return `<div class="world-status"><div class="world-hud"><span class="space-availability"><span class="status-dot" aria-hidden="true"></span> Open to opportunities</span><span class="hud-spatial">${icon("layers")}<span>Spatial space</span></span><time data-world-clock aria-label="Your local time">Local time</time><span class="hud-battery" title="Illustrative battery when device status is unavailable">${batterySvg}<span data-battery-label>Demo</span><span class="sr-only" data-battery-description>Illustrative battery, not a device reading</span></span><button type="button" data-look-toggle aria-expanded="false" aria-controls="room-controls">${icon("compass")}<span>Look around</span></button><button type="button" data-guide-open class="guide-inline" aria-expanded="false" aria-controls="guide-panel">${icon("spark")}<span>Siri</span></button></div><div class="room-controls" id="room-controls" hidden><p>Look around your space</p><div class="room-direction-buttons" role="group" aria-label="Room direction">${["left", "up", "down", "right"].map((d) => `<button type="button" data-pan="${d}" aria-label="Look ${d}"><span class="move-${d}" aria-hidden="true">${icon("arrow")}</span></button>`).join("")}<button type="button" data-pan="center">Center</button></div><div class="room-options"><button type="button" data-room-clear aria-pressed="false">Clear view</button><button type="button" data-ambient-motion aria-pressed="false">${icon("pause")}<span>Pause ambient motion</span></button></div><p class="room-help">Clear view, then drag the room or use arrow keys. Direction buttons work with touch too.</p></div></div>`;
}
export function roomExplorer() {
  return `<section class="room-explorer" hidden role="region" aria-label="Explore the room" tabindex="0" aria-describedby="room-explorer-help"><div class="room-explorer-note"><p class="space-eyebrow">A LITTLE MORE ROOM</p><h2>Look beyond the window.</h2><p id="room-explorer-help">Drag to look around, or use the arrow keys and direction buttons. Your portfolio windows are one click away.</p><button type="button" data-room-return>Return to portfolio ${icon("arrow")}</button></div></section><p class="sr-only" role="status" aria-live="polite" data-room-status></p>`;
}
export function spatialGame() {
  return `<section class="spatial-game" aria-label="Spatial Pairs game"><div class="game-intro"><div><p class="space-eyebrow">PLAY / A LITTLE FOCUS</p><h2>Spatial Pairs</h2><p>Six pairs. Find your constellation.</p></div><div class="game-orbit-mark" aria-hidden="true">${icon("layers")}</div></div><div class="game-toolbar"><div class="game-stats"><span><strong data-game-pairs>0 / 6</strong> pairs found</span><span><strong data-game-moves>0</strong> moves</span></div><button type="button" data-game-reset>New game ${icon("refresh")}</button></div><div class="game-board" role="group" aria-label="Twelve memory cards" aria-describedby="game-instructions">${Array.from({ length: 12 }, (_, i) => `<button type="button" class="game-card" disabled aria-label="Card ${i + 1}, face down"><span aria-hidden="true">${icon("spark")}</span></button>`).join("")}</div><p class="game-feedback" data-game-feedback role="status" aria-live="polite" aria-atomic="true">Choose two cards to begin.</p><p class="game-instructions" id="game-instructions">Tap or press Enter to turn a card. Tab or arrow keys move between cards. There’s no timer—take your time.</p><noscript><p>Enable JavaScript to play Spatial Pairs.</p></noscript></section>`;
}

export function guideWidget(base) {
  const knowledge = JSON.stringify(guideKnowledge()).replaceAll("<", "\\u003c");
  return `<aside class="portfolio-guide" aria-label="Siri portfolio guide"><button type="button" class="guide-launch" data-guide-open aria-controls="guide-panel" aria-expanded="false" aria-describedby="guide-move-help"><span class="siri-body" aria-hidden="true"><span class="siri-ring"></span><span class="siri-ring-front"></span><span class="siri-shell-line"></span><span class="siri-visor"><i></i><i></i></span><span class="siri-glint"></span></span><span class="guide-launch-label">Ask Siri</span></button><p class="sr-only" id="guide-move-help">Open with Enter. Drag Siri to move, or use arrow keys while this button is focused.</p><dialog class="guide-panel" id="guide-panel" hidden role="dialog" aria-modal="true" aria-labelledby="guide-title"><div class="guide-header"><div class="guide-mini" aria-hidden="true"><span class="siri-visor"><i></i><i></i></span></div><div><h2 id="guide-title">Siri</h2><p>YOUR PORTFOLIO COMPANION</p></div><button type="button" data-guide-close aria-label="Close Siri guide">${icon("close")}</button></div><div class="guide-tools"><button type="button" data-guide-clear>Clear chat</button></div><div class="guide-conversation" role="log" aria-label="Conversation with Siri" aria-live="polite" aria-relevant="additions text" tabindex="0"><div class="guide-message guide-answer"><span class="guide-speaker">SIRI</span><p>Hi, I’m Siri. Ask me about Isha’s work, research, experience, or the human behind it.</p><p class="guide-boundary">I use built-in answers from this portfolio and resume.</p></div></div><div class="guide-suggestions" role="group" aria-label="Suggested questions"><button type="button" data-guide-question="What did Isha do at BMW?">Would you like to explore BMW &amp; Vision Pro? ${icon("arrow")}</button><button type="button" data-guide-question="What is Isha working on now?">Would you like to know about her current role? ${icon("arrow")}</button><button type="button" data-guide-question="Tell me about Isha">Would you like to meet Isha? ${icon("arrow")}</button></div><form class="guide-form"><label for="guide-question">Your question</label><textarea id="guide-question" name="question" rows="2" maxlength="500" placeholder="What’s her research approach?" required></textarea><div class="guide-form-actions"><button type="button" data-guide-mic aria-pressed="false" aria-label="Start voice input" title="Start voice input">${icon("mic")}</button><button type="submit" aria-label="Send question" title="Send question">${icon("send")}</button></div></form><p class="guide-voice-note" data-guide-voice-note>Voice input uses your browser’s speech service and microphone permission. Review the text before sending.</p><p class="sr-only" data-guide-status role="status" aria-live="polite" aria-atomic="true"></p></dialog><script type="application/json" id="guide-knowledge">${knowledge}</script></aside>`;
}
