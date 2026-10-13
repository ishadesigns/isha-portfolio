// Deterministic retrieval from published content. No model, secret, or remote request.
const normalize = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\bb m w\b/g, "bmw")
    .trim();
const contains = (text, phrase) =>
  ` ${text} `.includes(` ${normalize(phrase)} `);
export function guideAnswer(question, knowledge, previousTopic = "") {
  const q = normalize(question).slice(0, 500);
  const unknown = {
    topic: "",
    title: "A little beyond what I know",
    answer:
      "I don’t have published information about that. I can help with Isha’s projects, research, resume, or contact details. For anything personal or unpublished, please ask Isha directly.",
    link: "contact",
    label: "Contact Isha",
  };
  if (!q)
    return {
      ...unknown,
      title: "Where shall we start?",
      answer:
        "Ask about BMW, Chemistry, Bloom, Isha’s experience, education, skills, or how to get in touch.",
      link: "work",
      label: "Explore her work",
    };
  if (
    /\b(luke|bot|chatbot|who are you|what can you do|are you ai|dictate|read aloud|voice input)\b/.test(
      q,
    )
  )
    return knowledge.entries.find((e) => e.id === "luke");
  if (knowledge.privateTopics.some((word) => contains(q, word))) return unknown;
  if (/\b(awards?|indigo|ida|recognition)\b/.test(q))
    return knowledge.entries.find((e) => e.id === "awards");
  const explicit = knowledge.topics.filter((topic) => {
    const entry = knowledge.entries.find((e) => e.id === topic);
    return entry.tags.some((tag) => contains(q, tag));
  });
  const isCurrent =
    /\bgeny\b/.test(q) ||
    (/\b(now|current|currently|latest)\b/.test(q) &&
      /\b(role|work|working|job|experience|isha|she|her)\b/.test(q));
  if (!explicit.length && isCurrent)
    return knowledge.entries.find((e) => e.id === "current");
  const newDomain =
    /\b(education|study|studied|college|skills|tools|software|resume|cv|career|contact|email|geny|tindoori|reliance|awards|hobbies|travel|friends|sneakers|interests)\b/.test(
      q,
    );
  let kind =
    /\b(results?|outcomes?|metrics?|impact|numbers|success|measured)\b/.test(q)
      ? "results"
      : /\b(research|interviews?|testing|usability|insights)\b/.test(q)
        ? "research"
        : /\b(role|contribution|responsibilities|contributed|did|team|timeline)\b/.test(
              q,
            )
          ? "role"
          : "";
  if (!kind)
    kind = /\b(tools?|software|figma)\b/.test(q)
      ? "tools"
      : /\b(constraints?|limitations?|challenges|trade offs?|feasibility)\b/.test(
            q,
          )
        ? "constraints"
        : /\b(reflections?|lessons?|learned)\b/.test(q)
          ? "reflection"
          : /\b(process|stages|steps)\b/.test(q)
            ? "process"
            : /\b(design|designed|solution|concept|prototype|features|interface|device|app|built|redesign)\b/.test(
                  q,
                )
              ? "design"
              : "";
  if (/\b(nda|confidential|confidentiality|protected)\b/.test(q))
    return knowledge.entries.find((e) => e.id === "nda");
  let topic =
    explicit[0] ||
    (kind && !newDomain && knowledge.topics.includes(previousTopic)
      ? previousTopic
      : "");
  if (topic) {
    const selected = explicit.length > 1 ? explicit : [topic];
    const answers = selected.map(
      (t) =>
        knowledge.entries.find((e) => e.id === t + (kind ? "-" + kind : "")) ||
        knowledge.entries.find((e) => e.id === t),
    );
    if (answers.length > 1)
      return {
        topic: selected[0],
        title: "Across her projects",
        answer: answers.map((e) => `${e.title}\n${e.answer}`).join("\n\n"),
        link: "work",
        label: "Compare the projects",
      };
    return { ...answers[0] };
  }

  if (/\b(who is|introduce|hello|hi)\b/.test(q))
    return knowledge.entries.find((e) => e.id === "intro");
  if (
    /\b(tell me about isha|about her|hobbies|travel|personal|human)\b/.test(q)
  )
    return knowledge.entries.find((e) => e.id === "about");
  const stop = new Set([
    "isha",
    "her",
    "she",
    "what",
    "about",
    "does",
    "with",
    "have",
    "that",
    "this",
    "tell",
    "more",
    "please",
    "would",
    "could",
    "you",
    "and",
    "the",
    "for",
    "how",
    "who",
    "can",
    "me",
    "is",
    "a",
    "do",
    "to",
    "of",
    "in",
    "has",
  ]);
  const tokens = q
    .split(" ")
    .filter((word) => !stop.has(word) && word.length > 1);
  const ranked = knowledge.entries
    .filter(
      (e) =>
        (!knowledge.topics.includes(e.topic) || e.kind === "job") &&
        (e.id !== "current" || isCurrent),
    )
    .map((entry) => ({
      entry,
      score:
        entry.tags.reduce(
          (score, tag) =>
            score +
            (contains(q, tag) ? (normalize(tag).includes(" ") ? 4 : 2) : 0),
          0,
        ) +
        tokens.filter((t) => normalize(entry.title).split(" ").includes(t))
          .length,
    }))
    .sort((a, b) => b.score - a.score);
  if (ranked[0]?.score >= 2) return { ...ranked[0].entry };
  if (/\b(more|that|it|this)\b/.test(q) && previousTopic)
    return {
      ...(knowledge.entries.find((e) => e.topic === previousTopic) || unknown),
    };
  return unknown;
}
