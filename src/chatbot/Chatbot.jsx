import React, { useCallback, useEffect, useRef, useState } from "react";
import { CSS } from "./styles.js";
import { Markdown } from "./markdown.jsx";
import { parseReply, describeAction, runAction, toSpeakable } from "./actions.js";
import { localReply } from "./localBrain.js";

const STORE = "nk-chatbot-v1";
const TEASER_KEY = "nk-chatbot-teaser";
const MAX_STORED = 30;

const SUGGESTIONS = [
  { icon: "🚀", label: "Top projects", q: "Tell me about Nikhil's best projects." },
  { icon: "🧠", label: "Tech stack", q: "What is Nikhil's tech stack?" },
  { icon: "💼", label: "Experience", q: "Walk me through Nikhil's work experience." },
  { icon: "🎯", label: "Match my job post", prefill: "Here's a job description — how well does Nikhil fit?\n\n" },
  { icon: "⚡", label: "Why hire Nikhil?", q: "Why should I hire Nikhil?" },
  { icon: "📬", label: "Contact him", q: "How can I contact Nikhil?" },
];

const uid = () => Math.random().toString(36).slice(2, 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadMessages() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content)
      .slice(-MAX_STORED);
  } catch {
    return [];
  }
}

/* ---------- icons ---------- */
const I = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p} />
);
const IconSpark = (p) => (
  <I {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" fill="currentColor" stroke="none" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill="currentColor" stroke="none" />
  </I>
);
const IconClose = (p) => (<I {...p}><path d="M18 6L6 18M6 6l12 12" /></I>);
const IconSend = (p) => (<I {...p}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></I>);
const IconStop = (p) => (<I {...p}><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></I>);
const IconMic = (p) => (<I {...p}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v4" /></I>);
const IconVolume = (p) => (<I {...p}><path d="M11 5L6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" /></I>);
const IconMute = (p) => (<I {...p}><path d="M11 5L6 9H2v6h4l5 4z" /><path d="M22 9l-6 6M16 9l6 6" /></I>);
const IconTrash = (p) => (<I {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></I>);
const IconCopy = (p) => (<I {...p}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></I>);
const IconRefresh = (p) => (<I {...p}><path d="M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5" /></I>);

export default function NikhilChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("unknown"); // unknown | ai | local
  const [speakOn, setSpeakOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [copied, setCopied] = useState(null);

  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const recRef = useRef(null);
  const stickRef = useRef(true);
  const busyRef = useRef(false);
  const speakRef = useRef(false);
  const messagesRef = useRef(messages);
  const openedRef = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { speakRef.current = speakOn; if (!speakOn) window.speechSynthesis?.cancel(); }, [speakOn]);

  const hasSpeechOut = typeof window !== "undefined" && "speechSynthesis" in window;
  const SR = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

  /* persist finished conversations */
  useEffect(() => {
    if (busy) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(messages.slice(-MAX_STORED)));
    } catch { /* storage unavailable */ }
  }, [messages, busy]);

  /* auto-scroll while streaming (unless the user scrolled up) */
  useEffect(() => {
    const el = bodyRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const onBodyScroll = () => {
    const el = bodyRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
  };

  /* auto-grow textarea */
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  /* open/close side effects */
  useEffect(() => {
    if (open) {
      openedRef.current = true;
      setTeaser(false);
      const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 320);
      const mobile = window.matchMedia("(max-width:600px)").matches;
      if (mobile) document.body.style.overflow = "hidden";
      return () => { clearTimeout(t); document.body.style.overflow = ""; };
    }
  }, [open]);

  /* keyboard shortcuts: Ctrl/Cmd+K toggles, Esc closes */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* teaser bubble */
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(TEASER_KEY) === "1"; } catch { /* ignore */ }
    if (seen) return;
    const show = setTimeout(() => {
      if (openedRef.current) return;
      setTeaser(true);
      try { sessionStorage.setItem(TEASER_KEY, "1"); } catch { /* ignore */ }
    }, 4500);
    const hide = setTimeout(() => setTeaser(false), 14000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  /* cleanup */
  useEffect(() => () => {
    abortRef.current?.abort();
    recRef.current?.stop?.();
    window.speechSynthesis?.cancel();
  }, []);

  const speak = useCallback((text) => {
    if (!hasSpeechOut) return;
    const clean = toSpeakable(text);
    if (!clean) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.02;
    window.speechSynthesis.speak(u);
  }, [hasSpeechOut]);

  /* core: stream an answer for `history` (which ends with a user message) */
  const run = useCallback(async (history) => {
    const botId = uid();
    const lastUser = history[history.length - 1].content;
    setMessages([...history, { id: botId, role: "assistant", content: "" }]);
    setBusy(true);
    busyRef.current = true;
    stickRef.current = true;

    const ac = new AbortController();
    abortRef.current = ac;
    const update = (content) =>
      setMessages((m) => m.map((x) => (x.id === botId ? { ...x, content } : x)));

    let acc = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify({
          messages: history.slice(-12).map(({ role, content }) => ({ role, content })),
        }),
      });

      if (res.ok && res.headers.get("x-nk-mode") === "ai" && res.body) {
        setMode("ai");
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          update(acc);
        }
        acc += dec.decode();
        if (!acc.trim()) throw new Error("empty");
        update(acc);
      } else if (res.status === 429) {
        const j = await res.json().catch(() => ({}));
        acc = j.error || "You're sending messages quickly — give me a few seconds.";
        update(acc);
      } else {
        throw new Error("unavailable");
      }
    } catch (err) {
      if (err?.name === "AbortError" || acc.trim()) {
        /* user stopped, or we already have a usable partial answer */
      } else {
        // Graceful fallback: answer locally with a "typing" effect.
        setMode("local");
        const full = localReply(lastUser);
        const parts = full.match(/\S+\s*/g) || [full];
        for (let i = 0; i < parts.length; i += 2) {
          if (ac.signal.aborted) break;
          acc += parts.slice(i, i + 2).join("");
          update(acc);
          await sleep(22);
        }
        if (!ac.signal.aborted) { acc = full; update(full); }
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
      abortRef.current = null;
      if (!acc.trim()) {
        setMessages((m) => m.filter((x) => x.id !== botId));
      } else {
        const { text, actions } = parseReply(acc, false);
        // Agent behaviour: on desktop, auto-scroll the page to the section being discussed.
        const nav = actions.find((a) => a.type === "goto");
        if (nav && window.innerWidth > 900) setTimeout(() => runAction(nav), 350);
        if (speakRef.current) speak(text);
      }
    }
  }, [speak]);

  const send = useCallback((raw) => {
    const text = (raw ?? "").trim();
    if (!text || busyRef.current) return;
    const user = { id: uid(), role: "user", content: text.slice(0, 6000) };
    setInput("");
    run([...messagesRef.current, user]);
  }, [run]);

  const regenerate = () => {
    if (busyRef.current) return;
    const list = [...messagesRef.current];
    while (list.length && list[list.length - 1].role === "assistant") list.pop();
    if (list.length) run(list);
  };

  const stop = () => abortRef.current?.abort();

  const clearChat = () => {
    abortRef.current?.abort();
    window.speechSynthesis?.cancel();
    setMessages([]);
    try { localStorage.removeItem(STORE); } catch { /* ignore */ }
    inputRef.current?.focus();
  };

  const copyMsg = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1400);
    } catch { /* clipboard blocked */ }
  };

  const toggleMic = () => {
    if (!SR) return;
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = navigator.language || "en-IN";
    rec.interimResults = true;
    rec.continuous = false;
    const base = input ? input.replace(/\s*$/, " ") : "";
    rec.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setInput(base + t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    try { rec.start(); setListening(true); } catch { setListening(false); }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const pickSuggestion = (s) => {
    if (s.prefill) {
      setInput(s.prefill);
      setTimeout(() => {
        const el = inputRef.current;
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      }, 0);
    } else send(s.q);
  };

  const statusText = mode === "ai" ? "Live AI · Claude" : mode === "local" ? "Smart mode · offline" : "Online";
  const last = messages[messages.length - 1];

  return (
    <div className="nkbot-root">
      <style>{CSS}</style>

      {teaser && !open && (
        <div className="nkbot-teaser" role="status">
          <button className="nkbot-teaser-x" onClick={() => setTeaser(false)} aria-label="Dismiss">×</button>
          <span onClick={() => setOpen(true)} style={{ cursor: "inherit" }}>
            👋 Hi! Ask my <b>AI assistant</b> anything about Nikhil's work.
          </span>
        </div>
      )}

      <button
        className={`nkbot-fab${open ? " is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        title="Ask AI · Ctrl/⌘ + K"
      >
        <IconSpark className="ic-open" width="26" height="26" />
        <IconClose className="ic-close" width="24" height="24" strokeWidth="2.6" />
        {!open && <span className="nkbot-fab-dot" />}
      </button>

      <section className={`nkbot-panel${open ? " open" : ""}`} role="dialog" aria-label="Nikhil's AI assistant" aria-hidden={!open}>
        <header className="nkbot-head">
          <div className="nkbot-avatar">NK<i /></div>
          <div className="nkbot-title">
            <strong>Nikhil's AI Agent</strong>
            <div className={`nkbot-status${mode === "local" ? " local" : ""}`}>{statusText}</div>
          </div>
          {hasSpeechOut && (
            <button
              className={`nkbot-icon-btn${speakOn ? " active" : ""}`}
              onClick={() => setSpeakOn((v) => !v)}
              aria-pressed={speakOn}
              title={speakOn ? "Voice replies on" : "Voice replies off"}
              aria-label="Toggle voice replies"
            >
              {speakOn ? <IconVolume /> : <IconMute />}
            </button>
          )}
          <button className="nkbot-icon-btn" onClick={clearChat} title="New chat" aria-label="Clear conversation" disabled={!messages.length} style={{ opacity: messages.length ? 1 : 0.4 }}>
            <IconTrash />
          </button>
          <button className="nkbot-icon-btn" onClick={() => setOpen(false)} title="Close (Esc)" aria-label="Close">
            <IconClose />
          </button>
        </header>

        <div className="nkbot-body" ref={bodyRef} onScroll={onBodyScroll} aria-live="polite">
          {messages.length === 0 && (
            <div className="nkbot-welcome">
              <div className="nkbot-orb">NK</div>
              <h3>Hi, I'm Nikhil's <span>AI agent</span></h3>
              <p>Ask me anything about his projects, skills and experience — or paste a job description and I'll check the fit.</p>
              <div className="nkbot-suggs">
                {SUGGESTIONS.map((s) => (
                  <button key={s.label} className="nkbot-sugg" onClick={() => pickSuggestion(s)}>
                    <span>{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            const isLast = i === messages.length - 1;
            const streaming = busy && isLast;
            if (m.role === "user") {
              return (
                <div className="nkbot-msg user" key={m.id || i}>
                  <div className="nkbot-col"><div className="nkbot-bubble">{m.content}</div></div>
                </div>
              );
            }
            const { text, actions } = parseReply(m.content, streaming);
            return (
              <div className="nkbot-msg bot" key={m.id || i}>
                <div className="nkbot-mini">NK</div>
                <div className="nkbot-col">
                  <div className={`nkbot-bubble${streaming && text ? " nkbot-caret" : ""}`}>
                    {text ? (
                      <Markdown text={text} />
                    ) : (
                      <span className="nkbot-typing" aria-label="Thinking"><i /><i /><i /></span>
                    )}
                  </div>
                  {!streaming && actions.length > 0 && (
                    <div className="nkbot-actions">
                      {actions.map((a) => {
                        const d = describeAction(a);
                        return (
                          <button key={a.id} className="nkbot-chip" onClick={() => runAction(a)}>
                            <span>{d.icon}</span>{d.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {!streaming && text && (
                    <div className="nkbot-tools">
                      <button className="nkbot-tool" onClick={() => copyMsg(m.id || i, text)}>
                        <IconCopy />{copied === (m.id || i) ? "COPIED" : "COPY"}
                      </button>
                      {hasSpeechOut && (
                        <button className="nkbot-tool" onClick={() => speak(text)}><IconVolume />LISTEN</button>
                      )}
                      {isLast && (
                        <button className="nkbot-tool" onClick={regenerate}><IconRefresh />RETRY</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="nkbot-foot">
          <div className="nkbot-compose">
            <textarea
              ref={inputRef}
              className="nkbot-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={listening ? "Listening…" : "Ask about projects, skills, hiring…"}
              maxLength={6000}
              aria-label="Message"
            />
            {SR && (
              <button className={`nkbot-icon-btn nkbot-mic${listening ? " listening" : ""}`} onClick={toggleMic} aria-label={listening ? "Stop voice input" : "Start voice input"} title="Voice input">
                <IconMic />
              </button>
            )}
            {busy ? (
              <button className="nkbot-send stop" onClick={stop} aria-label="Stop generating" title="Stop"><IconStop /></button>
            ) : (
              <button className="nkbot-send" onClick={() => send(input)} disabled={!input.trim()} aria-label="Send message"><IconSend /></button>
            )}
          </div>
          <div className="nkbot-hint">
            <kbd>Enter</kbd> to send · AI can make mistakes
          </div>
        </footer>
      </section>
    </div>
  );
}
