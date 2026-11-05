// All selectors are prefixed with .nkbot- so nothing leaks into (or from) the portfolio.
export const CSS = `
.nkbot-root{
  --bg:#080c10;--bg2:#0d1117;--accent:#00e5ff;--accent2:#7c3aed;--accent3:#10b981;
  --text:#e6edf3;--muted:#7d8590;--border:rgba(255,255,255,0.08);--card:rgba(22,27,34,0.85);
  font-family:'DM Sans',sans-serif;color:var(--text);
}
.nkbot-root *{box-sizing:border-box}
.nkbot-root button,.nkbot-root textarea{font-family:inherit}
@media (hover:hover) and (pointer:fine){
  .nkbot-root,.nkbot-root *{cursor:none!important}
}

/* ---------- Launcher ---------- */
.nkbot-fab{
  position:fixed;right:2rem;bottom:5.6rem;width:58px;height:58px;border-radius:50%;
  border:none;padding:0;color:#000;z-index:9000;display:grid;place-items:center;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  box-shadow:0 0 0 1px rgba(255,255,255,.12),0 10px 34px rgba(0,229,255,.28);
  transition:transform .25s ease,box-shadow .25s ease;
  animation:nkbot-pop .6s .4s cubic-bezier(.2,.9,.3,1.3) both;
}
.nkbot-fab:hover{transform:scale(1.07);box-shadow:0 0 0 1px rgba(255,255,255,.2),0 12px 44px rgba(0,229,255,.45)}
.nkbot-fab:focus-visible,.nkbot-icon-btn:focus-visible,.nkbot-chip:focus-visible,.nkbot-sugg:focus-visible,.nkbot-send:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.nkbot-fab::before{
  content:'';position:absolute;inset:-9px;border-radius:50%;
  border:1px dashed rgba(0,229,255,.38);animation:nkbot-spin 16s linear infinite;pointer-events:none;
}
.nkbot-fab::after{
  content:'';position:absolute;inset:0;border-radius:50%;pointer-events:none;
  animation:nkbot-pulse 2.6s ease-out infinite;
}
.nkbot-fab.is-open::after{animation:none}
.nkbot-fab svg{position:absolute;transition:transform .35s ease,opacity .25s ease}
.nkbot-fab .ic-close{opacity:0;transform:rotate(-90deg) scale(.6)}
.nkbot-fab.is-open .ic-open{opacity:0;transform:rotate(90deg) scale(.6)}
.nkbot-fab.is-open .ic-close{opacity:1;transform:none}
.nkbot-fab-dot{
  position:absolute;top:2px;right:2px;width:12px;height:12px;border-radius:50%;
  background:var(--accent3);border:2px solid var(--bg);box-shadow:0 0 8px var(--accent3);
}

/* ---------- Teaser bubble ---------- */
.nkbot-teaser{
  position:fixed;right:6.4rem;bottom:6.1rem;max-width:230px;z-index:9000;
  padding:.8rem 2rem .8rem 1rem;font-size:.82rem;line-height:1.45;text-align:left;
  background:rgba(13,17,23,.96);color:var(--text);border:1px solid rgba(0,229,255,.28);
  border-radius:4px;box-shadow:0 12px 40px rgba(0,0,0,.5);backdrop-filter:blur(16px);
  animation:nkbot-teaser .5s cubic-bezier(.2,.9,.3,1.2) both;
}
.nkbot-teaser::after{
  content:'';position:absolute;right:-6px;bottom:18px;width:10px;height:10px;transform:rotate(45deg);
  background:rgba(13,17,23,.96);border-right:1px solid rgba(0,229,255,.28);border-top:1px solid rgba(0,229,255,.28);
}
.nkbot-teaser b{color:var(--accent);font-weight:600}
.nkbot-teaser-x{
  position:absolute;top:4px;right:6px;background:none;border:none;color:var(--muted);
  font-size:1rem;line-height:1;padding:4px;
}
.nkbot-teaser-x:hover{color:var(--text)}

/* ---------- Panel ---------- */
.nkbot-panel{
  position:fixed;right:2rem;bottom:9.6rem;z-index:9000;
  width:400px;height:min(640px,calc(100vh - 11.5rem));height:min(640px,calc(100dvh - 11.5rem));
  display:flex;flex-direction:column;overflow:hidden;
  background:rgba(9,13,18,.95);backdrop-filter:blur(26px) saturate(140%);
  border:1px solid rgba(0,229,255,.18);border-radius:8px;
  box-shadow:0 30px 90px rgba(0,0,0,.65),0 0 70px rgba(0,229,255,.07);
  transform-origin:bottom right;opacity:0;visibility:hidden;pointer-events:none;
  transform:translateY(18px) scale(.96);
  transition:opacity .25s ease,transform .32s cubic-bezier(.2,.8,.2,1),visibility 0s .32s;
}
.nkbot-panel.open{opacity:1;visibility:visible;pointer-events:auto;transform:none;transition-delay:0s}
.nkbot-panel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;z-index:2;
  background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3));
}
.nkbot-panel::after{
  content:'';position:absolute;top:-90px;right:-90px;width:240px;height:240px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(0,229,255,.1),transparent 70%);
}

/* Header */
.nkbot-head{
  position:relative;z-index:1;display:flex;align-items:center;gap:12px;padding:16px 14px 14px 16px;
  border-bottom:1px solid var(--border);background:linear-gradient(180deg,rgba(0,229,255,.05),transparent);
}
.nkbot-avatar{
  position:relative;flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;
  font-family:'Syne',sans-serif;font-weight:800;font-size:.95rem;color:#000;
  background:linear-gradient(135deg,var(--accent),var(--accent2));box-shadow:0 0 22px rgba(0,229,255,.32);
}
.nkbot-avatar i{
  position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;
  background:var(--accent3);border:2px solid var(--bg);
}
.nkbot-title{flex:1;min-width:0}
.nkbot-title strong{display:block;font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;letter-spacing:.2px}
.nkbot-status{
  white-space:nowrap;display:flex;align-items:center;gap:6px;margin-top:2px;
  font-family:'DM Mono',monospace;font-size:.62rem;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);
}
.nkbot-status::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent3);box-shadow:0 0 8px var(--accent3)}
.nkbot-status.local::before{background:#f5a524;box-shadow:0 0 8px #f5a524}
.nkbot-icon-btn{
  flex:none;width:32px;height:32px;display:grid;place-items:center;border-radius:4px;
  background:transparent;border:1px solid transparent;color:var(--muted);transition:all .2s;
}
.nkbot-icon-btn:hover{color:var(--accent);border-color:rgba(0,229,255,.25);background:rgba(0,229,255,.06)}
.nkbot-icon-btn.active{color:var(--accent);border-color:rgba(0,229,255,.35);background:rgba(0,229,255,.1)}
.nkbot-icon-btn svg{width:16px;height:16px}

/* Messages */
.nkbot-body{
  position:relative;z-index:1;flex:1;overflow-y:auto;overscroll-behavior:contain;
  padding:18px 16px 8px;display:flex;flex-direction:column;gap:16px;scroll-behavior:smooth;
  scrollbar-width:thin;scrollbar-color:rgba(0,229,255,.25) transparent;
}
.nkbot-body::-webkit-scrollbar{width:6px}
.nkbot-body::-webkit-scrollbar-thumb{background:rgba(0,229,255,.2);border-radius:3px}

.nkbot-welcome{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:8px 4px 2px}
.nkbot-orb{
  position:relative;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;margin-bottom:6px;
  font-family:'Syne',sans-serif;font-weight:800;font-size:1.4rem;color:#000;
  background:linear-gradient(135deg,var(--accent),var(--accent2));box-shadow:0 0 44px rgba(0,229,255,.35);
}
.nkbot-orb::before{content:'';position:absolute;inset:-9px;border-radius:50%;border:1px dashed rgba(0,229,255,.3);animation:nkbot-spin 18s linear infinite}
.nkbot-welcome h3{margin:0;font-family:'Syne',sans-serif;font-weight:800;font-size:1.2rem;line-height:1.2}
.nkbot-welcome h3 span{color:var(--accent)}
.nkbot-welcome p{margin:0;max-width:300px;font-size:.84rem;line-height:1.6;color:var(--muted)}
.nkbot-suggs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;width:100%}
.nkbot-sugg{
  display:flex;align-items:center;gap:8px;padding:10px 11px;text-align:left;font-size:.78rem;font-weight:500;
  color:var(--text);background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:4px;
  transition:all .2s;
}
.nkbot-sugg span{font-size:1rem}
.nkbot-sugg:hover{border-color:rgba(0,229,255,.4);background:rgba(0,229,255,.07);transform:translateY(-1px)}

.nkbot-msg{display:flex;gap:10px;align-items:flex-start;animation:nkbot-in .35s ease both}
.nkbot-msg.user{flex-direction:row-reverse}
.nkbot-mini{
  flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;margin-top:2px;
  font-family:'Syne',sans-serif;font-weight:800;font-size:.62rem;color:#000;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
}
.nkbot-col{min-width:0;max-width:calc(100% - 40px);display:flex;flex-direction:column;align-items:flex-start}
.nkbot-msg.user .nkbot-col{align-items:flex-end;max-width:84%}
.nkbot-bubble{
  padding:10px 14px;font-size:.86rem;line-height:1.62;word-wrap:break-word;overflow-wrap:anywhere;
  background:var(--card);border:1px solid var(--border);border-radius:4px 14px 14px 14px;
}
.nkbot-msg.user .nkbot-bubble{
  background:linear-gradient(135deg,rgba(0,229,255,.14),rgba(124,58,237,.14));
  border-color:rgba(0,229,255,.3);border-radius:14px 4px 14px 14px;white-space:pre-wrap;
}
.nkbot-bubble p{margin:0 0 .55em}
.nkbot-bubble p:last-child,.nkbot-bubble ul:last-child,.nkbot-bubble ol:last-child{margin-bottom:0}
.nkbot-bubble strong{color:#fff;font-weight:600}
.nkbot-bubble em{color:var(--muted)}
.nkbot-bubble code{font-family:'DM Mono',monospace;font-size:.76rem;padding:1px 6px;border-radius:2px;color:var(--accent);background:rgba(0,229,255,.08);border:1px solid rgba(0,229,255,.15)}
.nkbot-bubble a{color:var(--accent);text-decoration:underline;text-decoration-color:rgba(0,229,255,.35);text-underline-offset:2px;word-break:break-word}
.nkbot-bubble a:hover{text-decoration-color:var(--accent)}
.nkbot-bubble ul,.nkbot-bubble ol{margin:.2em 0 .55em;padding:0;list-style:none;display:flex;flex-direction:column;gap:.3em}
.nkbot-bubble ul li{position:relative;padding-left:1rem}
.nkbot-bubble ul li::before{content:'▸';position:absolute;left:0;color:var(--accent)}
.nkbot-bubble ol{counter-reset:n}
.nkbot-bubble ol li{position:relative;padding-left:1.4rem;counter-increment:n}
.nkbot-bubble ol li::before{content:counter(n) '.';position:absolute;left:0;font-family:'DM Mono',monospace;font-size:.75rem;color:var(--accent)}

.nkbot-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.nkbot-chip{
  display:inline-flex;align-items:center;gap:6px;padding:6px 11px;
  font-family:'DM Mono',monospace;font-size:.68rem;letter-spacing:.6px;color:var(--accent);
  background:rgba(0,229,255,.07);border:none;
  clip-path:polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px));
  box-shadow:inset 0 0 0 1px rgba(0,229,255,.32);transition:all .2s;
}
.nkbot-chip:hover{background:rgba(0,229,255,.18);box-shadow:inset 0 0 0 1px var(--accent)}

.nkbot-tools{display:flex;gap:2px;margin-top:4px;opacity:.55;transition:opacity .2s}
.nkbot-msg:hover .nkbot-tools,.nkbot-tools:focus-within{opacity:1}
.nkbot-tool{
  display:inline-flex;align-items:center;gap:5px;padding:3px 7px;background:none;border:none;border-radius:3px;
  font-family:'DM Mono',monospace;font-size:.62rem;letter-spacing:.5px;color:var(--muted);transition:color .2s,background .2s;
}
.nkbot-tool:hover{color:var(--accent);background:rgba(0,229,255,.07)}
.nkbot-tool svg{width:12px;height:12px}

.nkbot-typing{display:inline-flex;gap:4px;padding:5px 2px}
.nkbot-typing i{width:6px;height:6px;border-radius:50%;background:var(--accent);opacity:.35;animation:nkbot-dot 1.2s infinite ease-in-out}
.nkbot-typing i:nth-child(2){animation-delay:.15s}
.nkbot-typing i:nth-child(3){animation-delay:.3s}
.nkbot-caret::after{content:'▍';margin-left:2px;color:var(--accent);animation:nkbot-blink 1s steps(2) infinite}

/* Composer */
.nkbot-foot{position:relative;z-index:1;padding:10px 14px 12px;border-top:1px solid var(--border);background:rgba(8,12,16,.6)}
.nkbot-compose{
  display:flex;align-items:flex-end;gap:6px;padding:6px 6px 6px 12px;border-radius:6px;
  background:rgba(255,255,255,.03);border:1px solid var(--border);transition:border-color .2s,box-shadow .2s;
}
.nkbot-compose:focus-within{border-color:rgba(0,229,255,.5);box-shadow:0 0 0 3px rgba(0,229,255,.08)}
.nkbot-input{
  flex:1;min-width:0;resize:none;max-height:120px;border:none;outline:none;background:transparent;
  color:var(--text);font-size:.88rem;line-height:1.5;padding:7px 0;
}
.nkbot-input::placeholder{color:var(--muted)}
.nkbot-send{
  flex:none;width:38px;height:38px;display:grid;place-items:center;border:none;color:#000;background:var(--accent);
  clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));transition:all .2s;
}
.nkbot-send:hover:not(:disabled){background:#5af0ff;transform:translateY(-1px)}
.nkbot-send:disabled{opacity:.35}
.nkbot-send.stop{background:#ff5c7a}
.nkbot-send svg{width:17px;height:17px}
.nkbot-mic.listening{color:#ff5c7a;border-color:rgba(255,92,122,.4);background:rgba(255,92,122,.1);animation:nkbot-rec 1.2s infinite}
.nkbot-hint{
  margin-top:8px;text-align:center;font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.6px;color:var(--muted);opacity:.8;
}
.nkbot-hint kbd{font-family:inherit;padding:0 4px;border:1px solid var(--border);border-radius:3px}

/* Animations */
@keyframes nkbot-spin{to{transform:rotate(360deg)}}
@keyframes nkbot-pulse{0%{box-shadow:0 0 0 0 rgba(0,229,255,.45)}70%,100%{box-shadow:0 0 0 18px rgba(0,229,255,0)}}
@keyframes nkbot-pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
@keyframes nkbot-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes nkbot-teaser{from{opacity:0;transform:translateX(14px) scale(.95)}to{opacity:1;transform:none}}
@keyframes nkbot-dot{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-4px);opacity:1}}
@keyframes nkbot-blink{50%{opacity:0}}
@keyframes nkbot-rec{0%,100%{box-shadow:0 0 0 0 rgba(255,92,122,.4)}50%{box-shadow:0 0 0 6px rgba(255,92,122,0)}}

/* Tablet / mobile */
@media (max-width:900px){
  .nkbot-fab{right:1.2rem;bottom:5rem}
  .nkbot-teaser{right:5.2rem;bottom:5.4rem}
  .nkbot-panel{right:1.2rem;bottom:9rem;width:min(400px,calc(100vw - 2.4rem));height:min(640px,calc(100dvh - 11rem))}
}
@media (max-width:600px){
  .nkbot-panel{
    inset:0;width:100%;height:100vh;height:100dvh;border-radius:0;border:none;transform:translateY(24px);
    transform-origin:bottom center;
  }
  .nkbot-fab{right:1rem;bottom:max(1rem,env(safe-area-inset-bottom));width:54px;height:54px}
  .nkbot-fab.is-open{opacity:0;pointer-events:none}
  .nkbot-teaser{right:4.8rem;bottom:calc(max(1rem,env(safe-area-inset-bottom)) + 0.3rem);max-width:min(200px,calc(100vw - 6rem))}
  .nkbot-input{font-size:16px} /* prevents iOS zoom on focus */
  .nkbot-hint{display:none}
  .nkbot-head{padding-top:max(16px,env(safe-area-inset-top))}
  .nkbot-foot{padding-bottom:max(12px,env(safe-area-inset-bottom))}
}
@media (prefers-reduced-motion:reduce){
  .nkbot-root *,.nkbot-root *::before,.nkbot-root *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  .nkbot-body{scroll-behavior:auto}
}
`;
