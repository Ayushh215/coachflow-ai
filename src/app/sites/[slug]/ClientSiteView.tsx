'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const poppins = Poppins({ weight: ['400', '600', '700', '800'], subsets: ['latin'], display: 'swap' });

export default function ClientSiteView({ data }: { data: any }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

    // Form state
    const [formState, setFormState] = useState({
        student_name: '',
        parent_phone: '',
        class_level: '',
        course_interest: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Stats
    const [stats, setStats] = useState({ students: 0, success: 0, years: 0 });
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Stats counter animation
        const ob = new IntersectionObserver((entries) => {
            if (entries[0] && entries[0].isIntersecting) {
                ob.disconnect();
                let start = 0;
                const steps = 60;
                const t = setInterval(() => {
                    start++;
                    setStats({
                        students: Math.min(Math.round(500 * (start / steps)), 500),
                        success: Math.min(Math.round(95 * (start / steps)), 95),
                        years: Math.min(Math.round(10 * (start / steps)), 10)
                    });
                    if (start >= steps) clearInterval(t);
                }, 30);
            }
        }, { threshold: 0.5 });
        if (statsRef.current) ob.observe(statsRef.current);
        return () => ob.disconnect();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('loading');
        try {
            const res = await fetch('/api/sites/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: data.slug, ...formState })
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
        <div className={`min-h-screen bg-white ${inter.className} text-[#374151] overflow-x-hidden`} style={{ '--p-color': data.primary_color } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{__html: `
                .hover-scale { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease; }
                .hover-scale:hover { transform: scale(1.02); box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
                .btn-primary { transition: all 0.3s; background-color: var(--p-color); }
                .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); }
                .bg-animated-gradient {
                    background: linear-gradient(-45deg, var(--p-color), #281142, #111827, #0a0f1a);
                    background-size: 400% 400%;
                    animation: gradientBG 15s ease infinite;
                }
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .pulse-container { position: relative; display: flex; align-items: center; justify-content: center; }
                .pulse-ring { 
                    position: absolute; width: 100%; height: 100%; 
                    background-color: #22c55e; border-radius: 50%; 
                    animation: pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; 
                    z-index: -1;
                }
                @keyframes pulseRing {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
                .text-gradient {
                    background: linear-gradient(135deg, var(--p-color), #4F46E5);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-top: 4px solid var(--p-color);
                }
                .focus-ring:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
                    border-color: var(--p-color);
                }
            `}} />

            {/* Navbar (Fixed: White bg, justified contents, constrained button) */}
            <nav className="fixed w-full z-50 bg-white shadow-sm border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* Logo - Left */}
                    <div className="flex items-center gap-3 w-1/4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-md" style={{ background: `var(--p-color)` }}>
                            {data.logo_text}
                        </div>
                        <span className={`font-extrabold text-xl tracking-tight text-black ${poppins.className}`}>
                            {data.institute_name}
                        </span>
                    </div>

                    {/* Nav Links - Center */}
                    <div className={`hidden md:flex flex-1 justify-center gap-8 items-center text-[#374151] font-semibold text-sm`}>
                        <a href="#home" className="hover:text-[var(--p-color)] transition">Home</a>
                        <a href="#courses" className="hover:text-[var(--p-color)] transition">Courses</a>
                        <a href="#results" className="hover:text-[var(--p-color)] transition">Results</a>
                        <a href="#faculty" className="hover:text-[var(--p-color)] transition">Faculty</a>
                        <a href="#contact" className="hover:text-[var(--p-color)] transition">Contact</a>
                    </div>
                    
                    {/* CTA - Right (Constrained) */}
                    <div className="hidden md:flex w-1/4 justify-end">
                        <a href="#contact" className="inline-flex px-6 py-2.5 rounded-full text-white font-bold text-sm shadow-md btn-primary whitespace-nowrap">
                            Enquire Now
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <div className={`space-y-1.5 p-2 text-black`}>
                            <div className="w-6 h-0.5 bg-current text-black"></div>
                            <div className="w-6 h-0.5 bg-current text-black"></div>
                            <div className="w-6 h-0.5 bg-current text-black"></div>
                        </div>
                    </button>
                </div>
                
                {/* Mobile Menu Panel */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-6 flex flex-col px-6 gap-6 font-semibold border-t border-gray-100">
                        <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 text-lg">Home</a>
                        <a href="#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 text-lg">Courses</a>
                        <a href="#results" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 text-lg">Results</a>
                        <a href="#faculty" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 text-lg">Faculty</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 text-lg">Contact</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl text-white font-bold text-center mt-2 text-lg whitespace-nowrap btn-primary">
                            Enquire Now
                        </a>
                    </div>
                )}
            </nav>

            {/* Hero Section (Dark Gradient) */}
            <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-32 overflow-hidden bg-animated-gradient">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
                    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[var(--p-color)]/20 rounded-full blur-3xl mix-blend-overlay"></div>
                </div>
                
                {/* Floating Badges */}
                <div className="hidden lg:flex absolute top-40 left-24 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold shadow-xl items-center gap-2">
                    <span className="text-xl">🏆</span> #1 Rated Institute
                </div>
                <div className="hidden lg:flex absolute bottom-64 left-32 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold shadow-xl items-center gap-2">
                    <span className="text-xl">⭐</span> 4.9/5 Rating
                </div>
                <div className="hidden lg:flex absolute top-56 right-24 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold shadow-xl items-center gap-2">
                    <span className="text-xl">👨‍🎓</span> 500+ Alumni
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white backdrop-blur-md mb-8 border border-white/20 text-xs md:text-sm font-semibold uppercase tracking-widest">
                        Admissions Open 2024-25
                    </div>
                    <h1 className={`text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold text-white mb-8 leading-[1.1] tracking-tight ${poppins.className} drop-shadow-lg`}>
                        {data.institute_name}
                    </h1>
                    <p className={`text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto ${inter.className} leading-relaxed`}>
                        {data.tagline || data.about_text}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="#contact" className="px-8 py-4 rounded-xl font-bold text-lg transition text-white w-full sm:w-auto btn-primary whitespace-nowrap">
                            Book Free Demo Class
                        </a>
                        <a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online and want to know more`} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-xl bg-white text-[#25D366] font-bold text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-50 transition whitespace-nowrap">
                           <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
                           WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Bar (White, Strong Shadow) */}
            <div className="relative max-w-5xl mx-auto px-4 -mt-12 z-20" ref={statsRef}>
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row justify-around items-center gap-8 border border-gray-100">
                    <div className="text-center w-full">
                        <div className="text-3xl mb-2">👨‍🎓</div>
                        <div className={`text-4xl font-extrabold mb-1 text-gradient ${poppins.className}`}>{stats.students}+</div>
                        <div className="text-[#374151] font-bold text-sm tracking-wide">Students Enrolled</div>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-gray-200"></div>
                    <div className="text-center w-full">
                        <div className="text-3xl mb-2">📈</div>
                        <div className={`text-4xl font-extrabold mb-1 text-gradient ${poppins.className}`}>{stats.success}%</div>
                        <div className="text-[#374151] font-bold text-sm tracking-wide">Success Rate</div>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-gray-200"></div>
                    <div className="text-center w-full">
                        <div className="text-3xl mb-2">🏛️</div>
                        <div className={`text-4xl font-extrabold mb-1 text-gradient ${poppins.className}`}>{stats.years}+</div>
                        <div className="text-[#374151] font-bold text-sm tracking-wide">Years Experience</div>
                    </div>
                </div>
            </div>

            {/* Courses Section (White section, white cards with left accent border) */}
            <section id="courses" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-white mt-10 relative">
                <div className="text-center mb-16">
                    <div className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3">Our Courses</div>
                    <h2 className={`text-4xl font-extrabold text-[#111827] ${poppins.className}`}>Master Your Future</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.courses && data.courses.map((course: any, idx: number) => {
                        const isMiddle = idx === 1; // Middle one pops
                        return (
                            <div key={idx} className={`relative rounded-xl shadow-sm hover-scale bg-white border border-gray-200 flex flex-col h-full overflow-hidden ${isMiddle ? 'md:-translate-y-2' : ''}`} style={{ borderLeftWidth: '5px', borderLeftColor: 'var(--p-color)' }}>
                                {isMiddle && (
                                    <div className="absolute top-0 right-0 bg-[#F59E0B] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg z-20 shadow-sm">
                                        Most Popular
                                    </div>
                                )}
                                <div className="p-8 flex flex-col flex-grow bg-[#F8FAFC]/50">
                                    <h3 className={`text-2xl font-bold bg-white text-[#111827] mb-3 ${poppins.className} bg-transparent`}>{course.name}</h3>
                                    <p className="text-[#4B5563] flex-grow text-base mb-8 leading-relaxed">{course.description}</p>
                                    <div className="flex flex-col gap-4">
                                        <div className="inline-block px-4 py-1.5 rounded-full text-white font-bold self-start shadow-sm text-sm" style={{ background: 'var(--p-color)' }}>
                                            {course.fee}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Results Section (Dark Navy #0F172A) */}
            <section id="results" className="py-24 bg-[#0F172A] relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Proven Track Record</div>
                        <h2 className={`text-4xl font-extrabold text-white ${poppins.className}`}>Our Achievers</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.results && data.results.map((result: any, idx: number) => (
                            <div key={idx} className="glass-card hover-scale p-8 rounded-2xl relative overflow-visible group">
                                <div className="inline-block px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/90 text-xs font-bold mb-4 tracking-wider uppercase">
                                    {result.year} • {result.exam}
                                </div>
                                <div className={`text-5xl font-black mb-4 text-gradient ${poppins.className}`}>{result.score}</div>
                                <div className="text-xl font-bold text-white">{result.student_name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials (Light Gray #F8FAFC) */}
            <section className="py-24 bg-[#F8FAFC] relative border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden relative z-10">
                    <div className="text-center mb-16">
                        <div className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3">Testimonials</div>
                        <h2 className={`text-4xl font-extrabold text-[#111827] ${poppins.className}`}>What Parents Say</h2>
                    </div>
                    
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-6 snap-x">
                        {data.testimonials && data.testimonials.map((test: any, idx: number) => (
                            <div key={idx} className="min-w-[80vw] md:min-w-0 snap-center bg-white p-8 rounded-2xl shadow-md hover-scale border border-gray-100 flex flex-col h-full">
                                <div className="flex gap-1 mb-4 text-[#F59E0B] text-lg">
                                    ★★★★★
                                </div>
                                <p className="text-[#374151] mb-6 text-base leading-relaxed flex-grow">"{test.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="font-bold text-[#111827] text-sm">{test.name}</div>
                                        <div className="text-xs text-[#6B7280] uppercase tracking-wide mt-0.5">{test.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Faculty (Pure White #FFFFFF) */}
            <section id="faculty" className="py-24 bg-white relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3">Expert Faculty</div>
                        <h2 className={`text-4xl font-extrabold text-[#111827] ${poppins.className}`}>Learn From The Best</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.faculty && data.faculty.map((member: any, idx: number) => (
                            <div key={idx} className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover-scale">
                                <div className="w-20 h-20 mb-5 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-md" style={{ background: `var(--p-color)` }}>
                                    {member.initials}
                                </div>
                                <h4 className={`text-xl font-bold mb-2 text-[#111827] ${poppins.className}`}>{member.name}</h4>
                                <div className="inline-block px-3 py-1 rounded bg-[#F3F4F6] text-xs font-bold text-[#374151] mb-2 uppercase tracking-wide">
                                    {member.subject}
                                </div>
                                <div className="text-[#6B7280] text-sm">{member.experience}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section (Split background form) */}
            <section id="contact" className="py-24 bg-[#F8FAFC]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
                        
                        {/* Left Info (Gradient) */}
                        <div className="lg:w-5/12 p-12 text-white flex flex-col justify-center relative bg-[var(--p-color)]">
                            <h3 className={`text-3xl font-extrabold mb-6 ${poppins.className}`}>Ready to Crack Your Exam?</h3>
                            <p className="text-white/90 mb-8 text-base leading-relaxed">Join thousands of successful students and start your journey with top mentors.</p>
                            
                            <ul className="space-y-4 mb-10 text-base font-semibold text-white">
                                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span> Free Demo Class</li>
                                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span> Expert Faculty</li>
                                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span> Proven Results</li>
                            </ul>

                            <div className="space-y-4 pt-8 border-t border-white/20 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 p-2.5 rounded-lg">📍</div>
                                    <div className="font-medium text-white/90">{data.address}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 p-2.5 rounded-lg">📞</div>
                                    <div className="font-medium text-white/90">+91 {data.phone}</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Form (White Area) */}
                        <div className="lg:w-7/12 p-12 bg-white">
                            <h3 className={`text-2xl font-extrabold mb-8 text-[#111827] ${poppins.className}`}>Request a Callback</h3>
                            {formStatus === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
                                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-4xl mb-4 shadow-sm">
                                        ✓
                                    </div>
                                    <h4 className={`text-2xl font-bold text-[#111827] ${poppins.className}`}>Request Sent!</h4>
                                    <p className="text-[#6B7280] max-w-sm text-sm">Our expert counselor will contact you shortly.</p>
                                    <button onClick={() => setFormStatus('idle')} className="mt-6 px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-semibold text-gray-800 text-sm">Send another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Student Name</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus-ring text-sm" value={formState.student_name} onChange={e => setFormState({...formState, student_name: e.target.value})} placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Parent Phone</label>
                                            <input required type="tel" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus-ring text-sm" value={formState.parent_phone} onChange={e => setFormState({...formState, parent_phone: e.target.value})} placeholder="+91 9999999999" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Class Level</label>
                                            <select required className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus-ring text-sm text-[#374151]" value={formState.class_level} onChange={e => setFormState({...formState, class_level: e.target.value})}>
                                                <option value="" disabled>Select Class</option>
                                                <option value="Class 8">Class 8</option>
                                                <option value="Class 9">Class 9</option>
                                                <option value="Class 10">Class 10</option>
                                                <option value="Class 11">Class 11</option>
                                                <option value="Class 12">Class 12</option>
                                                <option value="Dropper">Dropper</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Course Interest</label>
                                            <select required className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus-ring text-sm text-[#374151]" value={formState.course_interest} onChange={e => setFormState({...formState, course_interest: e.target.value})}>
                                                <option value="" disabled>Select Course</option>
                                                {data.courses && data.courses.map((c: any, i: number) => (
                                                    <option key={i} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Message (Optional)</label>
                                        <textarea rows={2} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus-ring resize-none text-sm" value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} placeholder="Any specific requirements..."></textarea>
                                    </div>
                                    
                                    <button disabled={formStatus === 'loading'} type="submit" className="w-full py-4 rounded-xl text-white font-bold text-base btn-primary disabled:opacity-50 mt-2 shadow-md">
                                        {formStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry Request'}
                                    </button>
                                    {formStatus === 'error' && <p className="text-red-500 font-medium text-center text-sm mt-2">Connection error. Please try again or WhatsApp us.</p>}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer (Dark) */}
            <footer className="bg-[#050A15] text-gray-400 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className={`text-white font-extrabold text-2xl mb-2 tracking-tight ${poppins.className}`}>{data.institute_name}</div>
                        <p className="text-sm font-medium text-gray-500">{data.tagline}</p>
                    </div>
                    <div className="text-sm space-y-2 text-center md:text-right">
                        <div className="text-white font-medium">📞 +91 {data.phone}</div>
                        <div className="text-gray-500">{data.address}</div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <div>&copy; {new Date().getFullYear()} {data.institute_name}. All rights reserved.</div>
                    <div className="text-white font-bold px-3 py-1.5 rounded-md bg-white/5 border border-white/10">Powered by CoachFlow AI</div>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
                {isWhatsAppOpen && (
                    <div className="bg-white rounded-2xl shadow-xl p-5 w-72 flex flex-col border border-gray-200 mb-2 origin-bottom-right transition-transform">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-bold text-black text-sm flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">💬</span> Support
                            </div>
                            <button onClick={() => setIsWhatsAppOpen(false)} className="text-gray-400 hover:text-black">✕</button>
                        </div>
                        <p className="text-gray-600 font-medium mb-4 text-sm">Looking for admission details?</p>
                        <a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online and want to know more`} target="_blank" rel="noreferrer" className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-center text-sm rounded-lg transition">
                            Start Chat
                        </a>
                    </div>
                )}
                
                <div className="pulse-container w-14 h-14 cursor-pointer group" onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}>
                    <div className="pulse-ring"></div>
                    <button className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 relative z-10">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
