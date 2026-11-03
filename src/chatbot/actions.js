import { PROFILE } from "./knowledge.js";

const SECTION_IDS = {
  hero: "nk-hero",
  experience: "nk-experience",
  skills: "nk-skills",
  projects: "nk-projects",
  education: "nk-education",
  contact: "nk-contact",
};

const LINKS = {
  email: `mailto:${PROFILE.contact.email}?subject=${encodeURIComponent(
    "Hello Nikhil — reaching out from your portfolio"
  )}`,
  linkedin: PROFILE.contact.linkedin,
  github: PROFILE.contact.github,
  whatsapp: PROFILE.contact.whatsapp,
};

const LABELS = {
  "goto:hero": ["↑", "Back to top"],
  "goto:experience": ["💼", "See experience"],
  "goto:skills": ["🧠", "See skills"],
  "goto:projects": ["🚀", "See projects"],
  "goto:education": ["🎓", "See education"],
  "goto:contact": ["📬", "Go to contact"],
  "open:email": ["📧", "Email Nikhil"],
  "open:linkedin": ["in", "LinkedIn"],
  "open:github": ["gh", "GitHub"],
  "open:whatsapp": ["💬", "WhatsApp"],
};

const RE = /\[\[(goto|open):([a-z]+)\]\]/gi;

// Splits a raw model reply into visible text + a list of valid actions.
export function parseReply(raw, streaming = false) {
  const actions = [];
  const seen = new Set();
  let text = raw.replace(RE, (_, type, target) => {
    const id = `${type.toLowerCase()}:${target.toLowerCase()}`;
    if (LABELS[id] && !seen.has(id)) {
      seen.add(id);
      actions.push({ id, type: type.toLowerCase(), target: target.toLowerCase() });
    }
    return "";
  });
  if (streaming) text = text.replace(/\[\[[^\]]*$/, ""); // hide a half-typed directive
  return { text: text.trim(), actions: actions.slice(0, 2) };
}

export function describeAction(a) {
  const [icon, label] = LABELS[a.id];
  return { icon, label };
}

export function runAction(a) {
  if (a.type === "goto") {
    const el = document.getElementById(SECTION_IDS[a.target]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (a.target === "email") {
    window.location.href = LINKS.email;
  } else if (LINKS[a.target]) {
    window.open(LINKS[a.target], "_blank", "noopener,noreferrer");
  }
}

// Plain text for text-to-speech (strips markdown).
export function toSpeakable(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*`#>]/g, "")
    .replace(/^\s*[-•▸]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
