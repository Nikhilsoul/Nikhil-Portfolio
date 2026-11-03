// Offline "brain". Used when /api/chat is unavailable (local dev without a key,
// network issue, API outage) so the assistant never looks broken.
import { PROFILE as P } from "./knowledge.js";

const SKILLS = [
  ["React.js", /\breact(\.?js)?\b/i],
  ["Node.js", /\bnode(\.?js)?\b/i],
  ["Express.js", /\bexpress(\.?js)?\b/i],
  ["MongoDB", /\bmongo(db)?\b/i],
  ["MySQL / SQL", /\b(my)?sql\b/i],
  ["JavaScript", /\bjavascript\b|\bes6\b|\bjs\b/i],
  ["HTML / CSS", /\bhtml5?\b|\bcss3?\b/i],
  ["Tailwind CSS", /\btailwind/i],
  ["REST APIs", /\brest(ful)?\b|\bapis?\b/i],
  ["JWT / Auth", /\bjwt\b|\bauthenticat|\boauth\b/i],
  ["Stripe", /\bstripe\b/i],
  ["PayPal", /\bpaypal\b/i],
  ["Shopify", /\bshopify\b/i],
  ["Git / GitHub", /\bgit(hub)?\b/i],
  ["Vercel", /\bvercel\b/i],
  ["DSA", /\bdsa\b|data structures|algorithms?\b/i],
  ["OOP", /\boops?\b|object[- ]oriented/i],
  ["Postman", /\bpostman\b/i],
];

const GAPS = [
  ["TypeScript", /\btypescript\b/i],
  ["Next.js", /\bnext\.?js\b/i],
  ["Python", /\bpython\b/i],
  ["Java", /\bjava\b/i],
  ["AWS", /\baws\b|amazon web services/i],
  ["Docker", /\bdocker\b/i],
  ["Kubernetes", /\bkubernetes\b|\bk8s\b/i],
  ["GraphQL", /\bgraphql\b/i],
  ["PostgreSQL", /\bpostgres(ql)?\b/i],
  ["Redux", /\bredux\b/i],
  ["Angular", /\bangular\b/i],
  ["Vue", /\bvue(\.?js)?\b/i],
  ["Redis", /\bredis\b/i],
  ["CI/CD", /\bci\/cd\b|\bjenkins\b|github actions/i],
  ["PHP / Laravel", /\bphp\b|\blaravel\b/i],
  ["C# / .NET", /c#|\.net\b/i],
  ["Automated testing", /\bjest\b|\bcypress\b|\bunit test/i],
  ["React Native", /\breact native\b/i],
];

function fitAnalysis(text) {
  const matched = SKILLS.filter(([, re]) => re.test(text)).map(([n]) => n);
  const gaps = GAPS.filter(([, re]) => re.test(text)).map(([n]) => n);
  const total = matched.length + gaps.length;
  if (!total) {
    return `I couldn't spot specific technologies in that text. Try pasting the **requirements** section of the job description, or tell me the stack and I'll compare it with Nikhil's profile.\n\nQuick reminder of his core: React.js, Node.js, Express.js, MongoDB, MySQL, REST APIs, JWT, Stripe, PayPal and Shopify integrations.`;
  }
  const pct = Math.round((matched.length / total) * 100);
  const verdict =
    pct >= 75
      ? "Strong overlap — this looks like a natural fit."
      : pct >= 50
      ? "Good overlap, with a few areas he'd need to ramp up on."
      : "Partial overlap — worth a conversation, but there are real gaps.";
  const senior = /\b(senior|lead|principal|staff)\b|\b([4-9]|1\d)\+?\s*years/i.test(text)
    ? `\n\n**Seniority note:** the role may expect more than Nikhil's ${P.experienceYears} years of experience, so worth confirming directly.`
    : "";
  return `**Skill overlap: ~${pct}%** — ${verdict}\n\n**Strong matches:** ${
    matched.join(", ") || "none detected"
  }\n\n**Gaps (not on his profile):** ${gaps.join(", ") || "none detected"}${senior}\n\n_This is a keyword-based check; the best next step is a quick chat with Nikhil._\n[[open:email]] [[goto:projects]]`;
}

const has = (t, ...ws) => ws.some((w) => (w instanceof RegExp ? w.test(t) : t.includes(w)));

const TECH_FACTS = [
  [/react/, "Nikhil uses **React.js** in all three of his projects — including a Canva-like drag-and-drop customization editor for Spice Affair and a responsive Tailwind UI for the booking system."],
  [/node|express/, "He builds backends with **Node.js and Express.js** — RESTful APIs, Shopify endpoint integrations, booking workflows and JWT-secured routes across his projects at i-Next and beyond."],
  [/mongo/, "**MongoDB** is used in Spice Affair (storing Shopify product data for fast retrieval) and the Service Booking system."],
  [/mysql|sql/, "**MySQL** powers the Yellow House HR Management System, and he trained on it during his DXC Technology internship."],
  [/stripe/, "He integrated **Stripe** for secure online payments in the Service Booking Management System."],
  [/paypal/, "He implemented a **PayPal** gateway with automated confirmation emails to buyers and sellers in Spice Affair."],
  [/shopify/, "At i-Next Web Technologies he integrated **Shopify APIs** — fetching products, collections, locations, languages and tags — and stored structured data in MongoDB."],
  [/tailwind/, "He used **Tailwind CSS** with React.js for the responsive UI of the Service Booking Management System."],
  [/jwt|auth/, "He implemented **JWT-based authentication & authorization** with role-based access (Admin & Guest) in the Service Booking system."],
  [/git|github/, "He uses **Git & GitHub** daily for version control — see his code at github.com/Nikhilsoul."],
  [/vercel|deploy/, "He deploys on **Vercel**."],
];

const PROJECT_DETAIL = [
  [/spice|shopify|canva|customi/, 0],
  [/yellow|hr\b|employee|vehicle|schedul/, 1],
  [/booking|guest|service/, 2],
];

function projectText(p) {
  return `**${p.name}**\n_${p.tech}_\n\n${p.points.map((x) => `- ${x}`).join("\n")}`;
}

export function localReply(input) {
  const raw = input || "";
  const t = raw.toLowerCase();

  const techCount = [...SKILLS, ...GAPS].filter(([, re]) => re.test(raw)).length;
  const jdWords = /\b(need|require[sd]?|requirements|looking|seeking|hiring|must|years|qualifications|responsibilities|job description|position|opening|vacancy)\b/i;
  if (raw.length > 220 || (techCount >= 3 && jdWords.test(raw)) || techCount >= 6) {
    return fitAnalysis(raw);
  }

  if (has(t, "salary", "ctc", "notice period", "relocat", "remote", "expected pay", "visa")) {
    return `I don't have details on salary, notice period or relocation/remote preferences — those are best discussed with Nikhil directly. ${P.availability}.\n[[open:email]] [[open:linkedin]]`;
  }

  if (/^(hi|hello|hey|hii|namaste|yo|good (morning|afternoon|evening))\b/.test(t) && raw.length < 40) {
    return `Hey! 👋 I'm Nikhil's AI assistant. Ask me about his **projects**, **skills**, **experience**, or paste a job description and I'll check how well he fits.`;
  }

  if (has(t, "thank", "thanks", "thx", "great", "awesome", "nice") && raw.length < 40) {
    return `Happy to help! If you'd like to take things further, Nikhil would love to hear from you.\n[[open:email]]`;
  }

  if (has(t, "contact", "email", "phone", "whatsapp", "reach", "linkedin", "github", "call", "connect", "get in touch", "hire", "interview")) {
    return `Here's how to reach Nikhil:\n\n- **Email:** ${P.contact.email}\n- **Phone / WhatsApp:** ${P.contact.phone}\n- **LinkedIn:** [nikhilkumar11909850](${P.contact.linkedin})\n- **GitHub:** [Nikhilsoul](${P.contact.github})\n\n${P.availability}.\n[[open:email]] [[open:linkedin]]`;
  }

  if (has(t, "why hire", "why should", "strength", "best at", "stand out", "good fit", "worth hiring")) {
    return `Why Nikhil is worth a conversation:\n\n- **Real production experience** — ${P.experienceYears} years shipping full-stack apps at i-Next Web Technologies\n- **Integration depth** — Shopify, PayPal and Stripe in live projects\n- **Complete MERN skills** plus MySQL, JWT auth and database query optimization\n- **Product thinking** — built a Canva-like drag-and-drop editor, not just CRUD screens\n\n${P.availability}.\n[[goto:projects]] [[open:email]]`;
  }

  // Specific project
  if (has(t, "project", "built", "build", "work on", "portfolio", "showcase", "spice", "yellow", "booking", "canva")) {
    const hit = PROJECT_DETAIL.find(([re]) => re.test(t));
    if (hit) return `${projectText(P.projects[hit[1]])}\n[[goto:projects]]`;
    return `Nikhil has three featured projects:\n\n${P.projects
      .map((p) => `- **${p.short}** — ${p.tech.split(" · ").slice(0, 4).join(", ")}`)
      .join("\n")}\n\nAsk me about any of them for the full breakdown, e.g. “Tell me about Spice Affair”.\n[[goto:projects]]`;
  }

  // Specific technology
  const techs = TECH_FACTS.filter(([re]) => re.test(t));
  if (techs.length && !has(t, "stack", "skills", "technolog")) {
    return `${techs.slice(0, 3).map((x) => x[1]).join("\n\n")}\n[[goto:skills]]`;
  }

  if (has(t, "skill", "stack", "technolog", "tools", "language", "know", "expertise", "proficient")) {
    return `Nikhil's toolkit:\n\n${Object.entries(P.skills)
      .map(([k, v]) => `- **${k}:** ${v.join(", ")}`)
      .join("\n")}\n[[goto:skills]]`;
  }

  if (has(t, "experience", "work", "job", "career", "company", "intern", "i-next", "inext", "dxc", "employ", "role")) {
    return `Nikhil's journey so far:\n\n${P.experience
      .map(
        (e) =>
          `- **${e.title}**, ${e.company} (${e.place}) — ${e.period}\n  ${e.points[0]}`
      )
      .join("\n")}\n\nIn total that's about ${P.experienceYears} years of hands-on experience.\n[[goto:experience]]`;
  }

  if (has(t, "education", "degree", "college", "university", "cgpa", "study", "studied", "lovely", "lpu", "b.tech", "btech")) {
    const e = P.education[0];
    return `Nikhil completed a **${e.degree}** at **${e.school}** (${e.place}), ${e.period}, with a ${e.grade}.\n[[goto:education]]`;
  }

  if (has(t, "where", "location", "based", "live", "city", "from")) {
    return `Nikhil is from **${P.location}**, and his current role is with a Chandigarh-based company. For remote or relocation preferences, it's best to ask him directly.\n[[goto:contact]]`;
  }

  if (has(t, "who", "about", "introduce", "tell me", "summary", "yourself", "nikhil")) {
    return `${P.summary}\n\n${P.availability}.\n[[goto:experience]] [[goto:projects]]`;
  }

  return `I can help with questions about Nikhil's **projects**, **tech stack**, **experience**, **education** and **how to contact him**. You can also paste a job description and I'll estimate how well he fits.\n\nTry: “What did Nikhil build with Shopify?”`;
}
