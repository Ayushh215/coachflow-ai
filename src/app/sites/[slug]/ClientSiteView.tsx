'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useSpring,
    useInView,
    AnimatePresence,
} from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════════ */

const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

// 1. Hero stagger container + item
const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};
const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

// 3. Staggered card container + item
const cardContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_PREMIUM } },
};

/* ═══════════════════════════════════════════════════════════════════════
   6. COUNTER COMPONENT — spring-based number animation
   ═══════════════════════════════════════════════════════════════════════ */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const motionVal = useMotionValue(0);
    const spring = useSpring(motionVal, { duration: 2000 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (isInView) motionVal.set(target);
    }, [isInView, motionVal, target]);

    useEffect(() => {
        const unsub = spring.on('change', (v: number) => setDisplay(Math.round(v)));
        return unsub;
    }, [spring]);

    return (
        <span ref={ref}>
            {display}
            {suffix}
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function ClientSiteView({ data }: { data: any }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

    // Form state
    const [formState, setFormState] = useState({
        student_name: '',
        parent_phone: '',
        class_level: '',
        course_interest: '',
        message: '',
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // 8. Smooth navbar on scroll
    const { scrollY } = useScroll();
    const navBg = useTransform(scrollY, [0, 100], ['rgba(6,6,10,0)', 'rgba(6,6,10,0.95)']);
    const navBorder = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.05)']);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('loading');
        try {
            const res = await fetch('/api/sites/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: data.slug, ...formState }),
            });
            if (res.ok) {
                setFormStatus('success');
                setFormState({ student_name: '', parent_phone: '', class_level: '', course_interest: '', message: '' });
            } else {
                setFormStatus('error');
            }
        } catch {
            setFormStatus('error');
        }
    };

    return (
        <div
            className="min-h-screen text-[#FFFFFF] overflow-x-hidden font-sans"
            style={{ backgroundColor: '#06060A', fontFamily: 'system-ui, "Segoe UI", sans-serif' }}
        >
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
                    70% { box-shadow: 0 0 0 16px rgba(124, 58, 237, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
                }
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }

                /* Navigation link with animated underline */
                .nav-link {
                    position: relative;
                    color: #6B7280;
                    transition: color 0.3s ease;
                    text-decoration: none;
                }
                .nav-link:hover { color: #FFFFFF; }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background-color: #7C3AED;
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after { width: 100%; }

                /* Purple gradient button */
                .btn-purple {
                    background: linear-gradient(135deg, #7C3AED, #6366F1);
                }

                /* WhatsApp button style */
                .btn-whatsapp {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid #22C55E;
                    color: #22C55E;
                    transition: all 0.3s ease;
                }
                .btn-whatsapp:hover {
                    background: rgba(34, 197, 94, 0.2);
                    box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.3);
                }

                /* Dark card */
                .card-dark {
                    background: #0D0D14;
                    border: 1px solid rgba(255, 255, 255, 0.07);
                    border-radius: 16px;
                }

                /* Testimonial card hover — subtle purple tint */
                .card-dark.testimonial-card:hover {
                    border-color: rgba(124, 58, 237, 0.3);
                }

                /* Stats card */
                .stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.07);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                }
                .stat-card:hover {
                    background: rgba(124, 58, 237, 0.05);
                    border-color: rgba(124, 58, 237, 0.3);
                }

                /* Gradient text: white → purple */
                .text-gradient-purple {
                    background: linear-gradient(135deg, #FFFFFF, #7C3AED);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                /* 7. Shimmer gradient text: purple → indigo → cyan */
                .text-gradient-shimmer {
                    background: linear-gradient(90deg, #7C3AED, #6366F1, #06b6d4, #7C3AED);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 4s linear infinite;
                }

                /* Dark input */
                .input-dark {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: #FFFFFF;
                    transition: all 0.3s ease;
                }
                .input-dark:focus {
                    outline: none;
                    border-color: #7C3AED;
                    background: rgba(124, 58, 237, 0.05);
                    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
                }
                .input-dark::placeholder { color: #4B5563; }

                /* Animation classes */
                .logo-icon { animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
                .glow-pulse { animation: glow-pulse 3s infinite; }

                /* Green pulsing dot */
                .pulsing-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    background-color: #22C55E;
                    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                    animation: pulse-ring 2s infinite;
                }

                /* WhatsApp floating button pulse */
                .whatsapp-float {
                    animation: pulse-ring 2s infinite;
                }

                /* Enquire button on course cards */
                .enquire-btn {
                    background: rgba(124, 58, 237, 0.1);
                    border: 1px solid rgba(124, 58, 237, 0.2);
                    transition: all 0.3s ease;
                }
                .enquire-btn:hover {
                    transform: scale(1.05);
                    background: rgba(124, 58, 237, 0.2);
                }
            `,
                }}
            />

            {/* ═══════════════════════════════════════════ */}
            {/* 1. NAVBAR — sticky, blur backdrop, scroll-reactive */}
            {/* ═══════════════════════════════════════════ */}
            <motion.nav
                className="fixed w-full z-50 py-4"
                style={{
                    backgroundColor: navBg,
                    borderBottom: '1px solid',
                    borderColor: navBorder,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* Left: Logo + Institute Name */}
                    <div className="flex items-center gap-3 w-1/4">
                        <div
                            className="logo-icon w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-md"
                            style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)' }}
                        >
                            {data.logo_text}
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">{data.institute_name}</span>
                    </div>

                    {/* Center: Nav Links */}
                    <div className="hidden md:flex flex-1 justify-center gap-8 items-center text-sm font-medium">
                        <a href="#home" className="nav-link">Home</a>
                        <a href="#courses" className="nav-link">Courses</a>
                        <a href="#results" className="nav-link">Results</a>
                        <a href="#faculty" className="nav-link">Faculty</a>
                        <a href="#contact" className="nav-link">Contact</a>
                    </div>

                    {/* Right: Enquire Now — 5. Button hover */}
                    <div className="hidden md:flex w-1/4 justify-end">
                        <motion.a
                            href="#contact"
                            className="inline-flex px-6 py-2.5 rounded-full text-white font-bold text-sm btn-purple whitespace-nowrap"
                            whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(124,58,237,0.45)' }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            Enquire Now
                        </motion.a>
                    </div>

                    {/* Mobile hamburger */}
                    <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <div className="space-y-1.5 p-2 text-white">
                            <div className="w-6 h-0.5 bg-current"></div>
                            <div className="w-6 h-0.5 bg-current"></div>
                            <div className="w-6 h-0.5 bg-current"></div>
                        </div>
                    </button>
                </div>

                {/* Mobile menu dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                            className="md:hidden absolute top-full left-0 w-full shadow-xl py-6 flex flex-col px-6 gap-6 font-semibold border-t border-white/10"
                            style={{ backgroundColor: 'rgba(6, 6, 10, 0.95)', backdropFilter: 'blur(20px)' }}
                        >
                            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg">Home</a>
                            <a href="#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg">Courses</a>
                            <a href="#results" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg">Results</a>
                            <a href="#faculty" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg">Faculty</a>
                            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg">Contact</a>
                            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl text-white font-bold text-center mt-2 text-lg whitespace-nowrap btn-purple">
                                Enquire Now
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ═══════════════════════════════════════════ */}
            {/* 2. HERO — staggered reveal, orbs, grid bg  */}
            {/* ═══════════════════════════════════════════ */}
            <section
                id="home"
                className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden w-full"
                style={{ backgroundColor: '#06060A' }}
            >
                {/* Background grid */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                ></div>

                {/* 9. Floating orbs — Framer Motion */}
                <motion.div
                    animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.05, 0.97, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        top: -80,
                        right: -80,
                        width: 500,
                        height: 500,
                        background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)',
                        pointerEvents: 'none',
                    }}
                />
                <motion.div
                    animate={{ x: [0, -25, 20, 0], y: [0, 15, -25, 0], scale: [1, 0.97, 1.05, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        bottom: -60,
                        left: -60,
                        width: 500,
                        height: 500,
                        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* 1. Staggered hero reveal */}
                <motion.div
                    className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-12 flex flex-col items-center w-full"
                    variants={heroContainer}
                    initial="hidden"
                    animate="show"
                >
                    {/* Green dot pill badge */}
                    <motion.div
                        variants={heroItem}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border"
                        style={{ backgroundColor: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.2)' }}
                    >
                        <div className="pulsing-dot"></div>
                        <span className="text-xs md:text-sm font-bold tracking-widest text-[#7C3AED]">ADMISSIONS OPEN 2024–25</span>
                    </motion.div>

                    {/* H1: Institute name + shimmer tagline */}
                    <motion.h1
                        variants={heroItem}
                        className="text-4xl md:text-[68px] font-black leading-[1.1] mb-6 drop-shadow-2xl"
                        style={{ letterSpacing: '-3px' }}
                    >
                        <span className="block text-white">{data.institute_name}</span>
                        <span className="block text-gradient-shimmer">{data.tagline || 'Excellence in Education'}</span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        variants={heroItem}
                        className="text-[17px] text-[#6B7280] mb-10 max-w-[500px] mx-auto leading-relaxed"
                    >
                        {data.about_text || 'Join thousands of successful students and accelerate your learning journey with expert educators.'}
                    </motion.p>

                    {/* Two buttons — 5. Button hover effects */}
                    <motion.div variants={heroItem} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full">
                        <motion.a
                            href="#contact"
                            className="px-8 py-4 rounded-xl font-bold text-lg text-white w-full sm:w-auto btn-purple whitespace-nowrap"
                            whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(124,58,237,0.45)' }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            Book Free Demo Class
                        </motion.a>
                        <motion.a
                            href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-whatsapp px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 w-full sm:w-auto whitespace-nowrap"
                            whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(34,197,94,0.35)' }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                            </svg>
                            WhatsApp Us
                        </motion.a>
                    </motion.div>

                    {/* Stats Bar — 6. Counter animation */}
                    <motion.div variants={heroItem} className="w-full max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                className="stat-card p-6 flex flex-col items-center justify-center"
                                whileHover={{ y: -4, borderColor: 'rgba(124,58,237,0.4)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                                <div className="text-4xl font-black mb-1 text-gradient-purple">
                                    <Counter target={500} suffix="+" />
                                </div>
                                <div className="text-[#6B7280] font-medium text-sm">Students Enrolled</div>
                            </motion.div>
                            <motion.div
                                className="stat-card p-6 flex flex-col items-center justify-center"
                                whileHover={{ y: -4, borderColor: 'rgba(124,58,237,0.4)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                                <div className="text-4xl font-black mb-1 text-gradient-purple">
                                    <Counter target={95} suffix="%" />
                                </div>
                                <div className="text-[#6B7280] font-medium text-sm">Success Rate</div>
                            </motion.div>
                            <motion.div
                                className="stat-card p-6 flex flex-col items-center justify-center"
                                whileHover={{ y: -4, borderColor: 'rgba(124,58,237,0.4)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                                <div className="text-4xl font-black mb-1 text-gradient-purple">
                                    <Counter target={10} suffix="+" />
                                </div>
                                <div className="text-[#6B7280] font-medium text-sm">Years Experience</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 3. COURSES SECTION — staggered grid cards   */}
            {/* ═══════════════════════════════════════════ */}
            <section id="courses" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full" style={{ backgroundColor: '#06060A' }}>
                {/* 2. Scroll reveal + 10. Section title reveal with line */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                >
                    <div className="text-[10px] font-bold uppercase tracking-[3px] text-[#7C3AED] mb-3">Our Courses</div>
                    <h2 className="text-[38px] font-black text-white" style={{ letterSpacing: '-1.5px' }}>Master Your Future</h2>
                    {/* 10. Title reveal line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{ height: 2, background: '#7C3AED', transformOrigin: 'left', marginTop: 16, maxWidth: 80, marginLeft: 'auto', marginRight: 'auto' }}
                    />
                </motion.div>

                {/* 3. Staggered grid cards + 4. Card hover */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={cardContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {data.courses && data.courses.map((course: any, idx: number) => {
                        const isMiddle = idx === 1;
                        return (
                            <motion.div
                                key={idx}
                                variants={cardItem}
                                whileHover={{ y: -8, scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="card-dark flex flex-col overflow-hidden relative"
                            >
                                {isMiddle && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg z-20 shadow-md">
                                        POPULAR
                                    </div>
                                )}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div
                                        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 self-start"
                                        style={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}
                                    >
                                        {course.fee}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{course.name}</h3>
                                    <p className="text-[#6B7280] flex-grow text-sm mb-8 leading-relaxed">{course.description}</p>
                                    <motion.a
                                        href="#contact"
                                        className="enquire-btn w-full py-3 rounded-lg font-bold text-sm text-center text-white block"
                                        whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    >
                                        Enquire Now
                                    </motion.a>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 4. RESULTS SECTION                          */}
            {/* ═══════════════════════════════════════════ */}
            <section id="results" className="py-24 relative overflow-hidden w-full" style={{ backgroundColor: '#06060A' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    {/* 2. Scroll reveal + 10. Line */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                    >
                        <div className="text-[10px] font-bold uppercase tracking-[3px] text-[#7C3AED] mb-3">Proven Track Record</div>
                        <h2 className="text-[38px] font-black text-white" style={{ letterSpacing: '-1.5px' }}>Our Achievers</h2>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ height: 2, background: '#7C3AED', transformOrigin: 'left', marginTop: 16, maxWidth: 80, marginLeft: 'auto', marginRight: 'auto' }}
                        />
                    </motion.div>

                    {/* Staggered result cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={cardContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {data.results && data.results.map((result: any, idx: number) => (
                            <motion.div
                                key={idx}
                                variants={cardItem}
                                whileHover={{ y: -8, scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="card-dark p-8 relative overflow-hidden group"
                            >
                                {/* Purple radial glow top-right */}
                                <div className="glow-pulse absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(124,58,237,0.2)' }}></div>

                                {/* Exam tag */}
                                <div className="text-[#6B7280] text-[10px] font-bold tracking-widest uppercase mb-4">
                                    {result.year} • {result.exam}
                                </div>
                                {/* Giant score */}
                                <div className="text-[44px] font-black mb-6 text-gradient-purple leading-none">{result.score}</div>

                                <hr className="border-t border-white/10 mb-6" />

                                <div className="flex justify-between items-end">
                                    <div className="text-lg font-bold text-white">{result.student_name}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                                        Top Performer
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 5. TESTIMONIALS                             */}
            {/* ═══════════════════════════════════════════ */}
            <section className="py-24 relative w-full border-t border-white/5" style={{ backgroundColor: '#06060A' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                    >
                        <div className="text-[10px] font-bold uppercase tracking-[3px] text-[#7C3AED] mb-3">Testimonials</div>
                        <h2 className="text-[38px] font-black text-white" style={{ letterSpacing: '-1.5px' }}>What Parents Say</h2>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ height: 2, background: '#7C3AED', transformOrigin: 'left', marginTop: 16, maxWidth: 80, marginLeft: 'auto', marginRight: 'auto' }}
                        />
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={cardContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {data.testimonials && data.testimonials.map((test: any, idx: number) => (
                            <motion.div
                                key={idx}
                                variants={cardItem}
                                whileHover={{ y: -8, scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="card-dark testimonial-card p-8 flex flex-col h-full"
                            >
                                {/* Amber star ratings */}
                                <div className="flex gap-1 mb-6 text-[#F59E0B] text-sm">★★★★★</div>
                                {/* Quote text */}
                                <p className="text-[#6B7280] mb-8 text-sm leading-relaxed flex-grow">&ldquo;{test.text}&rdquo;</p>
                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                        style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)' }}
                                    >
                                        {test.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{test.name}</div>
                                        <div className="text-[10px] text-[#4B5563] uppercase tracking-wider mt-1">{test.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 6. FACULTY                                  */}
            {/* ═══════════════════════════════════════════ */}
            <section id="faculty" className="py-24 relative w-full border-t border-white/5" style={{ backgroundColor: '#06060A' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                    >
                        <div className="text-[10px] font-bold uppercase tracking-[3px] text-[#7C3AED] mb-3">Expert Faculty</div>
                        <h2 className="text-[38px] font-black text-white" style={{ letterSpacing: '-1.5px' }}>Learn From The Best</h2>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ height: 2, background: '#7C3AED', transformOrigin: 'left', marginTop: 16, maxWidth: 80, marginLeft: 'auto', marginRight: 'auto' }}
                        />
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        variants={cardContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {data.faculty && data.faculty.map((member: any, idx: number) => (
                            <motion.div
                                key={idx}
                                variants={cardItem}
                                whileHover={{ y: -8, scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="card-dark p-6 flex items-center gap-6"
                            >
                                {/* Avatar: square, border-radius 12px, purple gradient */}
                                <motion.div
                                    className="w-20 h-20 shrink-0 flex items-center justify-center text-white text-2xl font-black shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', borderRadius: '12px' }}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    {member.initials}
                                </motion.div>
                                <div className="flex flex-col items-start">
                                    <h4 className="text-xl font-bold mb-2 text-white">{member.name}</h4>
                                    <div
                                        className="inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-2 uppercase tracking-wide"
                                        style={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}
                                    >
                                        {member.subject}
                                    </div>
                                    <div className="text-[#6B7280] text-xs font-medium">{member.experience}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 7. CONTACT FORM                             */}
            {/* ═══════════════════════════════════════════ */}
            <section id="contact" className="py-24 w-full" style={{ backgroundColor: '#06060A' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                        className="card-dark"
                        style={{ borderRadius: '20px', padding: '48px' }}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                    >
                        {/* Eyebrow + title + subtitle */}
                        <div className="text-center mb-10">
                            <div className="text-[10px] font-bold uppercase tracking-[3px] text-[#7C3AED] mb-3">Get in Touch</div>
                            <h3 className="text-3xl font-black mb-4 text-white">Request a Callback</h3>
                            <p className="text-[#6B7280] text-sm">Leave your details and our counselor will reach out to you.</p>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                style={{ height: 2, background: '#7C3AED', transformOrigin: 'left', marginTop: 16, maxWidth: 80, marginLeft: 'auto', marginRight: 'auto' }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {formStatus === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                                    className="flex flex-col items-center justify-center text-center space-y-4 py-10"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                                        className="w-16 h-16 rounded-full flex items-center justify-center text-[#22C55E] text-3xl mb-4"
                                        style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
                                    >
                                        ✓
                                    </motion.div>
                                    <h4 className="text-2xl font-bold text-white">Request Sent!</h4>
                                    <p className="text-[#6B7280] max-w-sm text-sm">Our expert counselor will contact you shortly.</p>
                                    <motion.button
                                        onClick={() => setFormStatus('idle')}
                                        className="mt-6 px-6 py-2 rounded-lg transition font-semibold text-white text-sm"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Send another
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleFormSubmit}
                                    className="space-y-6"
                                >
                                    {/* 2x2 grid of inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Student Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                                                value={formState.student_name}
                                                onChange={e => setFormState({ ...formState, student_name: e.target.value })}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Parent Phone</label>
                                            <input
                                                required
                                                type="tel"
                                                className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                                                value={formState.parent_phone}
                                                onChange={e => setFormState({ ...formState, parent_phone: e.target.value })}
                                                placeholder="+91 9999999999"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Class Level</label>
                                            <select
                                                required
                                                className="input-dark w-full px-4 py-3 rounded-lg text-sm appearance-none"
                                                value={formState.class_level}
                                                onChange={e => setFormState({ ...formState, class_level: e.target.value })}
                                            >
                                                <option value="" disabled className="text-gray-500">Select Class</option>
                                                <option value="Class 8" className="bg-[#0D0D14]">Class 8</option>
                                                <option value="Class 9" className="bg-[#0D0D14]">Class 9</option>
                                                <option value="Class 10" className="bg-[#0D0D14]">Class 10</option>
                                                <option value="Class 11" className="bg-[#0D0D14]">Class 11</option>
                                                <option value="Class 12" className="bg-[#0D0D14]">Class 12</option>
                                                <option value="Dropper" className="bg-[#0D0D14]">Dropper</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Course Interest</label>
                                            <select
                                                required
                                                className="input-dark w-full px-4 py-3 rounded-lg text-sm appearance-none"
                                                value={formState.course_interest}
                                                onChange={e => setFormState({ ...formState, course_interest: e.target.value })}
                                            >
                                                <option value="" disabled>Select Course</option>
                                                {data.courses && data.courses.map((c: any, i: number) => (
                                                    <option key={i} value={c.name} className="bg-[#0D0D14]">{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* 5. Submit button hover */}
                                    <motion.button
                                        disabled={formStatus === 'loading'}
                                        type="submit"
                                        className="w-full py-4 rounded-xl text-white font-bold text-sm btn-purple disabled:opacity-50 mt-4"
                                        whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(124,58,237,0.45)' }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    >
                                        {formStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry Request'}
                                    </motion.button>
                                    {formStatus === 'error' && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 font-medium text-center text-xs mt-2"
                                        >
                                            Connection error. Please try again or WhatsApp us.
                                        </motion.p>
                                    )}
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 8. FOOTER                                   */}
            {/* ═══════════════════════════════════════════ */}
            <motion.footer
                className="py-12 w-full"
                style={{ backgroundColor: '#06060A', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE_PREMIUM }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Left: name + address/phone */}
                    <div className="text-center md:text-left">
                        <div className="text-white font-bold text-xl mb-2">{data.institute_name}</div>
                        <p className="text-sm text-[#4B5563] space-x-4">
                            <span>{data.address}</span>
                            <span>•</span>
                            <span>+91 {data.phone}</span>
                        </p>
                    </div>
                    {/* Right: Powered by + Privacy/Terms */}
                    <div className="text-sm space-y-2 text-center md:text-right flex flex-col md:items-end">
                        <div className="text-[#6B7280] mb-2 flex items-center gap-4">
                            <a href="#" className="hover:text-white transition">Privacy</a>
                            <a href="#" className="hover:text-white transition">Terms</a>
                        </div>
                        <div className="text-[#4B5563] text-xs">
                            Powered by <span className="font-bold text-[#7C3AED]">CoachFlow AI</span>
                        </div>
                    </div>
                </div>
            </motion.footer>

            {/* ═══════════════════════════════════════════ */}
            {/* WhatsApp Floating Button — bottom-right      */}
            {/* ═══════════════════════════════════════════ */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
                <AnimatePresence>
                    {isWhatsAppOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="card-dark p-5 w-72 flex flex-col mb-2"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-bold text-white text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>💬</span>
                                    Support
                                </div>
                                <button onClick={() => setIsWhatsAppOpen(false)} className="text-[#6B7280] hover:text-white">✕</button>
                            </div>
                            <p className="text-[#6B7280] mb-4 text-xs">Looking for admission details?</p>
                            <a
                                href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2.5 rounded-lg text-white font-bold text-center text-xs btn-whatsapp"
                            >
                                Start Chat
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative flex items-center justify-center w-14 h-14 cursor-pointer group" onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}>
                    <div className="absolute inset-0 rounded-full whatsapp-float" style={{ backgroundColor: '#22C55E', zIndex: -1 }}></div>
                    <motion.button
                        className="w-14 h-14 bg-[#22C55E] rounded-full flex items-center justify-center text-white text-2xl shadow-lg relative z-10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                        </svg>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
