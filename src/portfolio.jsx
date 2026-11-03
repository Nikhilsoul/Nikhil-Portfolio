import { useEffect, useRef, useState } from "react";
import image from "./assets/image.png";

export default function NikhilPortfolio() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const typedRoleRef = useRef(null);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0, raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.left = mx - 6 + "px";
        cursor.style.top = my - 6 + "px";
      }
    };
    document.addEventListener("mousemove", onMove);

    const animRing = () => {
      rx += (mx - rx - 18) * 0.15;
      ry += (my - ry - 18) * 0.15;
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      raf = requestAnimationFrame(animRing);
    };
    animRing();

    const hoverEls = document.querySelectorAll(
      "a,button,.btn-primary,.btn-ghost,.scroll-top"
    );
    const onEnter = () => cursor && (cursor.style.transform = "scale(2.5)");
    const onLeave = () => cursor && (cursor.style.transform = "scale(1)");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // Scroll-triggered reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document
      .querySelectorAll(
        ".section-header,.skill-card,.project-card,.timeline-item,.contact-item"
      )
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!showResume) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setShowResume(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [showResume]);

  // Typing effect on hero
  useEffect(() => {
    const roles = ["Kumar", "Full Stack Dev", "MERN Developer"];
    let ri = 0, ci = 0, deleting = false, timeoutId;
    const el = typedRoleRef.current;

    const type = () => {
      const r = roles[ri];
      if (deleting) {
        ci--;
        el.textContent = r.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          timeoutId = setTimeout(type, 400);
          return;
        }
      } else {
        ci++;
        el.textContent = r.slice(0, ci);
        if (ci === r.length) {
          timeoutId = setTimeout(() => {
            deleting = true;
            type();
          }, 2000);
          return;
        }
      }
      timeoutId = setTimeout(type, deleting ? 60 : 90);
    };
    timeoutId = setTimeout(type, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="nk-portfolio">
      <style>{`
        .nk-portfolio {
          --bg: #080c10;
          --bg2: #0d1117;
          --accent: #00e5ff;
          --accent2: #7c3aed;
          --accent3: #10b981;
          --text: #e6edf3;
          --muted: #7d8590;
          --border: rgba(255,255,255,0.07);
          --card: rgba(22,27,34,0.8);
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          cursor: none;
          position: relative;
          min-height: 100vh;
        }
        .nk-portfolio * { box-sizing: border-box; }
        .nk-portfolio a { cursor: none; }

        .nk-cursor {
          width:12px;height:12px;background:var(--accent);border-radius:50%;
          position:fixed;top:0;left:0;pointer-events:none;z-index:9999;
          transition:transform 0.1s;mix-blend-mode:difference;
        }
        .nk-cursor-ring {
          width:36px;height:36px;border:1.5px solid var(--accent);border-radius:50%;
          position:fixed;top:0;left:0;pointer-events:none;z-index:9998;
          transition:all 0.15s ease;opacity:0.5;
        }
        .nk-blob { position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0;
          animation:nk-drift 12s ease-in-out infinite alternate; }
        .nk-blob1 { width:500px;height:500px;background:rgba(0,229,255,0.04);top:-200px;right:-100px; }
        .nk-blob2 { width:400px;height:400px;background:rgba(124,58,237,0.05);bottom:-100px;left:-100px;animation-delay:-6s; }

        .nk-nav {
          position:fixed;top:0;left:0;right:0;padding:1.2rem 4rem;
          display:flex;align-items:center;justify-content:space-between;z-index:100;
          background:rgba(8,12,16,0.8);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);
        }
        .nk-logo { font-family:'Syne',sans-serif;font-weight:800;font-size:1.2rem;color:var(--accent);letter-spacing:2px; }
        .nk-logo span { color:var(--text); }
        .nk-nav-links { display:flex;gap:2.5rem; }
        .nk-nav-links a { font-family:'DM Mono',monospace;font-size:0.78rem;color:var(--muted);
          text-decoration:none;letter-spacing:1px;transition:color 0.3s; }
        .nk-nav-links a:hover { color:var(--text); }
        .nk-nav-toggle { display:none;background:none;border:none;cursor:none;color:var(--text);font-size:1.2rem; }

        .nk-section { position:relative;z-index:1;padding:6rem 4rem;max-width:1200px;margin:0 auto; }

        #nk-hero { display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:4rem;
          padding-top:10rem;min-height:100vh; }
        .nk-hero-tag { font-family:'DM Mono',monospace;font-size:0.75rem;color:var(--accent);
          letter-spacing:3px;text-transform:uppercase;margin-bottom:1.5rem;
          display:flex;align-items:center;gap:10px;
          opacity:0;animation:nk-fadeUp 0.8s 0.3s forwards; }
        .nk-hero-tag::before { content:'';width:40px;height:1px;background:var(--accent); }
        .nk-portfolio h1 { font-family:'Syne',sans-serif;font-size:clamp(3rem,6vw,5.5rem);
          font-weight:800;line-height:1.0;margin-bottom:1.5rem;
          opacity:0;animation:nk-fadeUp 0.8s 0.5s forwards; }
        .nk-line2 { color:transparent;-webkit-text-stroke:1.5px var(--accent); }
        .nk-hero-desc { font-size:1rem;color:var(--muted);line-height:1.8;max-width:480px;
          margin-bottom:2.5rem;opacity:0;animation:nk-fadeUp 0.8s 0.7s forwards; }
        .nk-hero-btns { display:flex;gap:1rem;flex-wrap:wrap;opacity:0;animation:nk-fadeUp 0.8s 0.9s forwards; }
        .btn-primary { padding:0.85rem 2rem;background:var(--accent);color:#000;
          font-family:'Syne',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:1px;
          border:none;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
          transition:all 0.3s;text-decoration:none;display:inline-block; }
        .btn-primary:hover { background:transparent;color:var(--accent);outline:1.5px solid var(--accent); }
        .btn-ghost { padding:0.85rem 2rem;background:transparent;color:var(--text);
          font-family:'Syne',sans-serif;font-weight:600;font-size:0.85rem;letter-spacing:1px;
          border:1px solid var(--border);clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
          transition:all 0.3s;text-decoration:none;display:inline-block; }
        .btn-ghost:hover { border-color:var(--accent);color:var(--accent); }
        .nk-resume-fab { position:fixed;left:2rem;bottom:5.6rem;width:112px;height:54px;
          padding:0 1.25rem;border:1px solid rgba(255,255,255,0.12);border-radius:8px;z-index:9000;
          display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent2));
          color:#000;font-family:'DM Mono',monospace;font-size:0.9rem;font-weight:800;
          letter-spacing:0.5px;box-shadow:0 0 0 1px rgba(255,255,255,0.12),0 10px 34px rgba(0,229,255,0.28);
          transition:transform 0.25s ease,box-shadow 0.25s ease;cursor:none; }
        .nk-resume-fab:hover { transform:scale(1.07);
          box-shadow:0 0 0 1px rgba(255,255,255,0.2),0 12px 44px rgba(0,229,255,0.45); }
        .nk-resume-fab:focus-visible { outline:2px solid var(--accent);outline-offset:3px; }

        .nk-resume-backdrop { position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.68);
          backdrop-filter:blur(4px);display:flex;justify-content:flex-end; }
        .nk-resume-panel { width:min(760px,100%);height:100%;display:flex;flex-direction:column;
          background:var(--bg2);border-left:1px solid rgba(0,229,255,0.25);
          box-shadow:-20px 0 60px rgba(0,0,0,0.4);cursor:auto; }
        .nk-resume-header { display:flex;align-items:center;justify-content:space-between;gap:1rem;
          padding:1.25rem 1.5rem;border-bottom:1px solid var(--border); }
        .nk-resume-title { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800; }
        .nk-resume-actions { display:flex;align-items:center;gap:0.75rem; }
        .nk-resume-action { display:inline-flex;align-items:center;justify-content:center;min-height:40px;
          padding:0.55rem 1rem;border:1px solid rgba(0,229,255,0.45);background:transparent;
          color:var(--accent);font:700 0.8rem 'DM Mono',monospace;text-decoration:none;cursor:pointer; }
        .nk-resume-action:hover { background:rgba(0,229,255,0.12);border-color:var(--accent); }
        .nk-resume-close { width:40px;height:40px;border:1px solid var(--border);background:transparent;
          color:var(--text);font-size:1.4rem;line-height:1;cursor:pointer; }
        .nk-resume-close:hover { border-color:var(--accent);color:var(--accent); }
        .nk-resume-content { flex:1;min-height:0;padding:1rem;display:flex;flex-direction:column; }
        .nk-resume-frame { width:100%;height:100%;flex:1;min-height:0;border:1px solid var(--border);background:#fff; }

        .nk-hero-visual { position:relative;display:flex;justify-content:center;align-items:center;
          opacity:0;animation:nk-fadeIn 1.2s 1s forwards; }
        .nk-hero-card { width:300px;height:380px;background:var(--card);border:1px solid var(--border);
          border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:1rem;position:relative;overflow:hidden;backdrop-filter:blur(20px); }
        .nk-hero-card::before { content:'';position:absolute;top:-100px;right:-100px;width:250px;height:250px;
          background:radial-gradient(circle, rgba(0,229,255,0.12),transparent 70%);border-radius:50%; }
        .nk-hero-card::after { content:'';position:absolute;bottom:-80px;left:-80px;width:200px;height:200px;
          background:radial-gradient(circle, rgba(124,58,237,0.1),transparent 70%);border-radius:50%; }
        .nk-hero-avatar { width:100px;height:100px;border-radius:50%;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          display:flex;align-items:center;justify-content:center;
          font-family:'Syne',sans-serif;font-weight:800;font-size:2.5rem;color:#000;
          position:relative;z-index:1;box-shadow:0 0 40px rgba(0,229,255,0.3); }
        .nk-hero-card-name { font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;position:relative;z-index:1; }
        .nk-hero-card-role { font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--accent);
          letter-spacing:2px;position:relative;z-index:1; }
        .nk-hero-stats { display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;width:80%;
          position:relative;z-index:1;margin-top:0.5rem; }
        .nk-stat { background:rgba(255,255,255,0.03);border:1px solid var(--border);
          padding:0.6rem;border-radius:4px;text-align:center; }
        .nk-stat-num { font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;color:var(--accent); }
        .nk-stat-lbl { font-size:0.62rem;color:var(--muted);font-family:'DM Mono',monospace; }

        .nk-orbit { position:absolute;width:420px;height:420px;border:1px dashed rgba(0,229,255,0.1);
          border-radius:50%;animation:nk-spin 20s linear infinite; }
        .nk-orbit-dot { width:8px;height:8px;background:var(--accent);border-radius:50%;
          position:absolute;top:-4px;left:50%;transform:translateX(-50%);box-shadow:0 0 10px var(--accent); }

        .section-header { margin-bottom:4rem;opacity:0;transition:opacity 0.6s,transform 0.6s;transform:translateY(30px); }
        .section-header.visible { opacity:1;transform:translateY(0); }
        .nk-section-label { font-family:'DM Mono',monospace;font-size:0.72rem;color:var(--accent);
          letter-spacing:3px;text-transform:uppercase;margin-bottom:0.8rem;display:flex;align-items:center;gap:10px; }
        .nk-section-label::after { content:'';flex:1;height:1px;background:var(--border); }
        .nk-portfolio h2 { font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2rem,4vw,3rem);line-height:1.1; }

        .nk-skills-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem; }
        .skill-card { background:var(--card);border:1px solid var(--border);padding:1.8rem;border-radius:4px;
          backdrop-filter:blur(10px);position:relative;overflow:hidden;
          opacity:0;transform:translateY(20px);transition:opacity 0.5s,transform 0.5s,border-color 0.3s; }
        .skill-card.visible { opacity:1;transform:translateY(0); }
        .skill-card:hover { border-color:rgba(0,229,255,0.2); }
        .nk-skill-icon { font-size:1.8rem;margin-bottom:1rem; }
        .nk-skill-category { font-family:'Syne',sans-serif;font-weight:700;font-size:0.9rem;
          margin-bottom:0.8rem;color:var(--text); }
        .nk-skill-tags { display:flex;flex-wrap:wrap;gap:0.5rem; }
        .nk-tag { padding:0.3rem 0.7rem;background:rgba(0,229,255,0.06);border:1px solid rgba(0,229,255,0.15);
          border-radius:2px;font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--accent); }

        .nk-projects-grid { display:grid;grid-template-columns:1fr 1fr;gap:2rem; }
        .project-card { background:var(--card);border:1px solid var(--border);padding:2rem;border-radius:4px;
          backdrop-filter:blur(10px);position:relative;overflow:hidden;
          opacity:0;transform:translateY(30px);transition:opacity 0.6s,transform 0.6s,border-color 0.3s,box-shadow 0.3s; }
        .project-card.visible { opacity:1;transform:translateY(0); }
        .project-card:hover { border-color:rgba(0,229,255,0.25);box-shadow:0 0 40px rgba(0,229,255,0.05); }
        .nk-project-num { font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--accent);margin-bottom:1rem; }
        .nk-project-name { font-family:'Syne',sans-serif;font-weight:700;font-size:1.3rem;margin-bottom:0.5rem; }
        .nk-project-tech { font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--accent2);
          margin-bottom:1.2rem;letter-spacing:1px; }
        .nk-project-points { list-style:none;display:flex;flex-direction:column;gap:0.5rem;margin:0;padding:0; }
        .nk-project-points li { font-size:0.82rem;color:var(--muted);padding-left:1rem;position:relative;line-height:1.5; }
        .nk-project-points li::before { content:'▸';position:absolute;left:0;color:var(--accent); }
        .nk-project-link { display:inline-flex;align-items:center;gap:0.4rem;font-family:'DM Mono',monospace;
          font-size:0.72rem;color:var(--accent);text-decoration:none;margin-top:1.2rem;transition:gap 0.3s; }
        .nk-project-link:hover { gap:0.8rem; }

        .nk-timeline { position:relative;padding-left:2rem; }
        .nk-timeline::before { content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:var(--border); }
        .timeline-item { position:relative;margin-bottom:3rem;opacity:0;transform:translateX(-20px);
          transition:opacity 0.6s,transform 0.6s; }
        .timeline-item.visible { opacity:1;transform:translateX(0); }
        .nk-timeline-dot { position:absolute;left:-2.45rem;top:0.4rem;width:10px;height:10px;
          background:var(--accent);border-radius:50%;box-shadow:0 0 12px var(--accent); }
        .nk-timeline-year { font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--accent);
          margin-bottom:0.4rem;letter-spacing:2px; }
        .nk-timeline-title { font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;margin-bottom:0.2rem; }
        .nk-timeline-sub { color:var(--muted);font-size:0.85rem;margin-bottom:0.6rem; }
        .nk-timeline-grade { display:inline-block;padding:0.2rem 0.6rem;background:rgba(16,185,129,0.08);
          border:1px solid rgba(16,185,129,0.2);border-radius:2px;
          font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--accent3); }
        .nk-timeline-points { list-style:none;display:flex;flex-direction:column;gap:0.45rem;margin-top:0.6rem;padding:0; }
        .nk-timeline-points li { font-size:0.82rem;color:var(--muted);padding-left:1rem;position:relative;line-height:1.55; }
        .nk-timeline-points li::before { content:'▸';position:absolute;left:0;color:var(--accent); }

        .nk-contact-wrapper { display:grid;grid-template-columns:1fr 1.5fr;gap:4rem;align-items:start; }
        .nk-contact-info { display:flex;flex-direction:column;gap:2rem; }
        .contact-item { display:flex;align-items:flex-start;gap:1rem;opacity:0;transform:translateX(-20px);
          transition:opacity 0.5s,transform 0.5s; }
        .contact-item.visible { opacity:1;transform:translateX(0); }
        .nk-contact-icon { width:44px;height:44px;background:rgba(0,229,255,0.06);border:1px solid rgba(0,229,255,0.15);
          border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0; }
        .nk-contact-detail { flex:1; }
        .nk-contact-label { font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--muted);margin-bottom:0.2rem; }
        .nk-contact-value { font-size:0.9rem;color:var(--text); }
        .nk-contact-value a { color:var(--accent);text-decoration:none; }

        .nk-footer { border-top:1px solid var(--border);padding:2rem 4rem;
          display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;
          max-width:1200px;margin:0 auto; }
        .nk-footer-copy { font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--muted); }
        .nk-footer-links { display:flex;gap:1.5rem; }
        .nk-footer-links a { width:36px;height:36px;border:1px solid var(--border);border-radius:4px;
          display:flex;align-items:center;justify-content:center;color:var(--muted);
          text-decoration:none;font-size:0.85rem;transition:all 0.3s; }
        .nk-footer-links a:hover { border-color:var(--accent);color:var(--accent); }

        .scroll-top { position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;
          background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);color:var(--accent);
          display:flex;align-items:center;justify-content:center;font-size:1rem;
          opacity:0;transition:opacity 0.3s;z-index:50;
          clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px)); }
        .scroll-top.visible { opacity:1; }
        .scroll-top:hover { background:rgba(0,229,255,0.2); }

        @keyframes nk-fadeUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        @keyframes nk-fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes nk-spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes nk-drift { from{transform:translate(0,0);} to{transform:translate(40px,30px);} }

        @media(max-width:900px){
          .nk-nav { padding:1rem 2rem; }
          .nk-nav-links { display:none;position:absolute;top:100%;left:0;right:0;background:var(--bg2);
            flex-direction:column;padding:1.5rem 2rem;gap:1.5rem;border-bottom:1px solid var(--border); }
          .nk-nav-links.open { display:flex; }
          .nk-nav-toggle { display:block; }
          .nk-resume-fab { left:1.2rem;bottom:5rem; }
          .nk-resume-header { padding:1rem; }
          .nk-resume-actions { gap:0.5rem; }
          .nk-resume-action { padding:0.5rem 0.7rem;font-size:0.72rem; }
          #nk-hero { grid-template-columns:1fr;gap:2rem;padding-top:8rem; }
          .nk-hero-visual { display:none; }
          .nk-section { padding:5rem 2rem; }
          .nk-projects-grid { grid-template-columns:1fr; }
          .nk-contact-wrapper { grid-template-columns:1fr; }
          .nk-footer { flex-direction:column;gap:1rem;text-align:center; }
        }
      `}</style>

      <div ref={cursorRef} className="nk-cursor" />
      <div ref={ringRef} className="nk-cursor-ring" />
      <div className="nk-blob nk-blob1" />
      <div className="nk-blob nk-blob2" />

      {/* NAV */}
      <nav className="nk-nav">
        <div className="nk-logo">NK<span>.</span></div>
        <button className="nk-nav-toggle" onClick={() => setNavOpen(!navOpen)}>☰</button>
        <div className={`nk-nav-links${navOpen ? " open" : ""}`}>
          <a href="#nk-experience" onClick={() => setNavOpen(false)}>Experience</a>
          <a href="#nk-skills" onClick={() => setNavOpen(false)}>Skills</a>
          <a href="#nk-projects" onClick={() => setNavOpen(false)}>Projects</a>
          <a href="#nk-education" onClick={() => setNavOpen(false)}>Education</a>
          <a href="#nk-contact" onClick={() => setNavOpen(false)}>Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="nk-hero" className="nk-section">
        <div>
          <div className="nk-hero-tag">Available for opportunities</div>
          <h1>
            Nikhil<br />
            <span className="nk-line2" ref={typedRoleRef}>Kumar</span>
          </h1>
          <p className="nk-hero-desc">
            Full Stack Developer with 2 years of experience building scalable web applications
            using React.js, Node.js, Express.js, Python, Django, MongoDB and MySQL. Skilled in third-party API
            integrations (Shopify, PayPal, Stripe), authentication systems and database optimization.
          </p>
          <div className="nk-hero-btns">
            <a href="#nk-contact" className="btn-primary">Let's Connect</a>
            <a href="#nk-projects" className="btn-ghost">View Projects</a>
          </div>
        </div>
        <div className="nk-hero-visual">
          <div className="nk-orbit"><div className="nk-orbit-dot" /></div>
          <div className="nk-hero-card">
            <div className="nk-hero-avatar">
               <img src={image} alt="Nikhil Kumar" width={100} height={100} />
            </div>
            <div className="nk-hero-card-name">Nikhil Kumar</div>
            <div className="nk-hero-card-role">Full Stack Developer</div>
            <div className="nk-hero-stats">
              <div className="nk-stat"><div className="nk-stat-num"> 2 </div><div className="nk-stat-lbl">Yrs Experience</div></div>
              <div className="nk-stat"><div className="nk-stat-num">5</div><div className="nk-stat-lbl">Projects</div></div>
              <div className="nk-stat"><div className="nk-stat-num">7.25</div><div className="nk-stat-lbl">B.Tech CGPA</div></div>
              <div className="nk-stat"><div className="nk-stat-num">MERN</div><div className="nk-stat-lbl">Stack</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="nk-skills" className="nk-section">
        <div className="section-header">
          <div className="nk-section-label">02 — Expertise</div>
          <h2>Skills &amp; <span style={{ color: "var(--accent)" }}>Technologies</span></h2>
        </div>
        <div className="nk-skills-grid">
          {[
            { icon: "⚛️", cat: "Frontend Development", tags: ["HTML", "CSS", "JavaScript", "React.js", "Tailwind CSS"] },
            { icon: "🛠️", cat: "Backend Development", tags: ["Python","Django", "Node.js", "Express.js", "REST APIs", "JWT Authentication"] },
            { icon: "🗄️", cat: "Databases", tags: ["MongoDB", "MySQL"] },
            { icon: "🔧", cat: "Tools & Platforms", tags: ["Git", "GitHub", "Postman", "Shopify API", "Stripe", "PayPal"] },
            { icon: "🧠", cat: "Core CS Concepts", tags: ["Data Structures & Algorithms", "OOPs"] },
            { icon: "🚀", cat: "Deployment", tags: ["Vercel", "Hostinger", "Render"] },
          ].map((s) => (
            <div className="skill-card" key={s.cat}>
              <div className="nk-skill-icon">{s.icon}</div>
              <div className="nk-skill-category">{s.cat}</div>
              <div className="nk-skill-tags">
                {s.tags.map((t) => <span className="nk-tag" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="nk-projects" className="nk-section">
        <div className="section-header">
          <div className="nk-section-label">03 — Work</div>
          <h2>Featured <span style={{ color: "var(--accent)" }}>Projects</span></h2>
        </div>
        <div className="nk-projects-grid">
          {[
            {
              num: "01 / 03",
              name: "Spice Affair — Product Customization Platform",
              tech: "React.js · Node.js · Express.js · MongoDB · Shopify API · PayPal",
              points: [
                "Backend APIs integrating Shopify endpoints for locations, collections, languages & product tags",
                "Dynamic React.js frontend with a Canva-like drag-and-drop customization editor",
                "PayPal payment gateway with automated confirmation emails for buyers & sellers",
                "Shopify product data stored in MongoDB for efficient retrieval & performance",
              ],
            },
            {
              num: "02 / 03",
              name: "Yellow House HR Management System",
              tech: "React.js · Node.js · Express.js · MySQL",
              points: [
                "Employee scheduling system with admin approval for working hours",
                "Real-time notification dashboard for instant updates & announcements",
                "Vehicle management module for allocation & employee assignment tracking",
                "Google Forms integration with automated CV generation & download",
                "Optimized mobile responsiveness and fixed drag-and-drop UI/UX issues",
              ],
            },
            {
              num: "03 / 03",
              name: "Service Booking Management System",
              tech: "React.js · Tailwind CSS · Node.js · Express.js · MongoDB · Stripe · JWT",
              points: [
                "Full-stack app managing guest bookings with role-based access for Admin & Guest",
                "Responsive UI built with React.js and Tailwind CSS",
                "RESTful APIs handling booking workflows & business logic",
                "JWT-based authentication & authorization for secure access control",
                "Stripe integration for secure online payment processing",
              ],
            },
          ].map((p) => (
            <div className="project-card" key={p.name}>
              <div className="nk-project-num">{p.num}</div>
              <div className="nk-project-name">{p.name}</div>
              <div className="nk-project-tech">{p.tech}</div>
              <ul className="nk-project-points">
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <a href="https://github.com/Nikhilsoul" target="_blank" rel="noreferrer" className="nk-project-link">
                View on GitHub →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="nk-experience" className="nk-section">
        <div className="section-header">
          <div className="nk-section-label">01 — Journey</div>
          <h2>Work <span style={{ color: "var(--accent)" }}>Experience</span></h2>
        </div>
        <div className="nk-timeline">
          <div className="timeline-item">
            <div className="nk-timeline-dot" />
            <div className="nk-timeline-year">Apr 2025 – Present</div>
            <div className="nk-timeline-title">Full Stack Developer</div>
            <div className="nk-timeline-sub">i-Next Web Technologies Pvt. Ltd. · Chandigarh</div>
            <ul className="nk-timeline-points">
              <li>Developed & maintained scalable full-stack web apps using React.js, Node.js, Express.js & MongoDB</li>
              <li>Integrated Shopify APIs to fetch product data, collections & tags, storing structured data in MongoDB</li>
              <li>Built a dynamic React.js interface with drag-and-drop, Canva-like editing for product design</li>
              <li>Implemented PayPal payment gateway with automated transaction confirmation emails</li>
              <li>Developed RESTful APIs, optimized database queries, and used Git/GitHub for version control</li>
            </ul>
          </div>
          <div className="timeline-item">
            <div className="nk-timeline-dot" />
            <div className="nk-timeline-year">Mar 2023 – Jun 2023</div>
            <div className="nk-timeline-title">Full Stack Developer Intern</div>
            <div className="nk-timeline-sub">DXC Technology · Chennai, Tamil Nadu</div>
            <ul className="nk-timeline-points">
              <li>Completed a development training program focused on industry-aligned standards</li>
              <li>Gained expertise in HTML, CSS & JavaScript along with Node.js for server-side development</li>
              <li>Proficient in MySQL for database management and efficient data handling</li>
              <li>Implemented data-driven SEO strategies, resulting in a 25% increase in traffic</li>
            </ul>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="nk-education" className="nk-section">
        <div className="section-header">
          <div className="nk-section-label">04 — Background</div>
          <h2>My <span style={{ color: "var(--accent)" }}>Education</span></h2>
        </div>
        <div className="nk-timeline">
          <div className="timeline-item">
            <div className="nk-timeline-dot" />
            <div className="nk-timeline-year">2019 – 2023</div>
            <div className="nk-timeline-title">Lovely Professional University</div>
            <div className="nk-timeline-sub">B.Tech — Computer Science & Engineering · Phagwara, Punjab</div>
            <span className="nk-timeline-grade">CGPA: 7.25 / 10</span>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="nk-contact" className="nk-section" style={{ paddingBottom: "8rem" }}>
        <div className="section-header">
          <div className="nk-section-label">05 — Reach Out</div>
          <h2>Get In <span style={{ color: "var(--accent)" }}>Touch</span></h2>
        </div>
        <div className="nk-contact-wrapper">
          <div className="nk-contact-info">
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1rem" }}>
              Open to full-time roles and freelance projects. Send me a message — I'd love to hear from you!
            </p>
            {[
              { icon: "📧", label: "Email", value: "nikhilkumar4714@gmail.com", href: "mailto:nikhilkumar4714@gmail.com" },
              { icon: "📞", label: "Phone / WhatsApp", value: "+91 7481986785", href: "https://wa.me/917481986785" },
              { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/nikhilkumar11909850", href: "https://www.linkedin.com/in/nikhilkumar11909850" },
              { icon: "🐙", label: "GitHub", value: "github.com/Nikhilsoul", href: "https://github.com/Nikhilsoul" },
            ].map((c) => (
              <div className="contact-item" key={c.label}>
                <div className="nk-contact-icon">{c.icon}</div>
                <div className="nk-contact-detail">
                  <div className="nk-contact-label">{c.label}</div>
                  <div className="nk-contact-value">
                    <a href={c.href} target="_blank" rel="noreferrer">{c.value}</a>
                  </div>
                </div>
              </div>
            ))}
            <div className="contact-item">
              <div className="nk-contact-icon">📍</div>
              <div className="nk-contact-detail">
                <div className="nk-contact-label">Location</div>
                <div className="nk-contact-value">Bettiah, Bihar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="nk-footer">
        <div className="nk-footer-copy">© 2025 Nikhil Kumar — Built with ❤️</div>
        <div className="nk-footer-links">
          <a href="mailto:nikhilkumar4714@gmail.com" title="Email">📧</a>
          <a href="https://www.linkedin.com/in/nikhilkumar11909850" target="_blank" rel="noreferrer" title="LinkedIn">in</a>
          <a href="https://github.com/Nikhilsoul" target="_blank" rel="noreferrer" title="GitHub">gh</a>
          <a href="https://wa.me/917481986785" target="_blank" rel="noreferrer" title="WhatsApp">💬</a>
        </div>
      </footer>

      {showResume && (
        <div
          className="nk-resume-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowResume(false);
            }
          }}
        >
          <section className="nk-resume-panel" role="dialog" aria-modal="true" aria-labelledby="nk-resume-title">
            <div className="nk-resume-header">
              <div id="nk-resume-title" className="nk-resume-title">Resume</div>
              <div className="nk-resume-actions">
                <a
                  className="nk-resume-action"
                  href="/Nikhil_Resume_FullStack.pdf"
                  download="Nikhil_Resume_FullStack.pdf"
                >
                  Download
                </a>
                <button
                  type="button"
                  className="nk-resume-close"
                  aria-label="Close resume"
                  onClick={() => {
                    setShowResume(false);
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="nk-resume-content">
              <iframe
                className="nk-resume-frame"
                src="/Nikhil_Resume_FullStack.pdf#toolbar=0&navpanes=0&scrollbar=0"
                title="Nikhil Kumar resume"
              />
            </div>
          </section>
        </div>
      )}

      <button
        type="button"
        className="nk-resume-fab"
        aria-label="Open resume"
        title="Resume"
        onClick={() => setShowResume(true)}
      >
        Resume
      </button>

      <button
        className={`scroll-top${showScrollTop ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </div>
  );
}
