'use client';
import React, { useEffect, useRef, useState, MouseEvent as RMouseEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, AnimatePresence, stagger, useAnimate } from 'framer-motion';

/* ═══════ ACETERNITY: Spotlight ═══════ */
const Spotlight = ({ className, fill }: { className?: string; fill?: string }) => (
  <svg className={`animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0 ${className || ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3787 2842" fill="none">
    <g filter="url(#filter)"><ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" fill={fill || 'white'} fillOpacity="0.21" /></g>
    <defs><filter id="filter" x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" /></filter></defs>
  </svg>
);

/* ═══════ ACETERNITY: CardSpotlight ═══════ */
const CardSpotlight = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }: RMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left); mouseY.set(clientY - top);
  }
  return (
    <motion.div className={`group/spotlight relative rounded-2xl border border-[rgba(255,255,255,0.07)] p-6 ${className || ''}`} style={{ background: '#0D0D14' }} onMouseMove={handleMouseMove} whileHover={{ y: -8, scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
      <motion.div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100" style={{ background: `radial-gradient(600px circle at var(--mx) var(--my), rgba(124,58,237,0.15), transparent 40%)`, ['--mx' as any]: mouseX, ['--my' as any]: mouseY }} />
      {children}
    </motion.div>
  );
};

/* ═══════ ACETERNITY: InfiniteMovingCards ═══════ */
const InfiniteMovingCards = ({ items, direction = 'left', speed = 'slow' }: { items: { quote: string; name: string; title: string }[]; direction?: 'left' | 'right'; speed?: 'fast' | 'normal' | 'slow' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    const items = Array.from(scrollerRef.current.children);
    items.forEach(item => scrollerRef.current!.appendChild(item.cloneNode(true)));
    containerRef.current.style.setProperty('--animation-direction', direction === 'left' ? 'forwards' : 'reverse');
    containerRef.current.style.setProperty('--animation-duration', speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s');
    setStart(true);
  }, [direction, speed]);
  return (
    <div ref={containerRef} className="relative z-20 max-w-7xl overflow-hidden" style={{ maskImage: 'linear-gradient(to right,transparent,white 20%,white 80%,transparent)', WebkitMaskImage: 'linear-gradient(to right,transparent,white 20%,white 80%,transparent)' }}>
      <ul ref={scrollerRef} className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${start ? 'animate-scroll' : ''}`} style={{ listStyle: 'none', margin: 0, padding: '16px 0' }}>
        {items.map((item, idx) => (
          <li key={idx} className="flex-shrink-0" style={{ width: 350, maxWidth: '100%', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', background: '#0D0D14', padding: '24px 32px' }}>
            <div style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 16, lineHeight: 1.6 }}>&ldquo;{item.quote}&rdquo;</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{item.name}</div>
            <div style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>{item.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ═══════ ACETERNITY: TextGenerateEffect ═══════ */
const TextGenerateEffect = ({ words, className }: { words: string; className?: string }) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');
  useEffect(() => { animate('span', { opacity: 1 }, { duration: 2, delay: stagger(0.2) }); }, [animate]);
  return (
    <motion.div ref={scope} className={className}>
      {wordsArray.map((word, idx) => <motion.span key={idx} style={{ opacity: 0, color: '#fff' }}>{word}{' '}</motion.span>)}
    </motion.div>
  );
};

/* ═══════ Counter ═══════ */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 2000 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (isInView) mv.set(target); }, [isInView, mv, target]);
  useEffect(() => { const u = spring.on('change', (v: number) => setDisplay(Math.round(v))); return u; }, [spring]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ═══════ Constants ═══════ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const cardContainer = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const cardItem = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function ClientSiteView({ data }: { data: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [formState, setFormState] = useState({ student_name: '', parent_phone: '', class_level: '', course_interest: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ['rgba(6,6,10,0)', 'rgba(6,6,10,0.95)']);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormStatus('loading');
    try {
      const res = await fetch('/api/sites/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: data.slug, ...formState }) });
      if (res.ok) { setFormStatus('success'); setFormState({ student_name: '', parent_phone: '', class_level: '', course_interest: '', message: '' }); } else { setFormStatus('error'); }
    } catch { setFormStatus('error'); }
  };

  const testimonialItems = (data.testimonials || []).map((t: any) => ({ quote: t.text, name: t.name, title: t.role }));

  /* ═══════ Inline styles ═══════ */
  const S = {
    page: { backgroundColor: '#06060A', fontFamily: 'system-ui, "Segoe UI", sans-serif', minHeight: '100vh', color: '#fff', overflowX: 'hidden' as const },
    grid: { backgroundImage: 'linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' },
    navLink: { color: '#6B7280', textDecoration: 'none' as const, fontSize: 14, fontWeight: 500, transition: 'color 0.3s' },
    btnPurple: { background: 'linear-gradient(135deg, #7C3AED, #6366F1)', color: '#fff', border: 'none', cursor: 'pointer' },
    btnWA: { background: 'rgba(34,197,94,0.1)', border: '1px solid #22C55E', color: '#22C55E' },
    cardDark: { background: '#0D0D14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 },
    input: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none', fontSize: 14, borderRadius: 8, padding: '12px 16px', width: '100%' },
    sectionTitle: (mb = 16) => ({ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 3, color: '#7C3AED', marginBottom: mb > 4 ? 12 : 4 }),
    h2: { fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: -1.5, margin: 0 },
    line: { height: 2, background: '#7C3AED', transformOrigin: 'left' as const, maxWidth: 80, margin: '16px auto 0' },
    sub: { color: '#6B7280', fontSize: 14 },
    tag: { display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: 'rgba(124,58,237,0.1)', color: '#7C3AED' },
  };

  const WASvg = <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>;

  return (
    <div style={S.page}>
      {/* ══════ FLOATING NAVBAR ══════ */}
      <motion.nav style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 50, backgroundColor: navBg as any, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 32, maxWidth: 900, width: '90%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ ...S.btnPurple, width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, animation: 'pulse-ring-ace 2s cubic-bezier(0.215,0.61,0.355,1) infinite' }}>{data.logo_text}</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{data.institute_name}</span>
        </div>
        <div style={{ display: 'flex', gap: 24, flex: 1, justifyContent: 'center' }} className="hidden-mobile">
          {['Home', 'Courses', 'Results', 'Faculty', 'Contact'].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={S.navLink} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>{l}</a>)}
        </div>
        <motion.a href="#contact" style={{ ...S.btnPurple, padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }} whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(124,58,237,0.45)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="hidden-mobile">Enquire Now</motion.a>
        <button style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }} className="show-mobile" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>☰</button>
      </motion.nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .hidden-mobile { display: flex; }
        .show-mobile { display: none !important; }
        @media(max-width:768px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}} />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ position: 'fixed', top: 80, left: '5%', right: '5%', zIndex: 49, background: 'rgba(6,6,10,0.95)', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Home', 'Courses', 'Results', 'Faculty', 'Contact'].map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#fff', fontSize: 18, fontWeight: 600, textDecoration: 'none' }}>{l}</a>)}
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} style={{ ...S.btnPurple, padding: 14, borderRadius: 12, textAlign: 'center', fontWeight: 700, textDecoration: 'none' }}>Enquire Now</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════ HERO ══════ */}
      <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 96, paddingBottom: 64, overflow: 'hidden', background: '#06060A' }}>
        <div style={{ ...S.grid, position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#7C3AED" />
        <motion.div animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.05, 0.97, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <motion.div animate={{ x: [0, -25, 20, 0], y: [0, 15, -25, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: -60, left: -60, width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '0 auto', padding: '0 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: EASE }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, marginBottom: 32, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 0 rgba(34,197,94,0.7)', animation: 'pulse-ring-ace 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#7C3AED' }}>ADMISSIONS OPEN 2024–25</span>
          </motion.div>

          <TextGenerateEffect words={data.institute_name} className="" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} style={{ fontSize: 'clamp(32px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: -3, marginBottom: 24, background: 'linear-gradient(90deg, #7C3AED, #6366F1, #06b6d4, #7C3AED)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer-ace 4s linear infinite' }}>
            {data.tagline || 'Excellence in Education'}
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.7, ease: EASE }} style={{ fontSize: 17, color: '#6B7280', marginBottom: 40, maxWidth: 500, lineHeight: 1.6 }}>
            {data.about_text || 'Join thousands of successful students and accelerate your learning journey with expert educators.'}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: 0.7, ease: EASE }} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
            <motion.a href="#contact" style={{ ...S.btnPurple, padding: '16px 32px', borderRadius: 12, fontSize: 18, fontWeight: 700, textDecoration: 'none' }} whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(124,58,237,0.45)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>Book Free Demo Class</motion.a>
            <motion.a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online`} target="_blank" rel="noreferrer" style={{ ...S.btnWA, padding: '16px 32px', borderRadius: 12, fontSize: 18, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }} whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(34,197,94,0.35)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>{WASvg} WhatsApp Us</motion.a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 0.7, ease: EASE }} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, width: '100%', maxWidth: 700 }}>
            {[{ n: 500, s: '+', l: 'Students Enrolled' }, { n: 95, s: '%', l: 'Success Rate' }, { n: 10, s: '+', l: 'Years Experience' }].map((st, i) => (
              <motion.div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, textAlign: 'center' }} whileHover={{ y: -4, borderColor: 'rgba(124,58,237,0.4)' }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <div style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg, #FFFFFF, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}><Counter target={st.n} suffix={st.s} /></div>
                <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 500 }}>{st.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══════ COURSES — CardSpotlight ══════ */}
      <section id="courses" style={{ padding: '96px 16px', maxWidth: 1152, margin: '0 auto', background: '#06060A' }}>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={S.sectionTitle()}>Our Courses</div>
          <h2 style={S.h2}>Master Your Future</h2>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={S.line} />
        </motion.div>
        <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }} variants={cardContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {data.courses && data.courses.map((c: any, i: number) => (
            <motion.div key={i} variants={cardItem}>
              <CardSpotlight className={i === 1 ? 'relative' : ''}>
                {i === 1 && <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #F59E0B, #F97316)', color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '4px 12px', borderRadius: '0 16px 0 12px', zIndex: 20 }}>POPULAR</div>}
                <div style={S.tag}>{c.fee}</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '16px 0' }}>{c.name}</h3>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>{c.description}</p>
                <motion.a href="#contact" style={{ display: 'block', textAlign: 'center', padding: 12, borderRadius: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }} whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.97 }}>Enquire Now</motion.a>
              </CardSpotlight>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════ RESULTS ══════ */}
      <section id="results" style={{ padding: '96px 16px', background: '#06060A' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.sectionTitle()}>Proven Track Record</div>
            <h2 style={S.h2}>Our Achievers</h2>
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={S.line} />
          </motion.div>
          <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }} variants={cardContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {data.results && data.results.map((r: any, i: number) => (
              <motion.div key={i} variants={cardItem} whileHover={{ y: -8, scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} style={{ ...S.cardDark, padding: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 128, height: 128, borderRadius: '50%', filter: 'blur(48px)', background: 'rgba(124,58,237,0.2)', animation: 'glow-pulse-ace 3s infinite' }} />
                <div style={{ color: '#6B7280', fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>{r.year} • {r.exam}</div>
                <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 24, lineHeight: 1, background: 'linear-gradient(135deg, #FFFFFF, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{r.score}</div>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{r.student_name}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px', borderRadius: 4, background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>Top Performer</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS — InfiniteMovingCards ══════ */}
      <section style={{ padding: '96px 16px', background: '#06060A', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.sectionTitle()}>Testimonials</div>
            <h2 style={S.h2}>What Parents Say</h2>
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={S.line} />
          </motion.div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <InfiniteMovingCards items={testimonialItems} direction="left" speed="slow" />
          </div>
        </div>
      </section>

      {/* ══════ FACULTY — 3D tilt ══════ */}
      <section id="faculty" style={{ padding: '96px 16px', background: '#06060A', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.sectionTitle()}>Expert Faculty</div>
            <h2 style={S.h2}>Learn From The Best</h2>
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={S.line} />
          </motion.div>
          <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 32, perspective: 1000 }} variants={cardContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {data.faculty && data.faculty.map((m: any, i: number) => (
              <motion.div key={i} variants={cardItem} whileHover={{ rotateX: -5, rotateY: 5, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={{ ...S.cardDark, padding: 24, display: 'flex', alignItems: 'center', gap: 24, transformStyle: 'preserve-3d' }}>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 80, height: 80, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 900, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #6366F1)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>{m.initials}</motion.div>
                <div>
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{m.name}</h4>
                  <div style={S.tag}>{m.subject}</div>
                  <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 500, marginTop: 8 }}>{m.experience}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ CONTACT FORM ══════ */}
      <section id="contact" style={{ padding: '96px 16px', background: '#06060A' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7, ease: EASE }} style={{ ...S.cardDark, borderRadius: 20, padding: 48 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={S.sectionTitle()}>Get in Touch</div>
              <h3 style={{ fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 16 }}>Request a Callback</h3>
              <p style={S.sub}>Leave your details and our counselor will reach out to you.</p>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={S.line} />
            </div>
            <AnimatePresence mode="wait">
              {formStatus === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 0', gap: 16 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }} style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#22C55E', background: 'rgba(34,197,94,0.1)' }}>✓</motion.div>
                  <h4 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Request Sent!</h4>
                  <p style={S.sub}>Our expert counselor will contact you shortly.</p>
                  <motion.button onClick={() => setFormStatus('idle')} style={{ marginTop: 24, padding: '8px 24px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Send another</motion.button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleFormSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 24 }}>
                    <div><label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Student Name</label><input required type="text" style={S.input} value={formState.student_name} onChange={e => setFormState({ ...formState, student_name: e.target.value })} placeholder="John Doe" onFocus={e => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} /></div>
                    <div><label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Parent Phone</label><input required type="tel" style={S.input} value={formState.parent_phone} onChange={e => setFormState({ ...formState, parent_phone: e.target.value })} placeholder="+91 9999999999" onFocus={e => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 24 }}>
                    <div><label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Class Level</label><select required style={{ ...S.input, appearance: 'none' }} value={formState.class_level} onChange={e => setFormState({ ...formState, class_level: e.target.value })}><option value="" disabled>Select Class</option>{['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Dropper'].map(c => <option key={c} value={c} style={{ background: '#0D0D14' }}>{c}</option>)}</select></div>
                    <div><label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Course Interest</label><select required style={{ ...S.input, appearance: 'none' }} value={formState.course_interest} onChange={e => setFormState({ ...formState, course_interest: e.target.value })}><option value="" disabled>Select Course</option>{data.courses && data.courses.map((c: any, i: number) => <option key={i} value={c.name} style={{ background: '#0D0D14' }}>{c.name}</option>)}</select></div>
                  </div>
                  <motion.button disabled={formStatus === 'loading'} type="submit" style={{ ...S.btnPurple, width: '100%', padding: 16, borderRadius: 12, fontSize: 14, fontWeight: 700, marginTop: 8, opacity: formStatus === 'loading' ? 0.5 : 1 }} whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(124,58,237,0.45)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>{formStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry Request'}</motion.button>
                  {formStatus === 'error' && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#EF4444', fontWeight: 500, textAlign: 'center', fontSize: 12, marginTop: 8 }}>Connection error. Please try again or WhatsApp us.</motion.p>}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }} style={{ padding: '48px 16px', background: '#06060A', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
          <div><div style={{ fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 8 }}>{data.institute_name}</div><p style={{ fontSize: 14, color: '#4B5563' }}>{data.address} • +91 {data.phone}</p></div>
          <div style={{ textAlign: 'right' }}><div style={{ color: '#6B7280', fontSize: 14, marginBottom: 8, display: 'flex', gap: 16 }}><a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy</a><a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms</a></div><div style={{ color: '#4B5563', fontSize: 12 }}>Powered by <span style={{ fontWeight: 700, color: '#7C3AED' }}>CoachFlow AI</span></div></div>
        </div>
      </motion.footer>

      {/* ══════ WhatsApp Float ══════ */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        <AnimatePresence>
          {isWhatsAppOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} style={{ ...S.cardDark, padding: 20, width: 288, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><div style={{ fontWeight: 700, color: '#fff', fontSize: 14, display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>💬</span>Support</div><button onClick={() => setIsWhatsAppOpen(false)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 16 }}>✕</button></div>
              <p style={{ color: '#6B7280', marginBottom: 16, fontSize: 12 }}>Looking for admission details?</p>
              <a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online`} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', padding: 10, borderRadius: 8, ...S.btnWA, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Start Chat</a>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)} style={{ width: 56, height: 56, borderRadius: '50%', background: '#22C55E', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(34,197,94,0.4)' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>{WASvg}</motion.button>
      </div>
    </div>
  );
}
