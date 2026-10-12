import { profile } from "./content.mjs";

// Transcribed from the resume linked by the original homepage; see content-sources.md.
export const resume = {
  summary:
    "Product & UX designer working across conversational AI, spatial computing, and retail. I connect research, systems thinking, and interaction design to make complex experiences feel intuitive.",
  experience: [
    {
      company: "Geny Labs",
      role: "Product Designer",
      domain: "Founding team · AI voice assistant",
      dates: "Oct 2025 — Present",
      points: [
        "Led end-to-end ethnographic UX research for an AI voice assistant supporting immigrant-owned service businesses, drawing from 18+ contextual interviews and 10+ hours of observation.",
        "Synthesized 100+ qualitative data points into 5 key insights and 3 product opportunities. Captured 6 baseline operational metrics: missed calls, booking time, daily revenue, no-shows, admin hours, and CSAT.",
      ],
    },
    {
      company: "Tindoori Labs",
      role: "UX Designer",
      domain: "Founding team · AI / EdTech",
      dates: "May 2025 — Oct 2025",
      points: [
        "Increased signup conversion by 18% through an A/B test-led landing page redesign with scalable typography, iconography, and motion in Figma.",
        "Led onboarding, personalization, and gamification UX as founding designer, improving onboarding completion.",
        "Built a unified design system with reusable components and tokens, reducing design rework by 33% and accelerating design-to-development cycles across mobile and web.",
      ],
    },
    {
      company: "BMW Group",
      role: "UX Designer",
      domain: "Spatial computing · Apple Vision Pro",
      dates: "Mar 2024 — May 2024",
      project: "bmw",
      points: [
        "Designed an immersive VR/AR vehicle configuration experience for Apple Vision Pro, reducing time-to-decision by 25% through clearer comparison across customizations.",
        "Drove a 2× lift in engagement on Vision Pro configuration features through spatial gestures, spatial audio, cockpit interactions, simulated test drives, and sound profiles.",
        "Led 10 usability studies on high-fidelity Vision Pro prototypes, refining spatial interactions, visual hierarchy, typography, color, iconography, and accessibility considerations.",
      ],
    },
    {
      company: "Walmart — Myntra",
      role: "Associate Designer",
      domain: "Retail e-commerce",
      dates: "Oct 2020 — May 2023",
      project: "chemistry",
      points: [
        "Built an omnichannel Myntra Studio experience for a 70M MAU marketplace, designing personalized content, re-engagement loops, and digital campaign banners for Chemistry.",
        "Redesigned Chemistry’s PLP with clearer fit, material, and merchandise hierarchy: +12% add-to-bag conversion, 9% fewer returns on polyester products, +14% cross-sell CTR, and $640K in incremental annual GMV.",
      ],
    },
    {
      company: "Reliance",
      role: "Assistant Designer",
      domain: "Fashion e-commerce",
      dates: "Sep 2018 — Oct 2020",
      points: [
        "Led the 0 → 1 private-label launch strategy for Outryt. Translated customer insights into product taxonomy, attributes, and size/fit/material frameworks for AJIO’s PLP/PDP journeys.",
        "Led product development from concept to sampling, achieving a 90% first-pass design approval rate through alignment with user needs and production constraints. Mentored 3 interns.",
      ],
    },
  ],
  education: [
    [
      "M.A. Design Management",
      "Savannah College of Art and Design, USA",
      "2023 — 2025",
    ],
    [
      "B.Des. Knitwear and Graphic Design",
      "National Institute of Fashion Technology, India",
      "2013 — 2017",
    ],
  ],
  skills: [
    [
      "Research & experience",
      "Contextual inquiry, ethnography, surveys, synthesis, personas, journey maps, storyboards, interaction design, A/B and multivariate testing, prototyping, usability testing, WCAG 2.2, design systems, visual design, data visualization, and workshop facilitation.",
    ],
    [
      "Design tools",
      "Figma, FigJam, Illustrator, Photoshop, InDesign, Firefly, Framer, Maze, and Dovetail.",
    ],
    [
      "AI exploration",
      "ChatGPT, Gemini, Perplexity, NotebookLM, Midjourney, Stitch, and Project Mariner.",
    ],
    [
      "Engineering collaboration",
      "HTML, CSS, TypeScript, JavaScript, React, and SwiftUI.",
    ],
    ["Analytics & delivery", "Mixpanel, GitHub, Jira, Lovable, and Vercel."],
  ],
};

export function resumeApp(base) {
  return `<article class="resume-app"><div class="resume-intro"><div><p class="space-eyebrow">RÉSUMÉ / PRODUCT & UX DESIGN</p><h2>Isha</h2><p>${resume.summary}</p></div><a class="resume-pdf" href="${profile.resume}" target="_blank" rel="noopener noreferrer">Original PDF ↗<span class="sr-only"> (opens in a new tab)</span></a></div><nav class="resume-sections" aria-label="Resume sections">${["Experience", "Education", "Skills"].map((label) => `<a href="#resume-${label.toLowerCase()}" data-resume-jump="resume-${label.toLowerCase()}">${label}</a>`).join("")}</nav><section class="resume-experience" id="resume-experience"><p class="space-eyebrow">CAREER / 5 ROLES</p><h2>Experience</h2><div class="resume-timeline">${resume.experience.map((job, i) => `<section class="resume-role"><div class="resume-role-heading"><div><p class="resume-company">${job.company}${i === 0 ? '<span class="resume-current">Current role</span>' : ""}</p><h3>${job.role}</h3><p>${job.domain}</p></div><p class="resume-dates">${job.dates}</p></div><details ${i === 0 ? "open" : ""}><summary>Role & impact<span class="sr-only"> at ${job.company}</span><span aria-hidden="true">+</span></summary><ul>${job.points.map((point) => `<li>${point}</li>`).join("")}</ul>${job.project ? `<a class="resume-case-link" href="${base}projects/${job.project}/" data-case="${job.project}">Open project studio →</a>` : ""}</details></section>`).join("")}</div></section><div class="resume-foundations"><section id="resume-education"><h2>Education</h2>${resume.education.map(([degree, school, dates]) => `<div class="resume-degree"><h3>${degree}</h3><p>${school}</p><p class="resume-dates">${dates}</p></div>`).join("")}</section><section><h2>Awards</h2><div class="resume-degree"><h3>Indigo Design Award</h3><p>3 Silver · 2 Bronze</p></div><div class="resume-degree"><h3>International Design Awards</h3><p>Honorable mention</p></div></section></div><section id="resume-skills" class="resume-skills"><h2>Skills & toolkit</h2>${resume.skills.map(([title, copy]) => `<div><h3>${title}</h3><p>${copy}</p></div>`).join("")}</section><div class="resume-footer"><p>Let’s build something thoughtful.</p><a class="space-button" href="mailto:${profile.email}">Get in touch →</a></div></article>`;
}
