import React from "react";

// Safe mini-markdown: **bold**, `code`, [text](https://…), bare URLs, "- " lists, "1. " lists.
// Builds React elements (never innerHTML), and only allows http(s)/mailto links.

const INLINE =
  /(\*\*[^*\n]+\*\*|`[^`\n]+`|_[^\s_][^_\n]*[^\s_]_|\[[^\]\n]+\]\((?:https?:\/\/|mailto:)[^)\s]+\)|https?:\/\/[^\s)]+)/g;

function inline(text, base) {
  const out = [];
  let last = 0;
  let n = 0;
  let m;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    let tok = m[0];
    const key = `${base}-${n++}`;
    if (tok.startsWith("**")) {
      out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("_")) {
      out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    } else if (tok.startsWith("`")) {
      out.push(<code key={key}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("[")) {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      out.push(
        <a key={key} href={mm[2]} target="_blank" rel="noreferrer noopener">
          {mm[1]}
        </a>
      );
    } else {
      const clean = tok.replace(/[.,;:!?]+$/, "");
      out.push(
        <a key={key} href={clean} target="_blank" rel="noreferrer noopener">
          {clean}
        </a>
      );
      if (clean.length < tok.length) out.push(tok.slice(clean.length));
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ text }) {
  const lines = text.split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const ul = /^\s*[-*•▸]\s+(.*)$/;
    const ol = /^\s*\d+[.)]\s+(.*)$/;
    if (ul.test(line) || ol.test(line)) {
      const ordered = ol.test(line) && !ul.test(line);
      const re = ordered ? ol : ul;
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        items.push(re.exec(lines[i])[1]);
        i++;
      }
      const Tag = ordered ? "ol" : "ul";
      blocks.push(
        <Tag key={blocks.length}>
          {items.map((it, k) => (
            <li key={k}>{inline(it, `l${blocks.length}-${k}`)}</li>
          ))}
        </Tag>
      );
    } else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !ul.test(lines[i]) && !ol.test(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      blocks.push(
        <p key={blocks.length}>
          {para.map((p, k) => (
            <React.Fragment key={k}>
              {k > 0 && <br />}
              {inline(p, `p${blocks.length}-${k}`)}
            </React.Fragment>
          ))}
        </p>
      );
    }
  }
  return <>{blocks}</>;
}
