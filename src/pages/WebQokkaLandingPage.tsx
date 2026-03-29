import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   UTILITY: simple intersection-observer hook
───────────────────────────────────────────── */
function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─────────────────────────────────────────────
   GLOBAL STYLES injected once
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green: #22c55e;
      --green-light: #86efac;
      --green-dark: #16a34a;
      --ink: #0a0f0d;
      --ink-muted: #4b5563;
      --surface: #f8faf9;
      --card: #ffffff;
      --border: #e5e7eb;
      --radius-md: 16px;
      --radius-lg: 24px;
      --radius-xl: 32px;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--surface);
      color: var(--ink);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    h1, h2, h3, h4, h5 {
      font-family: 'Bricolage Grotesque', sans-serif;
      letter-spacing: -0.02em;
    }

    ::selection { background: #bbf7d0; color: var(--ink); }

    /* Scroll bar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--green-light); border-radius: 99px; }

    /* Fade-up animation */
    .fade-up { opacity: 0; transform: translateY(32px); transition: opacity 0.65s ease, transform 0.65s ease; }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    .fade-up.d1 { transition-delay: 0.05s; }
    .fade-up.d2 { transition-delay: 0.15s; }
    .fade-up.d3 { transition-delay: 0.25s; }
    .fade-up.d4 { transition-delay: 0.35s; }
    .fade-up.d5 { transition-delay: 0.45s; }
    .fade-up.d6 { transition-delay: 0.55s; }

    /* Card hover */
    .card-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .card-lift:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.10); }

    /* Green pill badge */
    .pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 99px;
      background: #dcfce7; color: var(--green-dark);
      font-size: 13px; font-weight: 500; letter-spacing: 0;
    }
    .pill::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--green); display: block; }

    /* CTA primary */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 99px;
      background: var(--ink); color: #fff;
      font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
      border: none; cursor: pointer;
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
    }
    .btn-primary:hover { background: #1a2e24; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.18); }

    /* CTA ghost */
    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 99px;
      background: transparent; color: var(--ink);
      font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
      border: 1.5px solid var(--border); cursor: pointer;
      transition: border-color 0.2s, background 0.2s, transform 0.2s;
      text-decoration: none;
    }
    .btn-ghost:hover { border-color: var(--ink); background: #f1f5f2; transform: translateY(-2px); }

    /* Green CTA */
    .btn-green {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 99px;
      background: var(--green); color: #fff;
      font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
      border: none; cursor: pointer;
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
    }
    .btn-green:hover { background: var(--green-dark); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(34,197,94,0.35); }

    /* Input */
    .form-input {
      width: 100%; padding: 13px 16px; border-radius: var(--radius-md);
      border: 1.5px solid var(--border); background: #fff;
      font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--ink);
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px #dcfce7; }
    .form-input::placeholder { color: #9ca3af; }

    /* Nav link */
    .nav-link {
      font-size: 14px; font-weight: 500; color: var(--ink-muted);
      text-decoration: none; transition: color 0.2s;
      position: relative;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px;
      background: var(--green); border-radius: 99px; transition: width 0.25s;
    }
    .nav-link:hover { color: var(--ink); }
    .nav-link:hover::after { width: 100%; }

    /* Section wrapper */
    .section { padding: 96px 24px; max-width: 1180px; margin: 0 auto; }

    /* Grid helpers */
    @media (max-width: 768px) {
      .section { padding: 64px 20px; }
      .hide-mobile { display: none !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   LOGO / MASCOT
───────────────────────────────────────────── */
const Logo = ({ size = 32 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
    {/* Quokka face SVG mascot */}
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="12" fill="#0a0f0d"/>
      <ellipse cx="20" cy="22" rx="11" ry="10" fill="#22c55e"/>
      <ellipse cx="15" cy="15" rx="5" ry="6" fill="#22c55e"/>
      <ellipse cx="25" cy="15" rx="5" ry="6" fill="#22c55e"/>
      <ellipse cx="15" cy="15" rx="3" ry="4" fill="#0a0f0d"/>
      <ellipse cx="25" cy="15" rx="3" ry="4" fill="#0a0f0d"/>
      <circle cx="20" cy="23" r="4" fill="#0a0f0d"/>
      <circle cx="18.5" cy="22.5" r="1.5" fill="white"/>
      <circle cx="21.5" cy="22.5" r="1.5" fill="white"/>
      <path d="M17 26 Q20 28.5 23 26" stroke="#0a0f0d" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="14" cy="18" r="2.5" fill="#86efac"/>
      <circle cx="26" cy="18" r="2.5" fill="#86efac"/>
    </svg>
    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: size * 0.56, letterSpacing: "-0.03em", color: "#0a0f0d" }}>
      Web Quokka
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
type NavAnim = { id: number; x: number; y: number; label: string; dx: number; dy: number };

const NAV_ANIMS = [
  { dx: 0,   dy: -60 },  // up
  { dx: 0,   dy:  60 },  // down
  { dx: -60, dy:   0 },  // left
  { dx:  60, dy:   0 },  // right
  { dx: -50, dy: -50 },  // up-left
  { dx:  50, dy: -50 },  // up-right
  { dx: -50, dy:  50 },  // down-left
  { dx:  50, dy:  50 },  // down-right
];

const SLIDE_DIRS = ['left', 'right', 'top', 'bottom'] as const;
type SlideDir = typeof SLIDE_DIRS[number];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [particles, setParticles] = useState<NavAnim[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [overlay, setOverlay] = useState<{ dir: SlideDir; phase: 'enter' | 'exit' } | null>(null);
  const pidRef = useRef(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const spawnParticles = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 4 + Math.floor(Math.random() * 3);
    const shuffled = [...NAV_ANIMS].sort(() => Math.random() - 0.5).slice(0, count);
    const newParticles: NavAnim[] = shuffled.map(({ dx, dy }) => ({
      id: ++pidRef.current,
      x: cx, y: cy, label,
      dx: dx + (Math.random() - 0.5) * 20,
      dy: dy + (Math.random() - 0.5) * 20,
    }));
    setParticles(p => [...p, ...newParticles]);
    setTimeout(() => {
      setParticles(p => p.filter(pt => !newParticles.find(n => n.id === pt.id)));
    }, 700);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    spawnParticles(e, label);
    const dir = SLIDE_DIRS[Math.floor(Math.random() * SLIDE_DIRS.length)];
    setOverlay({ dir, phase: 'enter' });
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'instant' });
      setOpen(false);
      setOverlay({ dir, phase: 'exit' });
      setTimeout(() => setOverlay(null), 480);
    }, 420);
  };

  const links = [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
    {/* Particle layer */}
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
      {particles.map(pt => (
        <span key={pt.id} style={{
          position: "fixed",
          left: pt.x, top: pt.y,
          transform: "translate(-50%, -50%)",
          fontSize: 11, fontWeight: 700,
          color: "#22c55e",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          animation: `navpop-${pt.id % 8} 0.65s ease-out forwards`,
          "--dx": `${pt.dx}px`,
          "--dy": `${pt.dy}px`,
        } as React.CSSProperties}>
          {pt.label}
        </span>
      ))}
      <style>{`
        @keyframes navpop { 0% { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1); } 100% { opacity:0; transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(0.5); } }
        ${Array.from({length:8},(_,i)=>`@keyframes navpop-${i} { 0% { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1); } 100% { opacity:0; transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(0.4); } }`).join('')}
        @keyframes nav-slide-down { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes nav-fade-in    { from { opacity:0; transform:translateY(-8px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes ov-enter-left   { from { transform:translateX(-100%); } to { transform:translateX(0%); } }
        @keyframes ov-exit-left    { from { transform:translateX(0%); } to { transform:translateX(100%); } }
        @keyframes ov-enter-right  { from { transform:translateX(100%); } to { transform:translateX(0%); } }
        @keyframes ov-exit-right   { from { transform:translateX(0%); } to { transform:translateX(-100%); } }
        @keyframes ov-enter-top    { from { transform:translateY(-100%); } to { transform:translateY(0%); } }
        @keyframes ov-exit-top     { from { transform:translateY(0%); } to { transform:translateY(100%); } }
        @keyframes ov-enter-bottom { from { transform:translateY(100%); } to { transform:translateY(0%); } }
        @keyframes ov-exit-bottom  { from { transform:translateY(0%); } to { transform:translateY(-100%); } }
      `}</style>
    {overlay && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 8999,
        background: 'linear-gradient(135deg, #0a0f0d 0%, #16a34a 100%)',
        animation: `ov-${overlay.phase}-${overlay.dir} 0.42s cubic-bezier(0.76,0,0.24,1) forwards`,
        pointerEvents: 'none',
      }} />
    )}
    </div>

    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "12px 32px" : "20px 32px",
      background: scrolled ? "rgba(248,250,249,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid #e5e7eb" : "none",
      transition: "all 0.3s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      opacity: loaded ? 1 : 0,
      animation: loaded ? "nav-slide-down 0.55s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
    }}>
      <a href="#" style={{ textDecoration: "none" }}><Logo /></a>

      {/* Desktop links */}
      <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {links.map((l, i) => (
          <a key={l.label} href={l.href} className="nav-link"
            onClick={e => handleNavClick(e, l.href, l.label)}
            style={{
              opacity: loaded ? 1 : 0,
              animation: loaded ? `nav-fade-in 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.07}s both` : "none",
            }}>
            {l.label}
          </a>
        ))}
      </div>

      <div className="hide-mobile" style={{
        opacity: loaded ? 1 : 0,
        animation: loaded ? `nav-fade-in 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + links.length * 0.07}s both` : "none",
      }}>
        <a href="#contact" className="btn-green" style={{ padding: "11px 22px", fontSize: 14 }}>
          Get a Free Quote ↗
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
        className="show-mobile"
        aria-label="Toggle menu"
      >
        <div style={{ width: 24, height: 2, background: "#0a0f0d", marginBottom: 5, borderRadius: 2, transition: "transform 0.2s", transform: open ? "rotate(45deg) translateY(7px)" : "none" }} />
        <div style={{ width: 24, height: 2, background: "#0a0f0d", marginBottom: 5, borderRadius: 2, opacity: open ? 0 : 1, transition: "opacity 0.2s" }} />
        <div style={{ width: 24, height: 2, background: "#0a0f0d", borderRadius: 2, transition: "transform 0.2s", transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: "fixed", top: 70, left: 16, right: 16,
          background: "#fff", borderRadius: 20, padding: "24px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
          border: "1px solid #e5e7eb",
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} className="nav-link"
              onClick={e => handleNavClick(e, l.href, l.label)}
              style={{ display: "block", padding: "12px 0", fontSize: 16, borderBottom: "1px solid #f3f4f6" }}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-green" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
            onClick={() => setOpen(false)}>
            Get a Free Quote
          </a>
        </div>
      )}

      <style>{`.show-mobile { display: flex !important; flex-direction: column; } @media (min-width: 769px) { .show-mobile { display: none !important; } }`}</style>
    </nav>
    </>
  );
};

/* ─────────────────────────────────────────────
   BROWSER MOCK (Hero visual)
───────────────────────────────────────────── */
const BrowserMock = () => (
  <div style={{
    background: "#fff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.13)",
    overflow: "hidden", border: "1px solid #e5e7eb",
    fontFamily: "'DM Sans', sans-serif",
  }}>
    {/* Browser chrome */}
    <div style={{ background: "#f3f4f6", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", gap: 7 }}>
        {["#fc5c65","#ffd32a","#05c46b"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
      </div>
      <div style={{ flex: 1, background: "#fff", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#9ca3af", border: "1px solid #e5e7eb" }}>
        🔒 yourbusiness.com
      </div>
    </div>
    {/* Browser content */}
    <div style={{ padding: "28px 24px" }}>
      {/* Mock nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ width: 80, height: 10, background: "#0a0f0d", borderRadius: 99 }} />
        <div style={{ display: "flex", gap: 16 }}>
          {[50,40,50].map((w,i) => <div key={i} style={{ width: w, height: 8, background: "#e5e7eb", borderRadius: 99 }} />)}
          <div style={{ width: 64, height: 28, background: "#22c55e", borderRadius: 99 }} />
        </div>
      </div>
      {/* Hero area */}
      <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderRadius: 16, padding: "28px 24px", marginBottom: 20 }}>
        <div style={{ width: "60%", height: 14, background: "#0a0f0d", borderRadius: 99, marginBottom: 10 }} />
        <div style={{ width: "80%", height: 10, background: "#4b5563", borderRadius: 99, marginBottom: 6, opacity: 0.5 }} />
        <div style={{ width: "65%", height: 10, background: "#4b5563", borderRadius: 99, marginBottom: 20, opacity: 0.4 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 90, height: 34, background: "#0a0f0d", borderRadius: 99 }} />
          <div style={{ width: 90, height: 34, background: "transparent", border: "1.5px solid #d1d5db", borderRadius: 99 }} />
        </div>
      </div>
      {/* Cards row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { c: "#f0fdf4", label: "Web Design" },
          { c: "#fef9c3", label: "E-commerce" },
          { c: "#eff6ff", label: "Mobile App" },
        ].map((card) => (
          <div key={card.label} style={{ background: card.c, borderRadius: 12, padding: "16px 14px" }}>
            <div style={{ width: 24, height: 24, background: "#e5e7eb", borderRadius: 8, marginBottom: 10 }} />
            <div style={{ width: "75%", height: 8, background: "#0a0f0d", borderRadius: 99, marginBottom: 6, opacity: 0.7 }} />
            <div style={{ width: "55%", height: 6, background: "#9ca3af", borderRadius: 99 }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
const Hero = () => {
  const [ref, inView] = useInView(0.05);

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(160deg, #f8faf9 0%, #f0fdf4 50%, #f8faf9 100%)",
      position: "relative", overflow: "hidden", paddingTop: 80,
    }} ref={ref}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: -200, right: -200, width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, #dcfce7 0%, transparent 70%)",
        opacity: 0.6, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -100, width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, #bbf7d0 0%, transparent 70%)",
        opacity: 0.4, pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1180, margin: "0 auto", padding: "80px 32px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
        width: "100%",
      }}>
        {/* Left */}
        <div>
          <div className={`fade-up${inView ? " visible" : ""} d1`} style={{ marginBottom: 24 }}>
            <span className="pill">Websites for every business</span>
          </div>
          <h1 className={`fade-up${inView ? " visible" : ""} d2`} style={{
            fontSize: "clamp(42px, 5vw, 68px)", fontWeight: 800, lineHeight: 1.08,
            marginBottom: 24, color: "#0a0f0d",
          }}>
            Every business deserves a{" "}
            <span style={{ color: "#22c55e", position: "relative" }}>
              website
              <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 8 }} viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 6 Q100 0 200 6" stroke="#86efac" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>{" "}
            that works.
          </h1>
          <p className={`fade-up${inView ? " visible" : ""} d3`} style={{
            fontSize: 18, color: "#4b5563", lineHeight: 1.7, marginBottom: 40, maxWidth: 480,
          }}>
            We build affordable, high-quality websites and apps for small businesses — so you can focus on what you do best. No bloat, no jargon, no surprises.
          </p>
          <div className={`fade-up${inView ? " visible" : ""} d4`} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#contact" className="btn-green">Start Your Project →</a>
            <a href="#services" className="btn-ghost">View Services</a>
          </div>
          <div className={`fade-up${inView ? " visible" : ""} d5`} style={{ marginTop: 48, display: "flex", gap: 32 }}>
            {[["50+","Projects delivered"], ["100%","Client satisfaction"], ["24h","Response time"]].map(([n, l]) => (
              <div key={n}>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: "#0a0f0d" }}>{n}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className={`fade-up${inView ? " visible" : ""} d3 hide-mobile`}>
          <BrowserMock />
        </div>
      </div>

      <style>{`@media(max-width:768px){ #hero > div { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SERVICES SECTION
───────────────────────────────────────────── */
const services = [
  {
    icon: "🖥️",
    title: "Website Design & Development",
    desc: "Beautiful, fast, and SEO-friendly websites tailored to your brand. From landing pages to complex multi-page sites.",
    tag: "Most Popular",
    bg: "#f0fdf4",
  },
  {
    icon: "🛍️",
    title: "E-commerce Development",
    desc: "Sell online with confidence. We build stores that are easy to manage and optimised for conversions.",
    bg: "#fef9c3",
  },
  {
    icon: "⚙️",
    title: "Web Application Development",
    desc: "Custom web apps built to solve real business problems. Scalable, secure, and user-friendly.",
    bg: "#eff6ff",
  },
  {
    icon: "📱",
    title: "Mobile App Development",
    desc: "Cross-platform mobile apps that feel native. Built with modern tools for iOS and Android.",
    bg: "#fdf4ff",
  },
  {
    icon: "🔧",
    title: "Website & App Maintenance",
    desc: "We keep your digital presence running smoothly — updates, security patches, and performance monitoring.",
    bg: "#fff7ed",
  },
  {
    icon: "☁️",
    title: "Hosting & Backend (Firebase)",
    desc: "Fast, reliable, and scalable hosting powered by Firebase. We handle the infrastructure so you don't have to.",
    bg: "#f0fdf4",
  },
];

const Services = () => {
  const [ref, inView] = useInView();

  return (
    <section id="services" style={{ background: "#fff", paddingBottom: 0 }}>
      <div className="section" ref={ref}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">What we do</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, marginTop: 16, marginBottom: 16 }}>
            Services built for <span style={{ color: "#22c55e" }}>real businesses</span>
          </h2>
          <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>
            Everything you need to get online — and stay ahead. We're a one-stop shop for your digital journey.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`card-lift fade-up${inView ? " visible" : ""} d${(i % 4) + 1}`}
              style={{
                background: s.bg, borderRadius: 24, padding: "32px 28px",
                border: "1px solid rgba(0,0,0,0.05)", position: "relative", cursor: "default",
              }}
            >
              {s.tag && (
                <span style={{
                  position: "absolute", top: 20, right: 20,
                  background: "#0a0f0d", color: "#fff",
                  fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
                }}>
                  {s.tag}
                </span>
              )}
              <div style={{ fontSize: 36, marginBottom: 20 }}>{s.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, color: "#4b5563", lineHeight: 1.65 }}>{s.desc}</p>
              <div style={{ marginTop: 24 }}>
                <a href="#contact" style={{ fontSize: 13, fontWeight: 600, color: "#22c55e", textDecoration: "none" }}>
                  Learn more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   WHY US SECTION
───────────────────────────────────────────── */
const whyUs = [
  {
    icon: "💰",
    title: "Affordable Pricing",
    desc: "Premium quality without the agency price tag. Transparent quotes, no hidden fees — ever.",
  },
  {
    icon: "✨",
    title: "Simple Process",
    desc: "We cut through the complexity. Our 5-step process takes you from idea to launch without the stress.",
  },
  {
    icon: "🤝",
    title: "Ongoing Support",
    desc: "We don't disappear after launch. Your success is our success — we're with you for the long haul.",
  },
  {
    icon: "🎨",
    title: "Modern Design",
    desc: "Clean, professional, and conversion-focused. Every site we build is designed to impress and perform.",
  },
];

const WhyUs = () => {
  const [ref, inView] = useInView();

  return (
    <section id="why-us" style={{ background: "var(--surface)" }}>
      <div className="section" ref={ref}>
        <div style={{
          background: "#0a0f0d", borderRadius: 32, padding: "80px 64px",
          overflow: "hidden", position: "relative",
        }}>
          {/* Decorative blob */}
          <div style={{
            position: "absolute", top: -80, right: -80, width: 300, height: 300,
            borderRadius: "50%", background: "radial-gradient(circle, #22c55e40, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: -60, left: -60, width: 200, height: 200,
            borderRadius: "50%", background: "radial-gradient(circle, #22c55e30, transparent 70%)",
          }} />

          <div style={{ textAlign: "center", marginBottom: 64, position: "relative" }}>
            <div className={`fade-up${inView ? " visible" : ""}`}>
              <span className="pill" style={{ background: "#1a2e24", color: "#86efac" }}>Why Web Quokka</span>
            </div>
            <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{
              fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 800, color: "#fff",
              marginTop: 16, marginBottom: 12,
            }}>
              Built different. <span style={{ color: "#22c55e" }}>On purpose.</span>
            </h2>
            <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#9ca3af", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              We obsess over the details so you can focus on running your business.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {whyUs.map((w, i) => (
              <div
                key={w.title}
                className={`card-lift fade-up${inView ? " visible" : ""} d${i + 1}`}
                style={{
                  background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "28px 24px",
                  border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{w.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{w.title}</h3>
                <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.65 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PROCESS SECTION
───────────────────────────────────────────── */
const steps = [
  { num: "01", title: "Discover", desc: "We learn everything about your business, goals, and audience through a detailed brief and discovery call." },
  { num: "02", title: "Design", desc: "We craft pixel-perfect mockups based on your brand. You get to see and approve everything before a single line of code." },
  { num: "03", title: "Build", desc: "Our team brings the design to life — fast, clean code with performance and accessibility baked in." },
  { num: "04", title: "Launch", desc: "We handle deployment, testing, and final checks. Your site goes live on time, every time." },
  { num: "05", title: "Maintain", desc: "Post-launch support, updates, and growth features. We're your long-term digital partner." },
];

const Process = () => {
  const [ref, inView] = useInView();
  const [active, setActive] = useState(0);

  return (
    <section id="process" style={{ background: "#fff" }}>
      <div className="section" ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">How it works</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
            Simple process, <span style={{ color: "#22c55e" }}>real results</span>
          </h2>
          <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, maxWidth: 460, margin: "0 auto" }}>
            Five clear steps from idea to a live, thriving digital presence.
          </p>
        </div>

        <div className={`fade-up${inView ? " visible" : ""} d2`} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start",
        }}>
          {/* Step list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {steps.map((s, i) => (
              <button
                key={s.num}
                onClick={() => setActive(i)}
                style={{
                  textAlign: "left", background: active === i ? "#f0fdf4" : "transparent",
                  border: active === i ? "1.5px solid #86efac" : "1.5px solid transparent",
                  borderRadius: 16, padding: "20px 24px", cursor: "pointer",
                  transition: "all 0.25s", display: "flex", alignItems: "center", gap: 20,
                }}
              >
                <span style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: active === i ? "#22c55e" : "#f3f4f6",
                  color: active === i ? "#fff" : "#9ca3af",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 13,
                  transition: "all 0.25s",
                }}>
                  {s.num}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: "#0a0f0d", marginBottom: 2 }}>{s.title}</div>
                  {active === i && <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6 }}>{s.desc}</div>}
                </div>
              </button>
            ))}
          </div>

          {/* Visual */}
          <div className="hide-mobile" style={{
            background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
            borderRadius: 28, padding: 48, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", minHeight: 380, textAlign: "center",
          }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>
              {["🔍","🎨","⚡","🚀","🛡️"][active]}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: "#0a0f0d", marginBottom: 10 }}>
              {steps[active].title}
            </div>
            <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.65, maxWidth: 260 }}>
              {steps[active].desc}
            </p>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){ #process > div > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   TEAM SECTION
───────────────────────────────────────────── */
const teamMembers = [
  {
    name: "Alex Carter",
    role: "Lead Developer",
    avatar: "AC",
    avatarBg: "#22c55e",
    bio: "Full-stack engineer with 8+ years building fast, scalable web apps. Obsessed with clean code and performance.",
    skills: ["React", "Node.js", "AWS"],
  },
  {
    name: "Maya Patel",
    role: "UX & Design Lead",
    avatar: "MP",
    avatarBg: "#a855f7",
    bio: "Designer who bridges aesthetics and usability. Every pixel has a purpose — her work converts visitors into customers.",
    skills: ["Figma", "Branding", "UI/UX"],
  },
  {
    name: "Jordan Wu",
    role: "Growth & SEO",
    avatar: "JW",
    avatarBg: "#f97316",
    bio: "Data-driven strategist focused on organic growth. Helps clients rank, get found, and turn traffic into revenue.",
    skills: ["SEO", "Analytics", "CRO"],
  },
];

const Team = () => {
  const [ref, inView] = useInView();
  return (
    <section id="team" style={{ background: "#f9fafb" }}>
      <div className="section" ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Our team</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
            The people behind <span style={{ color: "#22c55e" }}>your success</span>
          </h2>
          <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, maxWidth: 460, margin: "0 auto" }}>
            A small, focused team that cares deeply about delivering results for every client.
          </p>
        </div>

        <div className={`fade-up${inView ? " visible" : ""} d2`} style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28,
        }}>
          {teamMembers.map((m) => (
            <div key={m.name} style={{
              background: "#fff", borderRadius: 24, padding: "36px 28px",
              border: "1px solid #e5e7eb", textAlign: "center",
              transition: "box-shadow 0.25s, transform 0.25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(34,197,94,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: m.avatarBg, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 20,
                margin: "0 auto 16px",
              }}>
                {m.avatar}
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#0a0f0d", marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 13, color: m.avatarBg, fontWeight: 600, marginBottom: 14 }}>{m.role}</div>
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.65, marginBottom: 20 }}>{m.bio}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {m.skills.map(skill => (
                  <span key={skill} style={{
                    background: "#f0fdf4", color: "#16a34a", borderRadius: 8,
                    padding: "4px 12px", fontSize: 12, fontWeight: 600,
                  }}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){ #team > div > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   TESTIMONIALS SECTION
───────────────────────────────────────────── */
const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Owner, Bloom Florist",
    avatar: "SM",
    color: "#fdf4ff",
    avatarBg: "#e879f9",
    text: "Web Quokka built our online store in just two weeks. Sales went up 40% in the first month. They made the whole process easy and stress-free.",
    stars: 5,
  },
  {
    name: "James Torres",
    role: "Founder, Torres Plumbing Co.",
    avatar: "JT",
    color: "#eff6ff",
    avatarBg: "#60a5fa",
    text: "I was sceptical at first, but the team delivered a professional site that actually gets us new leads. Best investment we've made.",
    stars: 5,
  },
  {
    name: "Priya Nair",
    role: "CEO, NairFit Studio",
    avatar: "PN",
    color: "#f0fdf4",
    avatarBg: "#22c55e",
    text: "Our booking app is slick, fast, and our clients love it. The ongoing support has been incredible — they're always there when we need them.",
    stars: 5,
  },
  {
    name: "Marcus Lee",
    role: "Director, Lee's Café Group",
    avatar: "ML",
    color: "#fff7ed",
    avatarBg: "#f97316",
    text: "From design to hosting, Web Quokka handled everything. The site looks premium and we didn't break the bank. Highly recommend.",
    stars: 5,
  },
];

const Testimonials = () => {
  const [ref, inView] = useInView();

  return (
    <section id="testimonials" style={{ background: "var(--surface)" }}>
      <div className="section" ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Client Stories</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
            Trusted by small businesses <span style={{ color: "#22c55e" }}>everywhere</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`card-lift fade-up${inView ? " visible" : ""} d${i + 1}`}
              style={{
                background: t.color, borderRadius: 24, padding: "28px 24px",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              {/* Stars */}
              <div style={{ marginBottom: 16, display: "flex", gap: 2 }}>
                {Array(t.stars).fill(0).map((_, si) => (
                  <span key={si} style={{ color: "#eab308", fontSize: 14 }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 24 }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", background: t.avatarBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#0a0f0d" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────── */
const Contact = () => {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // ── Firebase / backend integration point ──
    // Replace the timeout below with your Firebase Firestore write or Cloud Function call:
    // import { addDoc, collection } from "firebase/firestore";
    // await addDoc(collection(db, "enquiries"), { ...form, createdAt: new Date() });
    await new Promise(r => setTimeout(r, 1400));
    setStatus("success");
  };

  return (
    <section id="contact" style={{ background: "#fff" }}>
      <div className="section" ref={ref}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          {/* Left */}
          <div>
            <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Get in touch</span></div>
            <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, marginTop: 16, marginBottom: 16, lineHeight: 1.1 }}>
              Let's build something <span style={{ color: "#22c55e" }}>great together.</span>
            </h2>
            <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
              Tell us about your project and we'll get back to you within 24 hours with a free, no-obligation quote.
            </p>

            {/* Contact points */}
            <div className={`fade-up${inView ? " visible" : ""} d3`} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "📧", label: "Email", value: "hello@webquokka.com.au" },
                { icon: "📍", label: "Based in", value: "Wollongong, NSW, Australia" },
                { icon: "⏱️", label: "Response time", value: "Within 24 hours" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className={`fade-up${inView ? " visible" : ""} d2`}>
            {status === "success" ? (
              <div style={{
                background: "#f0fdf4", borderRadius: 24, padding: "64px 40px",
                textAlign: "center", border: "1.5px solid #86efac",
              }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Message received!</h3>
                <p style={{ color: "#4b5563", lineHeight: 1.65 }}>Thanks for reaching out. We'll be in touch within 24 hours.</p>
                <div style={{ marginTop: 32, padding: "24px", background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0a0f0d", marginBottom: 6 }}>Happy with Web Quokka so far?</p>
                  <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Your Google review helps other small businesses find us — it means the world. 🙏</p>
                  <a
                    href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ fontSize: 14, padding: "11px 22px", width: "100%", justifyContent: "center" }}
                  >
                    ⭐ Leave us a Google Review
                  </a>
                </div>
                <button onClick={() => setStatus("idle")} className="btn-ghost" style={{ marginTop: 12, width: "100%", justifyContent: "center", fontSize: 14 }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                background: "var(--surface)", borderRadius: 24, padding: "40px 36px",
                border: "1px solid #e5e7eb",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Your Name *</label>
                    <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" required />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Business Name</label>
                    <input className="form-input" name="business" value={form.business} onChange={handleChange} placeholder="Smith & Co." />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Email *</label>
                    <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Phone</label>
                    <input className="form-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="04xx xxx xxx" />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Service Needed *</label>
                  <select className="form-input" name="service" value={form.service} onChange={handleChange} required style={{ appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: 18 }}>
                    <option value="">Select a service…</option>
                    <option>Website Design & Development</option>
                    <option>E-commerce Development</option>
                    <option>Web Application Development</option>
                    <option>Mobile App Development</option>
                    <option>Website & App Maintenance</option>
                    <option>Hosting & Backend (Firebase)</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Tell us about your project *</label>
                  <textarea
                    className="form-input"
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Briefly describe what you need…"
                    required rows={4}
                    style={{ resize: "vertical" }}
                  />
                </div>
                <button type="submit" className="btn-green" style={{ width: "100%", justifyContent: "center", opacity: status === "loading" ? 0.75 : 1 }} disabled={status === "loading"}>
                  {status === "loading" ? "Sending…" : "Send Message →"}
                </button>
                <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 14 }}>
                  No spam. No commitment. We'll reply within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){ #contact > div > div { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PRICING SECTION
───────────────────────────────────────────── */
const plans = [
  {
    name: "Starter",
    price: "$999",
    period: "one-time",
    desc: "Perfect for small businesses needing a clean online presence fast.",
    color: "#f9fafb",
    border: "#e5e7eb",
    badge: null,
    features: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Contact form",
      "Basic SEO setup",
      "1 round of revisions",
      "14-day delivery",
    ],
    cta: "Get Started",
    ctaStyle: "btn-ghost",
  },
  {
    name: "Growth",
    price: "$2,499",
    period: "one-time",
    desc: "For growing businesses that need more features and a stronger online presence.",
    color: "#0a0f0d",
    border: "#0a0f0d",
    badge: "Most Popular",
    features: [
      "Up to 12 pages",
      "Custom UI design",
      "CMS / blog integration",
      "Google Analytics setup",
      "On-page SEO",
      "3 rounds of revisions",
      "21-day delivery",
    ],
    cta: "Get Started",
    ctaStyle: "btn-green",
  },
  {
    name: "Pro",
    price: "Custom",
    period: "project",
    desc: "Fully custom web apps, e-commerce, or complex integrations — scoped to your needs.",
    color: "#f9fafb",
    border: "#e5e7eb",
    badge: null,
    features: [
      "Unlimited pages",
      "E-commerce / web app",
      "Custom integrations & APIs",
      "Advanced SEO strategy",
      "Priority support",
      "Ongoing maintenance",
      "Dedicated project manager",
    ],
    cta: "Talk to Us",
    ctaStyle: "btn-primary",
  },
];

const Pricing = () => {
  const [ref, inView] = useInView();
  return (
    <section id="pricing" style={{ background: "#fff" }}>
      <div className="section" ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Pricing</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
            Simple pricing, <span style={{ color: "#22c55e" }}>no surprises</span>
          </h2>
          <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, maxWidth: 460, margin: "0 auto" }}>
            Transparent packages built for businesses of every size. Pay once, own it forever.
          </p>
        </div>

        <div className={`fade-up${inView ? " visible" : ""} d2`} style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start",
        }}>
          {plans.map((p) => (
            <div key={p.name} style={{
              background: p.color, border: `1.5px solid ${p.border}`,
              borderRadius: 28, padding: "36px 32px", position: "relative",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = p.color === "#0a0f0d" ? "0 16px 48px rgba(0,0,0,0.35)" : "0 16px 48px rgba(34,197,94,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {p.badge && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "#22c55e", color: "#fff", borderRadius: 99, padding: "5px 16px",
                  fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                }}>{p.badge}</div>
              )}
              <div style={{ color: p.color === "#0a0f0d" ? "#9ca3af" : "#6b7280", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: p.color === "#0a0f0d" ? "#fff" : "#0a0f0d" }}>{p.price}</span>
                <span style={{ fontSize: 13, color: p.color === "#0a0f0d" ? "#6b7280" : "#9ca3af" }}>{p.period}</span>
              </div>
              <p style={{ fontSize: 14, color: p.color === "#0a0f0d" ? "#9ca3af" : "#4b5563", lineHeight: 1.6, marginBottom: 28 }}>{p.desc}</p>
              <ul style={{ listStyle: "none", marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: p.color === "#0a0f0d" ? "#d1fae5" : "#374151" }}>
                    <span style={{ color: "#22c55e", flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className={p.ctaStyle} style={{ width: "100%", justifyContent: "center" }}>{p.cta} →</a>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){ #pricing > div > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PORTFOLIO SECTION
───────────────────────────────────────────── */
const portfolioItems = [
  {
    title: "Bloom Florist",
    category: "E-commerce",
    desc: "Online flower shop with real-time inventory, local delivery booking, and a mobile-first checkout.",
    emoji: "🌸",
    bg: "#fdf4ff",
    accent: "#a855f7",
    tags: ["React", "Shopify", "SEO"],
  },
  {
    title: "Torres Plumbing",
    category: "Business Website",
    desc: "Lead-generation site with click-to-call, service area maps, and Google Reviews integration.",
    emoji: "🔧",
    bg: "#eff6ff",
    accent: "#3b82f6",
    tags: ["Next.js", "Tailwind", "Google APIs"],
  },
  {
    title: "NairFit Studio",
    category: "Booking App",
    desc: "Fitness booking platform with class scheduling, member portal, and Stripe payment integration.",
    emoji: "💪",
    bg: "#f0fdf4",
    accent: "#22c55e",
    tags: ["React", "Firebase", "Stripe"],
  },
  {
    title: "Lee's Café Group",
    category: "Multi-location Site",
    desc: "Premium restaurant group site with interactive menus, reservation forms, and a loyalty program.",
    emoji: "☕",
    bg: "#fff7ed",
    accent: "#f97316",
    tags: ["CMS", "Animations", "Maps"],
  },
  {
    title: "SolarSave Co.",
    category: "Web Application",
    desc: "Solar savings calculator with postcode lookup, energy data API, and instant quote generation.",
    emoji: "☀️",
    bg: "#fefce8",
    accent: "#eab308",
    tags: ["React", "REST API", "Charts"],
  },
  {
    title: "Anchor Real Estate",
    category: "Property Portal",
    desc: "Property listing platform with advanced filters, virtual tour embeds, and agent contact flows.",
    emoji: "🏡",
    bg: "#f0f9ff",
    accent: "#0ea5e9",
    tags: ["Next.js", "Algolia", "Maps"],
  },
];

const Portfolio = () => {
  const [ref, inView] = useInView();
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = ["All", "E-commerce", "Business Website", "Booking App", "Web Application", "Multi-location Site", "Property Portal"];
  const filtered = activeFilter === "All" ? portfolioItems : portfolioItems.filter(i => i.category === activeFilter);

  return (
    <section id="portfolio" style={{ background: "#f9fafb" }}>
      <div className="section" ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Portfolio</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
            Work we're <span style={{ color: "#22c55e" }}>proud of</span>
          </h2>
          <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, maxWidth: 460, margin: "0 auto 32px" }}>
            Real projects, real clients, real results — from local businesses to growing brands.
          </p>

          {/* Filter pills */}
          <div className={`fade-up${inView ? " visible" : ""} d3`} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1.5px solid",
                borderColor: activeFilter === cat ? "#22c55e" : "#e5e7eb",
                background: activeFilter === cat ? "#dcfce7" : "#fff",
                color: activeFilter === cat ? "#16a34a" : "#6b7280",
                transition: "all 0.2s",
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div className={`fade-up${inView ? " visible" : ""} d3`} style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
        }}>
          {filtered.map((item) => (
            <div key={item.title} style={{
              background: item.bg, borderRadius: 24, overflow: "hidden",
              border: "1px solid #e5e7eb", transition: "transform 0.25s, box-shadow 0.25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.10)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Preview area */}
              <div style={{
                height: 140, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 56, background: item.bg,
              }}>{item.emoji}</div>
              <div style={{ padding: "20px 24px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: item.accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{item.category}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: "#0a0f0d", marginBottom: 8 }}>{item.title}</div>
                <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{
                      background: "#fff", border: "1px solid #e5e7eb",
                      borderRadius: 8, padding: "3px 10px", fontSize: 12, color: "#6b7280", fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`fade-up${inView ? " visible" : ""} d4`} style={{ textAlign: "center", marginTop: 48 }}>
          <a href="#contact" className="btn-green">Start your project →</a>
        </div>
      </div>
      <style>{`@media(max-width:768px){ #portfolio > div > div:nth-child(3) { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   BLOG SECTION
───────────────────────────────────────────── */
const blogPosts = [
  {
    category: "SEO",
    title: "5 Reasons Your Business Website Isn't Showing Up on Google",
    excerpt: "Most small business sites make the same avoidable mistakes. Here's what's holding your rankings back — and how to fix it.",
    date: "Mar 18, 2025",
    readTime: "4 min read",
    emoji: "🔍",
    bg: "#f0fdf4",
    accent: "#22c55e",
  },
  {
    category: "Design",
    title: "First Impressions Take 0.05 Seconds — Make Yours Count",
    excerpt: "Visitors form an opinion about your site almost instantly. We break down what signals trust and what drives them away.",
    date: "Feb 28, 2025",
    readTime: "5 min read",
    emoji: "🎨",
    bg: "#fdf4ff",
    accent: "#a855f7",
  },
  {
    category: "E-commerce",
    title: "How a $1,500 Website Generated $40k in Its First Quarter",
    excerpt: "The story behind Bloom Florist's online store — what we built, why it worked, and the numbers that followed.",
    date: "Feb 10, 2025",
    readTime: "6 min read",
    emoji: "📈",
    bg: "#fff7ed",
    accent: "#f97316",
  },
];

const Blog = () => {
  const [ref, inView] = useInView();
  return (
    <section id="blog" style={{ background: "#fff" }}>
      <div className="section" ref={ref}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div>
            <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Blog</span></div>
            <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
              Insights & <span style={{ color: "#22c55e" }}>tips</span>
            </h2>
            <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, maxWidth: 400 }}>
              Plain-English advice to help your business grow online.
            </p>
          </div>
          <div className={`fade-up${inView ? " visible" : ""} d2 hide-mobile`}>
            <a href="#contact" className="btn-ghost" style={{ fontSize: 14 }}>View all posts →</a>
          </div>
        </div>

        <div className={`fade-up${inView ? " visible" : ""} d2`} style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28,
        }}>
          {blogPosts.map((post) => (
            <article key={post.title} style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 24, overflow: "hidden",
              transition: "transform 0.25s, box-shadow 0.25s", cursor: "pointer",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              {/* Thumbnail */}
              <div style={{
                height: 150, background: post.bg,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52,
              }}>{post.emoji}</div>
              <div style={{ padding: "24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: post.accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>{post.category}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0a0f0d", lineHeight: 1.45, marginBottom: 12 }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.65, marginBottom: 20 }}>{post.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#9ca3af" }}>
                  <span>{post.date}</span>
                  <span style={{ background: "#f3f4f6", borderRadius: 8, padding: "3px 10px" }}>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){ #blog > div > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => (
  <footer style={{ background: "#0a0f0d", color: "#9ca3af", padding: "60px 32px 32px" }}>
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
        {/* Brand */}
        <div>
          <Logo size={34} />
          <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
            Just like water is essential for life, a website is essential for every business. We make that simple, affordable, and beautiful.
          </p>
        </div>
        {/* Services */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Services</h4>
          {["Website Development", "E-commerce", "Web Applications", "Mobile Apps", "Maintenance", "Hosting"].map(s => (
            <a key={s} href="#services" style={{ display: "block", marginBottom: 10, fontSize: 14, color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = "#22c55e"}
              onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = "#9ca3af"}>
              {s}
            </a>
          ))}
        </div>
        {/* Company */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Company</h4>
          {[["Process", "#process"], ["Portfolio", "#portfolio"], ["Pricing", "#pricing"], ["Blog", "#blog"], ["Testimonials", "#testimonials"], ["Contact", "#contact"]].map(([l, h]) => (
            <a key={l} href={h} style={{ display: "block", marginBottom: 10, fontSize: 14, color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = "#22c55e"}
              onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = "#9ca3af"}>
              {l}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 13 }}>© {new Date().getFullYear()} Web Quokka. All rights reserved.</p>
        <a
          href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 13, color: "#9ca3af", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99,
            padding: "7px 16px", transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#22c55e"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#22c55e"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          ⭐ Leave a Google Review
        </a>
        <p style={{ fontSize: 13 }}>Made with 💚 in Wollongong, NSW</p>
      </div>
    </div>

    <style>{`@media(max-width:768px){ footer > div > div:first-child { grid-template-columns: 1fr !important; } }`}</style>
  </footer>
);

/* ─────────────────────────────────────────────
   PAGE LOADER – Quokka pushes the screen away
───────────────────────────────────────────── */
const QuokkaPushing = ({ phase }: { phase: "loading" | "out" }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <style>{`
      @keyframes quokka-strain {
        0%,100% { transform: translateY(0px) rotate(0deg); }
        25%     { transform: translateY(-6px) rotate(-2deg); }
        50%     { transform: translateY(-10px) rotate(0deg) scaleX(0.97); }
        75%     { transform: translateY(-5px) rotate(2deg); }
      }
      @keyframes quokka-lunge {
        0%   { transform: translateY(-8px); }
        40%  { transform: translateY(-28px) scaleY(1.06) scaleX(0.95); }
        100% { transform: translateY(-60px) scaleY(1.1); }
      }
      @keyframes sweat-a {
        0%,100% { opacity:0; transform:translate(0,0) scale(0.4); }
        25%     { opacity:1; transform:translate(-6px,-14px) scale(1); }
        75%     { opacity:0; transform:translate(-9px,6px) scale(0.7); }
      }
      @keyframes sweat-b {
        0%,100% { opacity:0; transform:translate(0,0) scale(0.4); }
        35%     { opacity:1; transform:translate(7px,-16px) scale(1); }
        80%     { opacity:0; transform:translate(10px,5px) scale(0.6); }
      }
      @keyframes sweat-c {
        0%,100% { opacity:0; transform:translate(0,0) scale(0.4); }
        45%     { opacity:1; transform:translate(-4px,-11px) scale(0.85); }
        85%     { opacity:0; transform:translate(-7px,9px) scale(0.5); }
      }
      @keyframes effort-glow {
        0%,100% { filter: drop-shadow(0 0 0px #22c55e00); }
        50%     { filter: drop-shadow(0 0 12px #22c55e88); }
      }
    `}</style>

    {/* Sweat drops – only while straining */}
    {phase === "loading" && (<>
      <span style={{ position:"absolute", top:8, left:2, fontSize:13, animation:"sweat-a 1.5s ease-in-out 0.1s infinite", opacity:0, pointerEvents:"none" }}>💧</span>
      <span style={{ position:"absolute", top:4, right:0, fontSize:10, animation:"sweat-b 1.5s ease-in-out 0.5s infinite", opacity:0, pointerEvents:"none" }}>💧</span>
      <span style={{ position:"absolute", top:18, left:-10, fontSize:9, animation:"sweat-c 1.7s ease-in-out 0.9s infinite", opacity:0, pointerEvents:"none" }}>💧</span>
    </>)}

    {/* Quokka body */}
    <div style={{
      animation: phase === "out"
        ? "quokka-lunge 0.55s cubic-bezier(0.22,1,0.36,1) forwards"
        : "quokka-strain 1.3s ease-in-out infinite",
    }}>
      <svg width="108" height="128" viewBox="0 0 108 128" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ animation: phase === "loading" ? "effort-glow 1.3s ease-in-out infinite" : "none" }}>

        {/* Tail */}
        <path d="M78 92 Q94 84 91 100 Q89 110 79 104" stroke="#22c55e" strokeWidth="7" strokeLinecap="round" fill="none"/>

        {/* Body */}
        <ellipse cx="52" cy="94" rx="24" ry="22" fill="#22c55e"/>
        {/* Belly */}
        <ellipse cx="52" cy="96" rx="14" ry="13" fill="#86efac" opacity="0.45"/>

        {/* Left arm – raised, pushing up */}
        <path d="M30 84 Q20 70 15 57" stroke="#22c55e" strokeWidth="11" strokeLinecap="round" fill="none"/>
        {/* Right arm – raised, pushing up */}
        <path d="M74 84 Q84 70 89 57" stroke="#22c55e" strokeWidth="11" strokeLinecap="round" fill="none"/>
        {/* Hands (flat palms) */}
        <ellipse cx="14" cy="54" rx="10" ry="6.5" fill="#22c55e" transform="rotate(-25 14 54)"/>
        <ellipse cx="90" cy="54" rx="10" ry="6.5" fill="#22c55e" transform="rotate(25 90 54)"/>

        {/* Left leg */}
        <path d="M40 113 Q37 122 31 126" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" fill="none"/>
        {/* Right leg */}
        <path d="M64 113 Q67 122 73 126" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" fill="none"/>
        {/* Feet */}
        <ellipse cx="30" cy="127" rx="11" ry="5" fill="#22c55e"/>
        <ellipse cx="73" cy="127" rx="11" ry="5" fill="#22c55e"/>

        {/* Neck */}
        <ellipse cx="52" cy="72" rx="11" ry="9" fill="#22c55e"/>

        {/* Head */}
        <circle cx="52" cy="50" r="26" fill="#22c55e"/>

        {/* Left ear */}
        <ellipse cx="31" cy="26" rx="11" ry="15" fill="#22c55e"/>
        <ellipse cx="31" cy="26" rx="6.5" ry="10.5" fill="#86efac"/>
        {/* Right ear */}
        <ellipse cx="73" cy="26" rx="11" ry="15" fill="#22c55e"/>
        <ellipse cx="73" cy="26" rx="6.5" ry="10.5" fill="#86efac"/>

        {/* Nose */}
        <ellipse cx="52" cy="57" rx="6.5" ry="5" fill="#16a34a"/>
        <circle cx="49" cy="56" r="2.2" fill="#0a0f0d"/>
        <circle cx="55" cy="56" r="2.2" fill="#0a0f0d"/>

        {/* Eyes – squinting with effort */}
        <circle cx="41" cy="44" r="5" fill="#0a0f0d"/>
        <circle cx="63" cy="44" r="5" fill="#0a0f0d"/>
        <circle cx="42.5" cy="42.5" r="2" fill="white"/>
        <circle cx="64.5" cy="42.5" r="2" fill="white"/>

        {/* Furrowed brows */}
        <path d="M35 38 Q41 34.5 47 38" stroke="#0a0f0d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M57 38 Q63 34.5 69 38" stroke="#0a0f0d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

        {/* Grinning mouth */}
        <path d="M43 62 Q52 69 61 62" stroke="#0a0f0d" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

        {/* Cheeks */}
        <ellipse cx="35" cy="54" rx="7" ry="4" fill="#86efac" opacity="0.5"/>
        <ellipse cx="69" cy="54" rx="7" ry="4" fill="#86efac" opacity="0.5"/>
      </svg>
    </div>
  </div>
);

const PageLoader = ({ onDone }: { onDone: () => void }) => {
  const [phase, setPhase] = useState<"loading" | "out">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    const raf = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(raf);
      else {
        setPhase("out");
        setTimeout(onDone, 750);
      }
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0a0f0d",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 0,
      overflow: "hidden",
      transition: phase === "out" ? "transform 0.7s cubic-bezier(0.76,0,0.24,1)" : "none",
      transform: phase === "out" ? "translateY(-100%)" : "translateY(0)",
      pointerEvents: phase === "out" ? "none" : "all",
    }}>

      {/* Branding */}
      <Logo size={52} />
      <div style={{
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
        fontSize: 20, color: "#fff", letterSpacing: "-0.03em",
        marginTop: 10, marginBottom: 32,
      }}>Web Quokka</div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg, #22c55e, #86efac)",
          width: `${progress}%`,
          transition: "width 0.08s linear",
          boxShadow: "0 0 10px #22c55e88",
        }} />
      </div>
      <div style={{ fontSize: 12, color: "#4b5563", fontVariantNumeric: "tabular-nums", marginBottom: 40 }}>
        {progress}%
      </div>

      {/* Quokka */}
      <QuokkaPushing phase={phase} />

      {/* Label */}
      <div style={{
        fontSize: 12, color: "#4b5563", marginTop: 10,
        fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em",
        transition: "opacity 0.3s",
      }}>
        {phase === "out" ? "here we go! 🚀" : "pushing your site..."}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ROOT PAGE
───────────────────────────────────────────── */
export default function WebQokkaLandingPage() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <GlobalStyles />
      {loading && <PageLoader onDone={() => setLoading(false)} />}
      <div style={{
        opacity: loading ? 0 : 1,
        transition: "opacity 0.4s ease 0.1s",
      }}>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Process />
        <Team />
        <Pricing />
        <Portfolio />
        <Blog />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      </div>
    </>
  );
}
