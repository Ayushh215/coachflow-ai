'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useInView, AnimatePresence } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const heroContainer = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const heroItem = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const staggerItem = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 2500, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) mv.set(target);
  }, [isInView, mv, target]);

  useEffect(() => {
    return spring.on('change', (v: number) => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref}>
      {prefix}{display}
      <span style={{ fontSize: 22, color: '#7C3AED', verticalAlign: 'super' }}>{suffix}</span>
    </span>
  );
}

export default function ClientSiteView({ data }: { data: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ student_name: '', parent_phone: '', class_level: '', course_interest: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(x - (testimonialsRef.current?.offsetLeft || 0));
    setScrollLeft(testimonialsRef.current?.scrollLeft || 0);
  };
  const handleDragEnd = () => setIsDragging(false);
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !testimonialsRef.current) return;
    e.preventDefault();
    const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const walk = (x - (testimonialsRef.current.offsetLeft || 0) - startX) * 2;
    testimonialsRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormStatus('loading');
    try {
      const res = await fetch('/api/sites/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: data.slug, ...formState }) });
      if (res.ok) { setFormStatus('success'); setFormState({ student_name: '', parent_phone: '', class_level: '', course_interest: '' }); } else { setFormStatus('error'); }
    } catch { setFormStatus('error'); }
  };

  return (
    <div style={{ background: '#000000', color: '#fff', fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { display: none; }
        .hover-white { transition: color 0.2s; }
        .hover-white:hover { color: #fff !important; }
        
        .nav-link { position: relative; color: rgba(255,255,255,0.45); text-decoration: none; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .nav-link::after { content: ''; position: absolute; left: 0; bottom: -4px; height: 1px; width: 0; background: #fff; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        
        .nav-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 30px; color: #fff; padding: 8px 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .nav-btn:hover { background: #fff; color: #000; }
        
        @keyframes orbFloat { 0%,100%{transform:translate(0,0);} 50%{transform:translate(24px,-18px);} }
        @keyframes shimmer { 0%{background-position:0% center;} 100%{background-position:200% center;} }
        
        .btn-primary { background: #7C3AED; color: #fff; padding: 13px 28px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; cursor: pointer; transition: all 0.3s; border: none; outline: none; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(124,58,237,0.4); }
        
        .btn-wa { background: transparent; border: 1px solid rgba(34,197,94,0.25); color: #22C55E; padding: 13px 28px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
        .btn-wa:hover { background: rgba(34,197,94,0.1); }
        
        .stat-cell { padding: 36px 48px; border-right: 1px solid rgba(255,255,255,0.06); transition: background 0.3s; }
        .stat-cell:last-child { border-right: none; }
        .stat-cell:hover { background: rgba(124,58,237,0.04); }
        
        .course-row { display: grid; grid-template-columns: 48px 1fr auto 100px 24px; gap: 28px; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.06); cursor: pointer; position: relative; transition: all 0.3s; align-items: center; }
        .course-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; right: 0; background: rgba(124,58,237,0.03); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; z-index: 0; pointer-events: none; }
        .course-row:hover { padding-left: 8px; }
        .course-row:hover::before { transform: scaleX(1); }
        .course-row:hover .course-name { color: #A78BFA; }
        .course-row:hover .course-arrow { color: #7C3AED; transform: translateX(8px); }
        
        .course-name { font-size: 26px; font-weight: 800; transition: color 0.3s; z-index: 1; margin: 0; }
        .course-number { font-family: monospace; color: rgba(255,255,255,0.25); font-size: 14px; z-index: 1; }
        .course-tag { background: rgba(124,58,237,0.1); color: #A78BFA; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; z-index: 1; }
        .course-fee { font-size: 16px; font-weight: 800; color: rgba(255,255,255,0.4); z-index: 1; text-align: right; }
        .course-arrow { transition: all 0.3s; z-index: 1; color: rgba(255,255,255,0.2); }
        
        .grid-cell { background: #030307; padding: 44px 36px; transition: background 0.3s; }
        .grid-cell:hover { background: #080012; }
        
        .faculty-cell { background: #000; padding: 44px 36px; transition: background 0.3s; display: flex; gap: 20px; align-items: center; }
        .faculty-cell:hover { background: #070010; }
        
        .testi-card { background: #0A0010; border: 1px solid rgba(255,255,255,0.05); padding: 36px; min-width: 340px; transition: all 0.3s; user-select: none; }
        .testi-card:hover { border-color: rgba(124,58,237,0.25); transform: translateY(-4px); }
        
        .form-input { padding: 10px 0; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: 14px; width: 100%; transition: border-color 0.2s; outline: none; }
        .form-input:focus { border-bottom-color: #7C3AED; }
        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        
        @media (max-width: 768px) {
          .nav-links, .nav-btn-desktop { display: none !important; }
          .hero, .courses, .results, .faculty, .contact, .footer, .stat-cell { padding-left: 24px !important; padding-right: 24px !important; }
          .hero-h1 { font-size: 42px !important; letter-spacing: -2px !important; }
          .hero-bottom-row { flex-direction: column; align-items: flex-start !important; gap: 24px; }
          .stat-grid { grid-template-columns: 1fr !important; }
          .stat-cell { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 24px !important; }
          .course-row { grid-template-columns: 1fr; gap: 12px; padding: 16px 0 !important; }
          .course-number, .course-arrow { display: none; }
          .course-fee { text-align: left; }
          .grid-container { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .footer-flex { flex-direction: column; text-align: center; gap: 24px; }
          .footer-flex > div { text-align: center !important; }
        }
      `}} />

      {/* 1. NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', height: 56, padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="hero">
        <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>
          {data.institute_name} <span style={{ color: '#7C3AED' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }} className="nav-links">
          {['Courses', 'Results', 'Faculty', 'Testimonials'].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>)}
        </div>
        <a href="#contact" className="nav-btn nav-btn-desktop">Enquire</a>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, display: 'none' }} className="show-mobile" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>☰</button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ position: 'fixed', top: 56, left: 0, right: 0, background: '#000', borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 99, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {['Courses', 'Results', 'Faculty', 'Testimonials', 'Contact'].map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#fff', fontSize: 18, fontWeight: 700, textDecoration: 'none' }}>{l}</a>)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO */}
      <section id="home" className="hero" style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 48px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(124,58,237,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.05) 1px,transparent 1px)', backgroundSize: '48px 48px', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: -150, right: -150, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 60%)', animation: 'orbFloat 10s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: 0, left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 60%)', animation: 'orbFloat 13s ease-in-out infinite reverse', pointerEvents: 'none', zIndex: 0 }} />

        <motion.div variants={heroContainer} initial="hidden" animate="show" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <motion.div variants={heroItem} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 1, background: '#7C3AED' }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: '#7C3AED', textTransform: 'uppercase', fontWeight: 700 }}>Coaching Excellence Since 2014</span>
          </motion.div>

          <motion.h1 className="hero-h1" variants={heroItem} style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.93, letterSpacing: -4, marginBottom: 48 }}>
            <div style={{ color: '#fff', marginBottom: 8 }}>{data.institute_name}</div>
            <div style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4 80%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite', paddingRight: '0.1em' }}>
              {data.tagline || 'Redefining Success.'}
            </div>
          </motion.h1>

          <motion.div variants={heroItem} className="hero-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 320, lineHeight: 1.8 }}>
              {data.about_text || 'Premium education with personalized attention, guiding you towards intellectual excellence and top-tier results.'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a href="#contact" className="btn-primary" style={{ textAlign: 'center' }}>Request a Callback</a>
              <a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online`} target="_blank" rel="noreferrer" className="btn-wa">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. STATS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="stat-grid max-w-7xl mx-auto">
        {[{ n: 500, s: '+', l: 'Students Enrolled' }, { n: 95, s: '%', l: 'Success Rate' }, { n: 10, s: '+', l: 'Years Experience' }].map((st, i) => (
          <div key={i} className="stat-cell">
            <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}><Counter target={st.n} suffix={st.s} /></div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>{st.l}</div>
          </div>
        ))}
      </div>

      {/* 4. COURSES */}
      <section id="courses" className="courses" style={{ padding: '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontSize: 10, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>Our Programs</div>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, margin: 0 }}>Our Courses</h2>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', maxWidth: 240, lineHeight: 1.6 }}>Curated curriculums designed to forge intellectual resilience and mastery.</div>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {data.courses && data.courses.map((c: any, i: number) => (
            <motion.div key={i} variants={staggerItem} className="course-row" onClick={() => document.getElementById('contact')?.scrollIntoView()}>
              <div className="course-number">{(i + 1).toString().padStart(2, '0')}</div>
              <h3 className="course-name">{c.name}</h3>
              <div><span className="course-tag">{c.description?.split(' ')[0] || 'Premium'}</span></div>
              <div className="course-fee">{c.fee}</div>
              <div className="course-arrow">→</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. RESULTS */}
      <section id="results" className="results" style={{ background: '#030307', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} style={{ marginBottom: 52 }}>
            <div style={{ fontSize: 10, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>Proven Track Record</div>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, margin: 0 }}>Our Achievers</h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)' }}>
            {data.results && data.results.map((r: any, i: number) => (
              <motion.div key={i} variants={staggerItem} className="grid-cell">
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 16 }}>{r.year} • {r.exam}</div>
                <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -3, marginBottom: 24, background: 'linear-gradient(135deg, #fff, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{r.score}</div>
                <div style={{ width: 28, height: 2, background: '#7C3AED', marginBottom: 24 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{r.student_name}</div>
                  <div style={{ fontSize: 10, color: '#22C55E', letterSpacing: 1, fontWeight: 700, textTransform: 'uppercase' }}>Top Ranker</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section id="testimonials" className="testimonials" style={{ padding: '100px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} style={{ padding: '0 48px', marginBottom: 52 }}>
            <div style={{ fontSize: 10, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>Success Stories</div>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, margin: 0 }}>What Parents Say</h2>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }}>
          <div ref={testimonialsRef} onMouseDown={handleDragStart} onMouseLeave={handleDragEnd} onMouseUp={handleDragEnd} onMouseMove={handleDragMove} onTouchStart={handleDragStart} onTouchEnd={handleDragEnd} onTouchMove={handleDragMove} style={{ display: 'flex', gap: 20, padding: '0 48px', overflowX: 'auto', cursor: isDragging ? 'grabbing' : 'grab' }}>
            {data.testimonials && data.testimonials.map((t: any, i: number) => (
              <div key={i} className="testi-card">
                <div style={{ fontSize: 40, color: '#7C3AED', fontFamily: 'Georgia, serif', lineHeight: 0.5, marginBottom: 16 }}>"</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 32, minHeight: 80 }}>{t.text}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 7. FACULTY */}
      <section id="faculty" className="faculty" style={{ padding: '100px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} style={{ marginBottom: 52 }}>
            <div style={{ fontSize: 10, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>Editorial Board</div>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, margin: 0 }}>Expert Faculty</h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)' }}>
            {data.faculty && data.faculty.map((f: any, i: number) => (
              <motion.div key={i} variants={staggerItem} className="faculty-cell">
                <div style={{ width: 60, height: 60, borderRadius: 6, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{f.initials}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{f.name}</h4>
                    <span style={{ border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA', fontSize: 10, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>{f.subject}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{f.experience}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. CONTACT */}
      <section id="contact" className="contact" style={{ padding: '100px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72 }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, ease: EASE }}>
              <div style={{ fontSize: 10, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>Get In Touch</div>
              <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, margin: '0 0 24px 0' }}>Request a Callback</h2>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 48, maxWidth: 360 }}>
                Leave your details below and our counseling director will connect with you to discuss the optimal path forward.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}><span style={{ color: '#fff', fontWeight: 700, display: 'inline-block', width: 80 }}>Email</span> info@coachflow.ai</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}><span style={{ color: '#fff', fontWeight: 700, display: 'inline-block', width: 80 }}>Phone</span> +91 {data.phone}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}><span style={{ color: '#fff', fontWeight: 700, display: 'inline-block', width: 80 }}>Address</span> <span style={{ display: 'inline-block', width: 'max-content', maxWidth: '70%', verticalAlign: 'top' }}>{data.address}</span></div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, ease: EASE }}>
              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', padding: 48 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 24 }}>✓</div>
                    <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Received.</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>We will connect with you shortly.</div>
                    <button onClick={() => setFormStatus('idle')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 20px', fontSize: 12, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>Send Another</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Student Name</label>
                        <input required type="text" className="form-input" placeholder="e.g. Rahul Sharma" value={formState.student_name} onChange={e => setFormState({ ...formState, student_name: e.target.value })} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Parent Contact</label>
                        <input required type="text" className="form-input" placeholder="+91" value={formState.parent_phone} onChange={e => setFormState({ ...formState, parent_phone: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Class / Year</label>
                        <select required className="form-input" style={{ WebkitAppearance: 'none' }} value={formState.class_level} onChange={e => setFormState({ ...formState, class_level: e.target.value })}>
                          <option value="" disabled style={{ color: 'rgba(255,255,255,0.3)' }}>Select</option>
                          {['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Dropper'].map(c => <option key={c} value={c} style={{ background: '#000', color: '#fff' }}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Program</label>
                        <select required className="form-input" style={{ WebkitAppearance: 'none' }} value={formState.course_interest} onChange={e => setFormState({ ...formState, course_interest: e.target.value })}>
                          <option value="" disabled style={{ color: 'rgba(255,255,255,0.3)' }}>Select</option>
                          {data.courses?.map((c: any, i: number) => <option key={i} value={c.name} style={{ background: '#000', color: '#fff' }}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <button type="submit" disabled={formStatus === 'loading'} className="btn-primary" style={{ width: '100%', marginTop: 16 }}>{formStatus === 'loading' ? 'Processing...' : 'Submit Request'}</button>
                    {formStatus === 'error' && <div style={{ color: '#EF4444', fontSize: 12, textAlign: 'center' }}>Something went wrong. Please try again.</div>}
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="footer-flex">
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{data.institute_name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{data.address} • {data.phone}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              <a href="#" className="hover-white" style={{ textDecoration: 'none', color: 'inherit', marginRight: 16 }}>Privacy Policy</a>
              <a href="#" className="hover-white" style={{ textDecoration: 'none', color: 'inherit' }}>Terms of Service</a>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Powered by <span style={{ color: '#7C3AED', fontWeight: 600 }}>CoachFlow AI</span></div>
          </div>
        </div>
      </footer>

      {/* 10. WHATSAPP */}
      <motion.a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online`} target="_blank" rel="noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ position: 'fixed', bottom: 32, right: 32, width: 50, height: 50, borderRadius: '50%', background: '#22C55E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, zIndex: 100, boxShadow: '0 4px 20px rgba(34,197,94,0.4)', cursor: 'pointer', textDecoration: 'none' }}>
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
      </motion.a>
    </div>
  );
}
