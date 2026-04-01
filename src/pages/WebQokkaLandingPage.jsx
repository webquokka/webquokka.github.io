import { useState, useEffect, useRef } from "react";
import supabase from "../lib/supabase.js";

/* ─────────────────────────────────────────────
   UTILITY: simple intersection-observer hook
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
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
      --brown: #c1773a;
      --brown-light: #e8c49a;
      --brown-dark: #8b4513;
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

    ::selection { background: #f5dbb8; color: var(--ink); }

    /* Scroll bar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--brown-light); border-radius: 99px; }

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
      background: #fde8d0; color: var(--brown-dark);
      font-size: 13px; font-weight: 500; letter-spacing: 0;
    }
    .pill::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--brown); display: block; }

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

    /* Brown CTA */
    .btn-brown {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 99px;
      background: var(--brown); color: #fff;
      font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
      border: none; cursor: pointer;
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
    }
    .btn-brown:hover { background: var(--brown-dark); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(194,119,58,0.35); }

    /* Input */
    .form-input {
      width: 100%; padding: 13px 16px; border-radius: var(--radius-md);
      border: 1.5px solid var(--border); background: #fff;
      font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--ink);
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus { border-color: var(--brown); box-shadow: 0 0 0 3px #fde8d0; }
    .form-input::placeholder { color: #9ca3af; }

    /* Nav link */
    .nav-link {
      font-size: 14px; font-weight: 500; color: var(--ink-muted);
      text-decoration: none; transition: color 0.2s;
      position: relative;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px;
      background: var(--brown); border-radius: 99px; transition: width 0.25s;
    }
    .nav-link:hover { color: var(--ink); }
    .nav-link:hover::after { width: 100%; }

    /* Marquee ticker */
    @keyframes marquee-ltr { from { transform: translateX(-50%); } to { transform: translateX(0%); } }
    @keyframes marquee-rtl { from { transform: translateX(0%); } to { transform: translateX(-50%); } }
    .marquee-track { overflow: hidden; width: 100%; }
    .marquee-inner { display: flex; width: max-content; }
    .marquee-ltr  .marquee-inner { animation: marquee-ltr 18s linear infinite; }
    .marquee-rtl  .marquee-inner { animation: marquee-rtl 18s linear infinite; }

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
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="12" fill="#0a0f0d"/>
      <ellipse cx="20" cy="22" rx="11" ry="10" fill="#c2773a"/>
      <ellipse cx="15" cy="15" rx="5" ry="6" fill="#c2773a"/>
      <ellipse cx="25" cy="15" rx="5" ry="6" fill="#c2773a"/>
      <ellipse cx="15" cy="15" rx="3" ry="4" fill="#0a0f0d"/>
      <ellipse cx="25" cy="15" rx="3" ry="4" fill="#0a0f0d"/>
      <circle cx="20" cy="23" r="4" fill="#0a0f0d"/>
      <circle cx="18.5" cy="22.5" r="1.5" fill="white"/>
      <circle cx="21.5" cy="22.5" r="1.5" fill="white"/>
      <path d="M17 26 Q20 28.5 23 26" stroke="#0a0f0d" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="14" cy="18" r="2.5" fill="#e8c49a"/>
      <circle cx="26" cy="18" r="2.5" fill="#e8c49a"/>
    </svg>
    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: size * 0.56, letterSpacing: "-0.03em", color: "#0a0f0d" }}>
      Web Quokka
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   NAV QUOKKA MASCOT
───────────────────────────────────────────── */
const NavQuokka = ({ pose = 'push-down' }) => {
  const b = '#c2773a', l = '#e8c49a', d = '#0a0f0d';

  if (pose === 'push-down' || pose === 'push-up') {
    return (
      <svg width="64" height="76" viewBox="0 0 64 76" fill="none"
        style={{ transform: pose === 'push-up' ? 'scaleY(-1)' : 'none', display: 'block' }}>
        {/* Ears */}
        <ellipse cx="18" cy="11" rx="7" ry="9" fill={b}/>
        <ellipse cx="46" cy="11" rx="7" ry="9" fill={b}/>
        <ellipse cx="18" cy="12" rx="4" ry="6" fill={d}/>
        <ellipse cx="46" cy="12" rx="4" ry="6" fill={d}/>
        {/* Head */}
        <ellipse cx="32" cy="28" rx="17" ry="15" fill={b}/>
        {/* Cheeks */}
        <circle cx="17" cy="32" r="6" fill={l} opacity="0.85"/>
        <circle cx="47" cy="32" r="6" fill={l} opacity="0.85"/>
        {/* Eyes */}
        <circle cx="25" cy="25" r="3.5" fill={d}/>
        <circle cx="39" cy="25" r="3.5" fill={d}/>
        <circle cx="26.2" cy="23.8" r="1.2" fill="white"/>
        <circle cx="40.2" cy="23.8" r="1.2" fill="white"/>
        {/* Nose */}
        <ellipse cx="32" cy="32" rx="3" ry="2" fill={d}/>
        {/* Smile */}
        <path d="M27 37 Q32 41 37 37" stroke={d} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* Body */}
        <ellipse cx="32" cy="57" rx="16" ry="13" fill={b}/>
        {/* Arms pushing down */}
        <path d="M17 47 Q9 57 8 68" stroke={b} strokeWidth="7" strokeLinecap="round"/>
        <path d="M47 47 Q55 57 56 68" stroke={b} strokeWidth="7" strokeLinecap="round"/>
        {/* Hands */}
        <circle cx="8" cy="69" r="5" fill={l}/>
        <circle cx="56" cy="69" r="5" fill={l}/>
      </svg>
    );
  }

  /* pull-right: side view facing right, arms reaching right */
  if (pose === 'pull-right' || pose === 'pull-left') {
    return (
      <svg width="82" height="66" viewBox="0 0 82 66" fill="none"
        style={{ transform: pose === 'pull-left' ? 'scaleX(-1)' : 'none', display: 'block' }}>
        {/* Tail */}
        <path d="M10 42 Q4 33 8 22 Q12 13 8 7" stroke={b} strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Body */}
        <ellipse cx="36" cy="44" rx="22" ry="14" fill={b}/>
        {/* Neck */}
        <ellipse cx="54" cy="33" rx="8" ry="7" fill={b}/>
        {/* Head */}
        <ellipse cx="63" cy="24" rx="13" ry="12" fill={b}/>
        {/* Ears */}
        <ellipse cx="58" cy="11" rx="5" ry="8" fill={b}/>
        <ellipse cx="58" cy="12" rx="3" ry="5" fill={d}/>
        <ellipse cx="70" cy="10" rx="5" ry="7" fill={b}/>
        <ellipse cx="70" cy="11" rx="3" ry="5" fill={d}/>
        {/* Eye */}
        <circle cx="70" cy="22" r="3" fill={d}/>
        <circle cx="71.2" cy="20.8" r="1" fill="white"/>
        {/* Cheek */}
        <circle cx="66" cy="29" r="5" fill={l} opacity="0.85"/>
        {/* Nose */}
        <ellipse cx="75" cy="25" rx="2" ry="1.5" fill={d}/>
        {/* Smile */}
        <path d="M71 31 Q75 34 79 31" stroke={d} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* Arms reaching right (pulling) */}
        <path d="M50 28 Q64 18 78 15" stroke={b} strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 38 Q64 42 78 46" stroke={b} strokeWidth="6" strokeLinecap="round"/>
        {/* Hands */}
        <circle cx="79" cy="14" r="4.5" fill={l}/>
        <circle cx="79" cy="47" r="4.5" fill={l}/>
        {/* Legs */}
        <path d="M22 56 L16 66" stroke={b} strokeWidth="5" strokeLinecap="round"/>
        <path d="M37 58 L36 66" stroke={b} strokeWidth="5" strokeLinecap="round"/>
        <circle cx="15" cy="66" r="4" fill={l}/>
        <circle cx="35" cy="66" r="4" fill={l}/>
      </svg>
    );
  }
  return null;
};

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const NAV_ANIMS = [
  { dx: 0,   dy: -60 },
  { dx: 0,   dy:  60 },
  { dx: -60, dy:   0 },
  { dx:  60, dy:   0 },
  { dx: -50, dy: -50 },
  { dx:  50, dy: -50 },
  { dx: -50, dy:  50 },
  { dx:  50, dy:  50 },
];

const SLIDE_DIRS = ['left', 'right', 'top', 'bottom'];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [particles, setParticles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [overlay, setOverlay] = useState(null);
  const [navQuokka, setNavQuokka] = useState(false);
  const pidRef = useRef(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => { setLoaded(true); setNavQuokka(true); }, 100);
    const t2 = setTimeout(() => setNavQuokka(false), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const spawnParticles = (e, label) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 4 + Math.floor(Math.random() * 3);
    const shuffled = [...NAV_ANIMS].sort(() => Math.random() - 0.5).slice(0, count);
    const newParticles = shuffled.map(({ dx, dy }) => ({
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

  const handleNavClick = (e, href, label) => {
    e.preventDefault();
    spawnParticles(e, label);
    const dir = SLIDE_DIRS[Math.floor(Math.random() * SLIDE_DIRS.length)];
    setOverlay({ dir });
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'instant' });
      setOpen(false);
    }, 900);
    setTimeout(() => setOverlay(null), 2000);
  };

  const links = [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    // { label: "Portfolio", href: "#portfolio" },
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
          color: "#c2773a",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          animation: `navpop-${pt.id % 8} 0.65s ease-out forwards`,
          "--dx": `${pt.dx}px`,
          "--dy": `${pt.dy}px`,
        }}>
          {pt.label}
        </span>
      ))}
      <style>{`
        @keyframes navpop { 0% { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1); } 100% { opacity:0; transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(0.5); } }
        ${Array.from({length:8},(_,i)=>`@keyframes navpop-${i} { 0% { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1); } 100% { opacity:0; transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(0.4); } }`).join('')}
        @keyframes nav-slide-down { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes nav-fade-in    { from { opacity:0; transform:translateY(-8px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes ov-left   { 0% { transform:translateX(-100%); opacity:1; } 70% { transform:translateX(0%); opacity:1; } 100% { transform:translateX(0%); opacity:0; } }
        @keyframes ov-right  { 0% { transform:translateX(100%);  opacity:1; } 70% { transform:translateX(0%); opacity:1; } 100% { transform:translateX(0%); opacity:0; } }
        @keyframes ov-top    { 0% { transform:translateY(-100%); opacity:1; } 70% { transform:translateY(0%); opacity:1; } 100% { transform:translateY(0%); opacity:0; } }
        @keyframes ov-bottom { 0% { transform:translateY(100%);  opacity:1; } 70% { transform:translateY(0%); opacity:1; } 100% { transform:translateY(0%); opacity:0; } }
        @keyframes quokka-nav-load {
          0%   { transform:translateX(-50%) translateY(-80px) scale(0.8); opacity:0; }
          22%  { transform:translateX(-50%) translateY(6px)  scale(1.05); opacity:1; }
          55%  { transform:translateX(-50%) translateY(2px)  scale(1);    opacity:1; }
          80%  { transform:translateX(-50%) translateY(2px)  scale(1);    opacity:0.7; }
          100% { transform:translateX(-50%) translateY(-60px) scale(0.7); opacity:0; }
        }
      `}</style>
    {overlay && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 8999,
        background: 'linear-gradient(160deg, #111816 0%, #1c1008 40%, #2a1205 100%)',
        boxShadow: overlay.dir === 'left'  ? '8px 0 48px rgba(0,0,0,0.6)'
                 : overlay.dir === 'right' ? '-8px 0 48px rgba(0,0,0,0.6)'
                 : overlay.dir === 'top'   ? '0 8px 48px rgba(0,0,0,0.6)'
                 :                           '0 -8px 48px rgba(0,0,0,0.6)',
        animation: `ov-${overlay.dir} 2s cubic-bezier(0.4,0,0.2,1) forwards`,
        pointerEvents: 'none',
      }} />
    )}
    </div>

    {/* Nav-load quokka: pushes the navbar down on first load */}
    {navQuokka && (
      <div style={{
        position: 'fixed', top: 0, left: '50%', zIndex: 9998, pointerEvents: 'none',
        animation: 'quokka-nav-load 1s cubic-bezier(0.22,1,0.36,1) forwards',
      }}>
        <NavQuokka pose="push-down" />
      </div>
    )}

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
        <a href="#contact" className="btn-brown" style={{ padding: "11px 22px", fontSize: 14 }}>
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
          <a href="#contact" className="btn-brown" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
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
          <div style={{ width: 64, height: 28, background: "#c2773a", borderRadius: 99 }} />
        </div>
      </div>
      {/* Hero area */}
      <div style={{ background: "linear-gradient(135deg, #fdf5ec 0%, #fde8d0 100%)", borderRadius: 16, padding: "28px 24px", marginBottom: 20 }}>
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
          { c: "#fdf5ec", label: "Web Design" },
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
      background: "linear-gradient(160deg, #f8faf9 0%, #fdf5ec 50%, #f8faf9 100%)",
      position: "relative", overflow: "hidden", paddingTop: 80,
    }} ref={ref}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: -200, right: -200, width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, #fde8d0 0%, transparent 70%)",
        opacity: 0.6, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -100, width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, #f5dbb8 0%, transparent 70%)",
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
            <span style={{ color: "#c2773a", position: "relative" }}>
              website
              <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 8 }} viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 6 Q100 0 200 6" stroke="#e8c49a" strokeWidth="3" fill="none" strokeLinecap="round"/>
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
            <a href="#contact" className="btn-brown">Start Your Project →</a>
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
    bg: "#fdf5ec",
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
    title: "Hosting & Backend",
    desc: "Fast, reliable, and scalable hosting powered by Firebase. We handle the infrastructure so you don't have to.",
    bg: "#fdf5ec",
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
            Services built for <span style={{ color: "#c2773a" }}>real businesses</span>
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
                <a href="#contact" style={{ fontSize: 13, fontWeight: 600, color: "#c2773a", textDecoration: "none" }}>
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


const WhyUsCard = ({ w, index }) => {
  const [ref, inView] = useInView(0.3);
  const fromLeft = index % 2 === 0;
  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "28px 24px",
      border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateX(0)" : `translateX(${fromLeft ? "-80px" : "80px"})`,
      transition: `opacity 1s ease ${index * 0.4}s, transform 1s cubic-bezier(0.22,1,0.36,1) ${index * 0.4}s`,
    }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>{w.icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{w.title}</h3>
      <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.65 }}>{w.desc}</p>
    </div>
  );
};

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
            borderRadius: "50%", background: "radial-gradient(circle, #c2773a40, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: -60, left: -60, width: 200, height: 200,
            borderRadius: "50%", background: "radial-gradient(circle, #c2773a30, transparent 70%)",
          }} />

          <div style={{ textAlign: "center", marginBottom: 64, position: "relative" }}>
            <div className={`fade-up${inView ? " visible" : ""}`}>
              <span className="pill" style={{ background: "#1a2e24", color: "#e8c49a" }}>Why Web Quokka</span>
            </div>
            <div className={`fade-up${inView ? " visible" : ""} d1`} style={{ marginTop: 16, marginBottom: 12, overflow: "hidden" }}>
              {/* Row 1 — slides left to right */}
              <div className="marquee-track marquee-ltr" style={{ marginBottom: 6 }}>
                <div className="marquee-inner">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 800, color: "#fff", whiteSpace: "nowrap", paddingRight: "clamp(24px, 4vw, 60px)" }}>
                      Built different. <span style={{ color: "#c2773a" }}>✦</span>
                    </span>
                  ))}
                </div>
              </div>
              {/* Row 2 — slides right to left */}
              <div className="marquee-track marquee-rtl">
                <div className="marquee-inner">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 800, whiteSpace: "nowrap", paddingRight: "clamp(24px, 4vw, 60px)" }}>
                      <span style={{ color: "#c2773a" }}>On purpose.</span> <span style={{ color: "rgba(255,255,255,0.2)" }}>✦</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#9ca3af", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              We obsess over the details so you can focus on running your business.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {whyUs.map((w, i) => (
              <WhyUsCard key={w.title} w={w} index={i} />
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
            Simple process, <span style={{ color: "#c2773a" }}>real results</span>
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
                  textAlign: "left", background: active === i ? "#fdf5ec" : "transparent",
                  border: active === i ? "1.5px solid #e8c49a" : "1.5px solid transparent",
                  borderRadius: 16, padding: "20px 24px", cursor: "pointer",
                  transition: "all 0.25s", display: "flex", alignItems: "center", gap: 20,
                }}
              >
                <span style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: active === i ? "#c2773a" : "#f3f4f6",
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
            background: "linear-gradient(135deg, #fdf5ec, #fde8d0)",
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
    name: "Ramdev Shrestha",
    role: "Lead Developer",
    avatar: "AC",
    avatarBg: "#c2773a",
    bio: "Full-stack engineer with 3+ years building fast, scalable web apps. Obsessed with clean code and performance.",
    skills: ["React", "Node.js", "AWS", "UI/UX"],
  },
  {
    name: "Alex Carter",
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

const TeamCard = ({ m, index }) => {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} style={{
      background: "#fff", borderRadius: 24, padding: "36px 28px",
      border: "1px solid #e5e7eb", textAlign: "center",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateX(0)" : "translateX(80px)",
      transition: `opacity 1s ease ${index * 0.4}s, transform 1s cubic-bezier(0.22,1,0.36,1) ${index * 0.4}s`,
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(194,119,58,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateX(0)"; }}
    >
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: m.avatarBg, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 20,
        margin: "0 auto 16px",
      }}>{m.avatar}</div>
      <div style={{ fontWeight: 700, fontSize: 18, color: "#0a0f0d", marginBottom: 4 }}>{m.name}</div>
      <div style={{ fontSize: 13, color: m.avatarBg, fontWeight: 600, marginBottom: 14 }}>{m.role}</div>
      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.65, marginBottom: 20 }}>{m.bio}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {m.skills.map(skill => (
          <span key={skill} style={{
            background: "#fdf5ec", color: "#8b4513", borderRadius: 8,
            padding: "4px 12px", fontSize: 12, fontWeight: 600,
          }}>{skill}</span>
        ))}
      </div>
    </div>
  );
};

const Team = () => {
  const [ref, inView] = useInView();
  return (
    <section id="team" style={{ background: "#f9fafb" }}>
      <div className="section" ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Our team</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
            The people behind <span style={{ color: "#c2773a" }}>your success</span>
          </h2>
          <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, maxWidth: 460, margin: "0 auto" }}>
            A small, focused team that cares deeply about delivering results for every client.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {teamMembers.map((m, i) => (
            <TeamCard key={m.name} m={m} index={i} />
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
    color: "#fdf5ec",
    avatarBg: "#c2773a",
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
            Trusted by small businesses <span style={{ color: "#c2773a" }}>everywhere</span>
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
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("enquiries").insert([{
      name: form.name.trim(),
      business: form.business?.trim() || null,
      email: form.email.trim().toLowerCase(),
      phone: form.phone?.trim() || null,
      service: form.service.trim(),
      message: form.message.trim(),
    }]);

    if (error) {
      setErrorMsg("Failed to send message. Please try again.");
      setStatus("idle");
    } else {
      setStatus("success");
    }
  };

  return (
    <section id="contact" style={{ background: "#fff" }}>
      <div className="section" ref={ref}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          {/* Left */}
          <div>
            <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Get in touch</span></div>
            <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, marginTop: 16, marginBottom: 16, lineHeight: 1.1 }}>
              Let's build something <span style={{ color: "#c2773a" }}>great together.</span>
            </h2>
            <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
              Tell us about your project and we'll get back to you within 24 hours with a free, no-obligation quote.
            </p>

            {/* Contact points */}
            <div className={`fade-up${inView ? " visible" : ""} d3`} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "📧", label: "Email", value: "quokkasupport@gmail.com" },
                { icon: "📍", label: "Based in", value: "Hurstville, NSW, Australia" },
                { icon: "⏱️", label: "Response time", value: "Within 24 hours" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fdf5ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
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
                background: "#fdf5ec", borderRadius: 24, padding: "64px 40px",
                textAlign: "center", border: "1.5px solid #e8c49a",
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
                {errorMsg && (
                  <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{errorMsg}</p>
                )}
                <button type="submit" className="btn-brown" style={{ width: "100%", justifyContent: "center", opacity: status === "loading" ? 0.75 : 1 }} disabled={status === "loading"}>
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
const pricingTabs = ["Website", "E-Commerce", "Web App", "Mobile App", "Maintenance"];

const pricingPlans = {
  "Website": [
    {
      name: "Starter Package",
      price: "$699",
      period: "one-time",
      badge: null,
      features: ["Up to 5 pages", "Mobile-responsive design", "Contact form", "Basic SEO setup", "1 round of revisions", "14-day delivery", "Firebase hosting setup"],
      cta: "Get Started",
    },
    {
      name: "Growth Package",
      price: "$1199",
      period: "one-time",
      badge: "Most Popular",
      features: ["Up to 12 pages", "Custom UI/UX design", "CMS / blog integration", "Google Analytics setup", "On-page SEO", "3 rounds of revisions", "21-day delivery"],
      cta: "Get Started",
    },
    {
      name: "Pro Package",
      price: "Custom",
      period: "project",
      badge: null,
      features: ["Unlimited pages", "Bespoke UI/UX design", "Custom integrations & APIs", "Advanced SEO strategy", "Priority support", "Ongoing maintenance", "Dedicated project manager"],
      cta: "Talk to Us",
    },
  ],
  "E-Commerce": [
    {
      name: "Shop Starter",
      price: "$999",
      period: "one-time",
      badge: null,
      features: ["Up to 50 products", "Payment gateway setup", "Mobile-responsive design", "Basic SEO setup", "Order management", "1 round of revisions", "21-day delivery"],
      cta: "Get Started",
    },
    {
      name: "Shop Growth",
      price: "$1799",
      period: "one-time",
      badge: "Most Popular",
      features: ["Unlimited products", "Custom storefront design", "Payment + shipping setup", "Inventory management", "Abandoned cart recovery", "Google Shopping feed", "Analytics dashboard"],
      cta: "Get Started",
    },
    {
      name: "Enterprise Store",
      price: "Custom",
      period: "project",
      badge: null,
      features: ["Custom e-commerce platform", "ERP / CRM integrations", "Multi-currency support", "Advanced analytics", "Subscription billing", "Dedicated account manager", "24/7 priority support"],
      cta: "Talk to Us",
    },
  ],
  "Web App": [
    {
      name: "App Starter",
      price: "$2499",
      period: "one-time",
      badge: null,
      features: ["Up to 10 screens", "User authentication", "Firebase backend", "Basic CRUD operations", "Responsive design", "1 round of revisions", "30-day delivery"],
      cta: "Get Started",
    },
    {
      name: "App Growth",
      price: "$4399",
      period: "one-time",
      badge: "Most Popular",
      features: ["Unlimited screens", "Custom UI/UX design", "Firebase + REST API", "Role-based access control", "Real-time data sync", "3rd-party integrations", "3 rounds of revisions"],
      cta: "Get Started",
    },
    {
      name: "App Enterprise",
      price: "Custom",
      period: "project",
      badge: null,
      features: ["Fully custom architecture", "Scalable cloud backend", "Advanced integrations", "Admin dashboard", "Analytics & reporting", "Dedicated team", "Ongoing support"],
      cta: "Talk to Us",
    },
  ],
  "Mobile App": [
    {
      name: "App Starter",
      price: "$2500",
      period: "one-time",
      badge: null,
      features: ["iOS & Android", "Up to 8 screens", "User authentication", "Push notifications", "Firebase backend", "App store submission", "30-day delivery"],
      cta: "Get Started",
    },
    {
      name: "App Growth",
      price: "$4,999",
      period: "one-time",
      badge: "Most Popular",
      features: ["iOS & Android", "Unlimited screens", "Custom UI/UX design", "Payment integration", "Real-time features", "Analytics dashboard", "3 rounds of revisions"],
      cta: "Get Started",
    },
    {
      name: "App Enterprise",
      price: "Custom",
      period: "project",
      badge: null,
      features: ["Cross-platform or native", "Complex integrations", "Offline functionality", "Admin panel", "Advanced analytics", "Dedicated project manager", "Priority support"],
      cta: "Talk to Us",
    },
  ],
  "Maintenance": [
    {
      name: "Basic Care",
      price: "$79",
      period: "/month",
      badge: null,
      features: ["Monthly updates", "Security patches", "Uptime monitoring", "Monthly report", "Email support", "1 content update/mo", "Weekly backups"],
      cta: "Get Started",
    },
    {
      name: "Growth Care",
      price: "$179",
      period: "/month",
      badge: "Most Popular",
      features: ["Weekly updates", "Security patches", "Performance optimisation", "Priority support", "4 content updates/mo", "Daily backups", "Monthly analytics report"],
      cta: "Get Started",
    },
    {
      name: "Pro Care",
      price: "$379",
      period: "/month",
      badge: null,
      features: ["Unlimited updates", "24/7 monitoring", "Speed optimisation", "Dedicated support line", "Unlimited content updates", "Real-time backups", "SEO reporting"],
      cta: "Talk to Us",
    },
  ],
};

const Pricing = () => {
  const [ref, inView] = useInView();
  const [activeTab, setActiveTab] = useState("Website");
  const plans = pricingPlans[activeTab];

  return (
    <section id="pricing" style={{ background: "#f8faf9" }}>
      <div className="section" ref={ref}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Pricing</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
            Simple pricing, <span style={{ color: "#c2773a" }}>no surprises</span>
          </h2>
          <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, maxWidth: 520, margin: "0 auto 32px" }}>
            Transparent packages built for businesses of every size. Pay once, own it forever.
          </p>

          {/* Service tabs */}
          <div className={`fade-up${inView ? " visible" : ""} d3`} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {pricingTabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "10px 20px", borderRadius: 99, fontSize: 14, fontWeight: 600,
                cursor: "pointer", border: "none", transition: "all 0.2s",
                background: activeTab === tab ? "#0a0f0d" : "#fff",
                color: activeTab === tab ? "#fff" : "#4b5563",
                boxShadow: activeTab === tab ? "0 4px 16px rgba(0,0,0,0.18)" : "0 1px 4px rgba(0,0,0,0.08)",
              }}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className={`fade-up${inView ? " visible" : ""} d3`} style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start",
        }}>
          {plans.map((p) => (
            <div key={p.name} style={{
              borderRadius: 20, overflow: "hidden",
              border: p.badge ? "2px solid #c2773a" : "1px solid #e5e7eb",
              boxShadow: p.badge ? "0 8px 32px rgba(194,119,58,0.15)" : "0 4px 20px rgba(0,0,0,0.07)",
              transition: "transform 0.25s, box-shadow 0.25s",
              position: "relative",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = p.badge ? "0 20px 48px rgba(194,119,58,0.22)" : "0 16px 40px rgba(0,0,0,0.13)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = p.badge ? "0 8px 32px rgba(194,119,58,0.15)" : "0 4px 20px rgba(0,0,0,0.07)"; }}
            >
              {/* Badge */}
              {p.badge && (
                <div style={{
                  position: "absolute", top: 16, right: 16, zIndex: 1,
                  background: "#c2773a", color: "#fff", borderRadius: 99,
                  padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                }}>{p.badge}</div>
              )}

              {/* Dark header */}
              <div style={{ background: "#0a0f0d", padding: "28px 28px 24px" }}>
                <div style={{
                  fontSize: 12, fontWeight: 800, color: "#e8c49a",
                  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
                }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{
                    fontSize: 48, fontWeight: 800, color: "#fff",
                    fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1,
                  }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: "#6b7280", marginBottom: 2 }}>{p.period}</span>
                </div>
              </div>

              {/* Features */}
              <div style={{ background: "#fff", padding: "24px 28px 28px" }}>
                <ul style={{ listStyle: "none", marginBottom: 24, display: "flex", flexDirection: "column", gap: 11 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#374151" }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#fde8d0", color: "#8b4513",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
                      }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="btn-brown" style={{ width: "100%", justifyContent: "center" }}>
                  {p.cta} →
                </a>
              </div>

              {/* Footer */}
              <div style={{
                background: "#f8faf9", borderTop: "1px solid #e5e7eb",
                padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Share your idea?</div>
                  <a href="mailto:quokkasupport@gmail.com" style={{ fontSize: 12, fontWeight: 600, color: "#c2773a", textDecoration: "none" }}>
                    quokkasupport@gmail.com
                  </a>
                </div>
                <div style={{ width: 1, height: 28, background: "#e5e7eb", flexShrink: 0 }} />
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Want to discuss?</div>
                  <a href="#contact" style={{ fontSize: 12, fontWeight: 600, color: "#0a0f0d", textDecoration: "none" }}>
                    Contact us →
                  </a>
                </div>
              </div>
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
    title: "Creyeti",
    category: "Business Website",
    url: "https://www.creyeti.com.au",
    desc: "Bold creative agency site with immersive animations, portfolio showcases, and seamless brand storytelling.",
    emoji: "🎨",
    video: "/creyeti1.mp4",
    bg: "#fdf4ff",
    accent: "#9333ea",
    tags: ["React", "GSAP", "Tailwind"],
  },
  {
    title: "The Kaiverse",
    category: "Web Application",
    url: "https://thekaiverse.com.au",
    desc: "Dynamic digital platform with rich interactive experiences, content hub, and community-driven features.",
    emoji: "🌐",
    bg: "#fdf5ec",
    accent: "#a0522d",
    tags: ["React", "CMS", "Animations"],
  },
];

const Portfolio = () => {
  const [ref, inView] = useInView();
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = ["All", "Business Website", "Web Application"];
  const filtered = activeFilter === "All" ? portfolioItems : portfolioItems.filter(i => i.category === activeFilter);

  return (
    <section id="portfolio" style={{ background: "#f9fafb" }}>
      <div className="section" ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Portfolio</span></div>
          <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
            Work we're <span style={{ color: "#c2773a" }}>proud of</span>
          </h2>
          <p className={`fade-up${inView ? " visible" : ""} d2`} style={{ color: "#4b5563", fontSize: 16, maxWidth: 460, margin: "0 auto 32px" }}>
            Real projects, real clients, real results — from local businesses to growing brands.
          </p>

          {/* Filter pills */}
          <div className={`fade-up${inView ? " visible" : ""} d3`} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1.5px solid",
                borderColor: activeFilter === cat ? "#c2773a" : "#e5e7eb",
                background: activeFilter === cat ? "#fde8d0" : "#fff",
                color: activeFilter === cat ? "#8b4513" : "#6b7280",
                transition: "all 0.2s",
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div className={`fade-up${inView ? " visible" : ""} d3`} style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
        }}>
          {filtered.map((item) => {
            const cardContent = (
              <>
                {/* Preview area */}
                <div style={{
                  height: 220, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 56, background: item.bg, overflow: "hidden", position: "relative",
                }}>
                  {item.video ? (
                    <video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : item.emoji}
                </div>
                <div style={{ padding: "14px 20px 16px" }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: "#0a0f0d" }}>
                    {item.title}
                    {item.url && <span style={{ fontSize: 11, color: item.accent, marginLeft: 6, fontWeight: 500 }}>↗</span>}
                  </div>
                </div>
              </>
            );
            const sharedStyle = {
              background: item.bg, borderRadius: 24, overflow: "hidden",
              border: "1px solid #e5e7eb", transition: "transform 0.25s, box-shadow 0.25s",
              display: "block", textDecoration: "none", color: "inherit",
            };
            const hoverIn = (e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.10)"; };
            const hoverOut = (e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; };
            return item.url ? (
              <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer"
                style={{ ...sharedStyle, cursor: "pointer" }}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              >{cardContent}</a>
            ) : (
              <div key={item.title} style={sharedStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                {cardContent}
              </div>
            );
          })}
        </div>

        <div className={`fade-up${inView ? " visible" : ""} d4`} style={{ textAlign: "center", marginTop: 48 }}>
          <a href="#contact" className="btn-brown">Start your project →</a>
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
    bg: "#fdf5ec",
    accent: "#c2773a",
    content: [
      { type: "intro", text: "You built the website. You hit publish. You waited. And… nothing. If your business isn't appearing on Google, you're not alone — but you're also not helpless. Here are the five most common reasons small business websites stay invisible, and exactly what you can do about each one." },
      { type: "heading", text: "1. Your site has no Google Business Profile" },
      { type: "para", text: "For local businesses, Google Business Profile (formerly Google My Business) is often more important than your actual website. If you haven't claimed and completed your profile — with your address, phone number, opening hours, photos, and category — Google has very little reason to show you in local search results. Set this up first. It's free and takes under an hour." },
      { type: "heading", text: "2. Your pages have no target keywords" },
      { type: "para", text: "Google can't read your mind. If your homepage just says 'Welcome to our business' with no mention of what you do or where you're based, search engines have nothing to work with. Every page on your site should clearly state what service you offer and which suburb or city you serve. Think: 'affordable plumber in Brisbane' not just 'plumber'." },
      { type: "heading", text: "3. Your website loads too slowly" },
      { type: "para", text: "Page speed is a confirmed Google ranking factor. If your site takes more than 3 seconds to load, Google penalises you — and most visitors leave anyway. Common culprits include uncompressed images, cheap shared hosting, and bloated WordPress plugins. Use Google PageSpeed Insights to check your score. Anything below 70 on mobile needs work." },
      { type: "heading", text: "4. You have no backlinks" },
      { type: "para", text: "A backlink is a link from another website to yours. Google treats these as votes of confidence. A brand-new site with zero backlinks looks untrustworthy to Google's algorithm. Start simple: list your business on directories like Yellow Pages, True Local, and industry-specific sites. Ask suppliers or partners to link to you. Even one or two quality links can make a real difference early on." },
      { type: "heading", text: "5. Your site isn't mobile-friendly" },
      { type: "para", text: "Over 60% of searches happen on mobile devices, and Google uses mobile-first indexing — meaning it primarily uses the mobile version of your site for ranking. If your website looks broken or is hard to use on a phone, you're being pushed down the results. Test your site at Google's Mobile-Friendly Test tool. If it fails, it's time for a rebuild." },
      { type: "callout", text: "The good news? All five of these are fixable. Web Quokka builds every site with SEO fundamentals baked in from day one — fast loading, mobile-first design, clean structure, and proper keyword targeting. Get in touch if you'd like us to take a look at your current site." },
    ],
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
    content: [
      { type: "intro", text: "Research from Google found that users form a visual impression of a website in as little as 50 milliseconds — that's 0.05 seconds. Before they've read a single word, they've already decided whether your site feels trustworthy, professional, or worth their time. So what exactly are they reacting to?" },
      { type: "heading", text: "Visual complexity kills trust fast" },
      { type: "para", text: "The number one thing that makes a site feel untrustworthy at a glance is visual clutter. Too many fonts, too many colours, overcrowded layouts, and low-quality images all register as 'chaos' in the brain instantly. The most trusted websites tend to be clean, airy, and consistent. White space isn't wasted space — it's breathing room that signals confidence." },
      { type: "heading", text: "Colour does more work than you think" },
      { type: "para", text: "Colour psychology is real. Blues and greens signal calm and trust. Browns and earthy tones feel grounded and authentic. Bright, clashing colours can feel aggressive or cheap. Your colour palette should match the emotion you want customers to associate with your brand. A law firm and a surf shop need very different palettes — and getting it wrong costs you customers before they've read anything." },
      { type: "heading", text: "The hero section is everything" },
      { type: "para", text: "The top section of your homepage — what visitors see without scrolling — is the most valuable real estate on your entire website. It needs to answer three questions instantly: Who are you? What do you do? Why should I care? Most small business sites fail this test. They lead with a vague tagline, a blurry stock photo, and no clear call to action. Be specific. Be direct. Tell people exactly what you offer and who it's for." },
      { type: "heading", text: "Trust signals matter immediately" },
      { type: "para", text: "Even subconsciously, visitors are scanning for trust signals the moment they land. Things like: a professional logo, a real phone number or email visible above the fold, customer reviews or logos of past clients, an HTTPS padlock in the browser bar, and a clean, modern design. Missing even a couple of these can be enough to send someone straight back to Google." },
      { type: "heading", text: "Mobile design is the first impression now" },
      { type: "para", text: "For most businesses, the majority of visitors are on their phones. That means the mobile version of your site is your first impression — not the desktop. If text is too small, buttons are hard to tap, or images are cropped awkwardly, you've already lost them. Design mobile-first, then scale up." },
      { type: "callout", text: "At Web Quokka, every site we build is designed to earn trust in those first 50 milliseconds. Clean layouts, strong hierarchy, mobile-first — and always built around your specific audience. Want a free review of your current site's first impression? Reach out." },
    ],
  },
  {
    category: "E-commerce",
    title: "How a $1,500 Website Generated $40k in Its First Quarter",
    excerpt: "The story behind a local florist's online store — what we built, why it worked, and the numbers that followed.",
    date: "Feb 10, 2025",
    readTime: "6 min read",
    emoji: "📈",
    bg: "#fff7ed",
    accent: "#f97316",
    content: [
      { type: "intro", text: "When a local florist approached us, they were doing everything by phone and Instagram DMs. They had a loyal local following, great product, and zero online ordering. We built them a simple e-commerce site for $1,500. In the first three months, it processed over $40,000 in orders. Here's the breakdown of what we built and why it worked." },
      { type: "heading", text: "The problem: great product, friction-filled buying" },
      { type: "para", text: "Before the website, ordering was a back-and-forth process — DM to enquire, wait for a reply, get a price, pay via bank transfer, confirm. Each step lost customers. People who were ready to buy right now had to wait. Impulse purchases — especially for gifts and occasions — don't survive a 24-hour wait for a reply. The business was leaking revenue it didn't even know about." },
      { type: "heading", text: "What we built" },
      { type: "para", text: "The site wasn't complicated. It had a clean homepage with a strong hero image, a product catalogue with clear categories (bouquets, arrangements, subscriptions), a straightforward checkout with card payments via Stripe, and a delivery zone map so customers knew instantly if we could reach them. We also added a simple occasion-based filter — 'Birthday', 'Wedding', 'Sympathy', 'Just Because' — which made browsing feel intuitive and personal." },
      { type: "heading", text: "Why it worked: removing the 'think about it' moment" },
      { type: "para", text: "The biggest conversion win was instant pricing and instant checkout. When someone sees a bouquet they love at 9pm on a Tuesday, they can buy it in 90 seconds without waiting for a business to wake up and reply. E-commerce doesn't sleep. That single shift — from 'enquire and wait' to 'see it, buy it' — was responsible for the majority of the revenue uplift." },
      { type: "heading", text: "The role of photography" },
      { type: "para", text: "We spent one afternoon doing a proper product photography session with the owner's existing phone and a $30 ring light. Good lighting, clean backgrounds, consistent angles. The difference between blurry Instagram photos and clean product shots on a white background is enormous in terms of perceived value. Customers feel more confident buying something they can see clearly." },
      { type: "heading", text: "The numbers" },
      { type: "para", text: "Month 1: $8,400 in online orders. Month 2: $13,200. Month 3: $19,600. Total first quarter: $41,200. The site cost $1,500 to build. It paid for itself in the first week of operation. The owner now spends less time on admin and more time on the work she actually loves." },
      { type: "callout", text: "Every dollar you invest in the right website can return many times over. If your business is still relying on DMs, phone calls, or manual processes to take orders, there's a better way. Web Quokka builds affordable, high-converting e-commerce sites for small Australian businesses. Let's talk." },
    ],
  },
];

const BlogModal = ({ post, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 24, maxWidth: 680, width: "100%",
        maxHeight: "85vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
      }}>
        {/* Header */}
        <div style={{ height: 180, background: post.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, borderRadius: "24px 24px 0 0", position: "relative" }}>
          {post.emoji}
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.15)",
            border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
            fontSize: 18, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        {/* Body */}
        <div style={{ padding: "36px 40px 48px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: post.accent, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>{post.category}</div>
          <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: "#0a0f0d", lineHeight: 1.3, marginBottom: 8 }}>{post.title}</h2>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 32 }}>{post.date} · {post.readTime}</div>
          {post.content.map((block, i) => {
            if (block.type === "intro") return <p key={i} style={{ fontSize: 16, color: "#374151", lineHeight: 1.75, marginBottom: 24, fontWeight: 500 }}>{block.text}</p>;
            if (block.type === "heading") return <h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: "#0a0f0d", marginTop: 32, marginBottom: 10 }}>{block.text}</h3>;
            if (block.type === "para") return <p key={i} style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.8, marginBottom: 16 }}>{block.text}</p>;
            if (block.type === "callout") return (
              <div key={i} style={{ marginTop: 32, background: "#fdf5ec", borderLeft: `4px solid ${post.accent}`, borderRadius: "0 12px 12px 0", padding: "18px 22px" }}>
                <p style={{ fontSize: 14, color: "#78350f", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{block.text}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  const [ref, inView] = useInView();
  const [activePost, setActivePost] = useState(null);
  return (
    <section id="blog" style={{ background: "#fff" }}>
      {activePost && <BlogModal post={activePost} onClose={() => setActivePost(null)} />}
      <div className="section" ref={ref}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div>
            <div className={`fade-up${inView ? " visible" : ""}`}><span className="pill">Blog</span></div>
            <h2 className={`fade-up${inView ? " visible" : ""} d1`} style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 12 }}>
              Insights & <span style={{ color: "#c2773a" }}>tips</span>
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
            <article key={post.title} onClick={() => setActivePost(post)} style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 24, overflow: "hidden",
              transition: "transform 0.25s, box-shadow 0.25s", cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
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
              onMouseEnter={e => e.target.style.color = "#c2773a"}
              onMouseLeave={e => e.target.style.color = "#9ca3af"}>
              {s}
            </a>
          ))}
        </div>
        {/* Company */}
        <div>
          <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Company</h4>
          {[["Process", "#process"], ["Pricing", "#pricing"], ["Blog", "#blog"], ["Testimonials", "#testimonials"], ["Contact", "#contact"]].map(([l, h]) => (
            <a key={l} href={h} style={{ display: "block", marginBottom: 10, fontSize: 14, color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#c2773a"}
              onMouseLeave={e => e.target.style.color = "#9ca3af"}>
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
          onMouseEnter={e => { e.currentTarget.style.color = "#c2773a"; e.currentTarget.style.borderColor = "#c2773a"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          ⭐ Leave a Google Review
        </a>
        <p style={{ fontSize: 13 }}>Made with 💚 in Hurstville, NSW</p>
      </div>
    </div>

    <style>{`@media(max-width:768px){ footer > div > div:first-child { grid-template-columns: 1fr !important; } }`}</style>
  </footer>
);

/* ─────────────────────────────────────────────
   PAGE LOADER – Quokka runs along loading bar
───────────────────────────────────────────── */
const QuokkaRunning = () => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <style>{`
      @keyframes run-bob {
        0%,100% { transform: translateY(0px) rotate(-8deg); }
        50%      { transform: translateY(-5px) rotate(-10deg); }
      }
      @keyframes leg-a {
        0%,100% { transform-origin: 12px 0; transform: rotate(30deg); }
        50%      { transform-origin: 12px 0; transform: rotate(-40deg); }
      }
      @keyframes leg-b {
        0%,100% { transform-origin: 12px 0; transform: rotate(-40deg); }
        50%      { transform-origin: 12px 0; transform: rotate(30deg); }
      }
      @keyframes arm-a {
        0%,100% { transform-origin: 8px 0; transform: rotate(-40deg); }
        50%      { transform-origin: 8px 0; transform: rotate(20deg); }
      }
      @keyframes arm-b {
        0%,100% { transform-origin: 8px 0; transform: rotate(20deg); }
        50%      { transform-origin: 8px 0; transform: rotate(-40deg); }
      }
      @keyframes run-glow {
        0%,100% { filter: drop-shadow(0 0 0px #c2773a00); }
        50%      { filter: drop-shadow(0 2px 8px #c2773a66); }
      }
    `}</style>
    <div style={{ animation: "run-bob 0.35s ease-in-out infinite, run-glow 0.7s ease-in-out infinite" }}>
      <svg width="72" height="90" viewBox="0 0 72 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tail */}
        <path d="M52 58 Q64 50 61 64 Q59 72 51 67" stroke="#c2773a" strokeWidth="5" strokeLinecap="round" fill="none"/>
        {/* Body – leaned forward */}
        <ellipse cx="34" cy="60" rx="18" ry="15" fill="#c2773a" transform="rotate(-15 34 60)"/>
        {/* Belly */}
        <ellipse cx="34" cy="62" rx="10" ry="9" fill="#e8c49a" opacity="0.5" transform="rotate(-15 34 62)"/>
        {/* Back leg */}
        <g style={{ animation: "leg-b 0.35s ease-in-out infinite" }}>
          <line x1="26" y1="72" x2="14" y2="84" stroke="#c2773a" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="11" cy="86" rx="8" ry="4" fill="#c2773a" transform="rotate(-10 11 86)"/>
        </g>
        {/* Front leg */}
        <g style={{ animation: "leg-a 0.35s ease-in-out infinite" }}>
          <line x1="38" y1="72" x2="50" y2="82" stroke="#c2773a" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="53" cy="84" rx="8" ry="4" fill="#c2773a" transform="rotate(10 53 84)"/>
        </g>
        {/* Back arm */}
        <g style={{ animation: "arm-b 0.35s ease-in-out infinite" }}>
          <line x1="22" y1="54" x2="10" y2="62" stroke="#c2773a" strokeWidth="6" strokeLinecap="round"/>
        </g>
        {/* Front arm */}
        <g style={{ animation: "arm-a 0.35s ease-in-out infinite" }}>
          <line x1="40" y1="52" x2="54" y2="58" stroke="#c2773a" strokeWidth="6" strokeLinecap="round"/>
        </g>
        {/* Neck */}
        <ellipse cx="30" cy="44" rx="9" ry="7" fill="#c2773a" transform="rotate(-15 30 44)"/>
        {/* Head */}
        <circle cx="26" cy="28" r="20" fill="#c2773a"/>
        {/* Ear */}
        <ellipse cx="16" cy="12" rx="8" ry="12" fill="#c2773a" transform="rotate(-10 16 12)"/>
        <ellipse cx="16" cy="12" rx="5" ry="8" fill="#e8c49a" transform="rotate(-10 16 12)"/>
        <ellipse cx="36" cy="10" rx="8" ry="12" fill="#c2773a" transform="rotate(10 36 10)"/>
        <ellipse cx="36" cy="10" rx="5" ry="8" fill="#e8c49a" transform="rotate(10 36 10)"/>
        {/* Nose */}
        <ellipse cx="28" cy="34" rx="5" ry="3.5" fill="#8b4513"/>
        {/* Eyes – happy, wide open */}
        <circle cx="19" cy="26" r="4" fill="#0a0f0d"/>
        <circle cx="33" cy="25" r="4" fill="#0a0f0d"/>
        <circle cx="20" cy="24.5" r="1.5" fill="white"/>
        <circle cx="34" cy="23.5" r="1.5" fill="white"/>
        {/* Happy brows */}
        <path d="M14 21 Q19 18 24 21" stroke="#0a0f0d" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M28 20 Q33 17 38 20" stroke="#0a0f0d" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Big smile */}
        <path d="M18 32 Q26 39 34 32" stroke="#0a0f0d" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Cheeks */}
        <ellipse cx="13" cy="31" rx="5" ry="3" fill="#e8c49a" opacity="0.6"/>
        <ellipse cx="39" cy="30" rx="5" ry="3" fill="#e8c49a" opacity="0.6"/>
      </svg>
    </div>
  </div>
);

const PageLoader = ({ onDone }) => {
  const [phase, setPhase] = useState("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    const raf = (now) => {
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

      {/* Running quokka + progress bar track */}
      <div style={{ width: 280, position: "relative", marginBottom: 16 }}>
        {/* Quokka sits at the tip of the progress */}
        <div style={{
          position: "absolute",
          left: `${progress}%`,
          bottom: 14,
          transform: "translateX(-50%)",
          transition: "left 0.08s linear",
          pointerEvents: "none",
        }}>
          <QuokkaRunning />
        </div>
        {/* Track */}
        <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden", marginTop: 100 }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, #c2773a, #e8c49a)",
            width: `${progress}%`,
            transition: "width 0.08s linear",
            boxShadow: "0 0 10px #c2773a88",
          }} />
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#4b5563", fontVariantNumeric: "tabular-nums", marginBottom: 8 }}>
        {progress}%
      </div>
      <div style={{
        fontSize: 12, color: "#4b5563",
        fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em",
        transition: "opacity 0.3s",
      }}>
        {phase === "out" ? "here we go! 🚀" : "running your site to you..."}
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
        {/* <Team /> */}
        <Pricing />
        {/* <Portfolio /> */}
        <Blog />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      </div>
    </>
  );
}
