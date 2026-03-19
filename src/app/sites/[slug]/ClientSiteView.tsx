'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const poppins = Poppins({ weight: ['400', '600', '700', '800'], subsets: ['latin'], display: 'swap' });

export default function ClientSiteView({ data }: { data: any }) {
    const [isScrolled, setIsScrolled] = useState(false);
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
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Stats counter animation
        const ob = new IntersectionObserver((entries) => {
            if (entries[0] && entries[0].isIntersecting) {
                ob.disconnect();
                let start = 0;
                const steps = 100;
                const t = setInterval(() => {
                    start++;
                    setStats({
                        students: Math.min(Math.round(500 * (start / steps)), 500),
                        success: Math.min(Math.round(95 * (start / steps)), 95),
                        years: Math.min(Math.round(10 * (start / steps)), 10)
                    });
                    if (start >= steps) clearInterval(t);
                }, 20);
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
        <div className={`min-h-screen bg-neutral-50 ${inter.className} text-neutral-900 overflow-x-hidden`} style={{ '--p-color': data.primary_color } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{__html: `
                .hover-scale { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease; }
                .hover-scale:hover { transform: scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                .btn-glow { box-shadow: 0 0 25px rgba(255,255,255,0.3); transition: all 0.3s; }
                .btn-glow:hover { filter: brightness(1.1); box-shadow: 0 0 35px rgba(255,255,255,0.6); transform: translateY(-2px); }
                .btn-primary { transition: all 0.3s; }
                .btn-primary:hover { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
                .bg-animated-gradient {
                    background: linear-gradient(-45deg, var(--p-color), #281142, #111827, #0a0f1a);
                    background-size: 400% 400%;
                    animation: gradientBG 18s ease infinite;
                }
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .float-anim { animation: float 6s ease-in-out infinite; }
                .float-anim-alt { animation: float-alt 7s ease-in-out infinite; }
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(3deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes float-alt {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-3deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
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
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .section-title { position: relative; display: inline-block; }
                .section-title::after {
                    content: ''; position: absolute; left: 50%; bottom: -12px;
                    transform: translateX(-50%); width: 60px; height: 4px;
                    background: var(--p-color); border-radius: 2px;
                }
            `}} />

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg transition-transform group-hover:scale-110" style={{ background: `linear-gradient(135deg, var(--p-color), #4F46E5)` }}>
                            {data.logo_text}
                        </div>
                        <span className={`font-extrabold text-2xl tracking-tight ${poppins.className} ${isScrolled ? 'text-neutral-900' : 'text-white drop-shadow-lg'}`}>
                            {data.institute_name}
                        </span>
                    </div>

                    <div className={`hidden md:flex gap-8 items-center ${inter.className} ${isScrolled ? 'text-neutral-700 font-semibold' : 'text-white font-semibold drop-shadow-md'}`}>
                        <a href="#home" className="hover:text-[var(--p-color)] transition relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--p-color)] hover:after:w-full after:transition-all">Home</a>
                        <a href="#courses" className="hover:text-[var(--p-color)] transition relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--p-color)] hover:after:w-full after:transition-all">Courses</a>
                        <a href="#results" className="hover:text-[var(--p-color)] transition relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--p-color)] hover:after:w-full after:transition-all">Results</a>
                        <a href="#faculty" className="hover:text-[var(--p-color)] transition relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--p-color)] hover:after:w-full after:transition-all">Faculty</a>
                        <a href="#contact" className="hover:text-[var(--p-color)] transition relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--p-color)] hover:after:w-full after:transition-all">Contact</a>
                    </div>
                    
                    <a href="#contact" className="hidden md:block px-7 py-3 rounded-full text-white font-bold transition shadow-xl btn-primary" style={{ background: `linear-gradient(135deg, var(--p-color), #4F46E5)` }}>
                        Enquire Now
                    </a>

                    {/* Mobile menu button */}
                    <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <div className={`space-y-1.5 p-2 ${isScrolled ? 'text-black' : 'text-white drop-shadow-lg'}`}>
                            <div className="w-7 h-1 bg-current rounded-full"></div>
                            <div className="w-7 h-1 bg-current rounded-full"></div>
                            <div className="w-7 h-1 bg-current rounded-full"></div>
                        </div>
                    </button>
                </div>
                
                {/* Mobile Menu Panel */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl py-6 flex flex-col px-6 gap-6 font-semibold animate-in slide-in-from-top-4">
                        <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-800 text-lg">Home</a>
                        <a href="#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-800 text-lg">Courses</a>
                        <a href="#results" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-800 text-lg">Results</a>
                        <a href="#faculty" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-800 text-lg">Faculty</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-800 text-lg">Contact</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl text-white font-bold text-center mt-2 text-lg" style={{ background: `linear-gradient(135deg, var(--p-color), #4F46E5)` }}>
                            Enquire Now
                        </a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-32 overflow-hidden bg-animated-gradient">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
                    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[var(--p-color)]/20 rounded-full blur-3xl mix-blend-overlay"></div>
                </div>
                
                {/* Floating Badges */}
                <div className="hidden lg:flex absolute top-40 left-24 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-bold shadow-2xl float-anim items-center gap-3">
                    <span className="text-2xl">🏆</span> #1 Rated Institute
                </div>
                <div className="hidden lg:flex absolute bottom-64 left-32 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-bold shadow-2xl float-anim-alt items-center gap-3">
                    <span className="text-2xl">⭐</span> 4.9/5 Rating
                </div>
                <div className="hidden lg:flex absolute top-56 right-24 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-bold shadow-2xl float-anim items-center gap-3" style={{ animationDelay: '1s' }}>
                    <span className="text-2xl">👨‍🎓</span> 500+ Alumni
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-12">
                    <div className="inline-block px-5 py-2 rounded-full bg-white/10 text-white backdrop-blur-md mb-8 border border-white/20 text-sm md:text-base font-semibold shadow-lg uppercase tracking-wider">
                        ⚡ Admissions Open 2024-25
                    </div>
                    <h1 className={`text-6xl md:text-[5.5rem] font-extrabold text-white mb-8 leading-[1.1] tracking-tight ${poppins.className} drop-shadow-2xl`}>
                        {data.institute_name}
                    </h1>
                    <p className={`text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-medium ${inter.className} leading-relaxed drop-shadow-md`}>
                        {data.tagline || data.about_text}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <a href="#contact" className="px-10 py-5 rounded-2xl bg-white font-bold text-xl transition text-[var(--p-color)] text-center w-full sm:w-auto btn-glow">
                            Book Free Demo Class
                        </a>
                        <a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online and want to know more`} target="_blank" rel="noreferrer" className="px-10 py-5 rounded-2xl bg-[#25D366] text-white font-bold text-xl transition shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto hover:bg-[#20bd5a] hover:-translate-y-1">
                           <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
                           WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="relative max-w-5xl mx-auto px-4 -mt-16 z-20" ref={statsRef}>
                <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 flex flex-col md:flex-row justify-around items-center gap-10 border border-neutral-100">
                    <div className="text-center w-full">
                        <div className="text-5xl font-extrabold mb-3 text-gradient {poppins.className}">{stats.students}+</div>
                        <div className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Students Enrolled</div>
                    </div>
                    <div className="hidden md:block w-px h-24 bg-neutral-200"></div>
                    <div className="text-center w-full">
                        <div className="text-5xl font-extrabold mb-3 text-gradient {poppins.className}">{stats.success}%</div>
                        <div className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Success Rate</div>
                    </div>
                    <div className="hidden md:block w-px h-24 bg-neutral-200"></div>
                    <div className="text-center w-full">
                        <div className="text-5xl font-extrabold mb-3 text-gradient {poppins.className}">{stats.years}+</div>
                        <div className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Years Experience</div>
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <section id="courses" className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white relative">
                <div className="text-center mb-20">
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">Master Your Future</div>
                    <h2 className={`text-4xl md:text-5xl font-extrabold text-neutral-900 section-title ${poppins.className}`}>Our Premium Courses</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-10">
                    {data.courses && data.courses.map((course: any, idx: number) => {
                        const isMiddle = idx === 1; // Assuming 3 courses, middle one pops
                        return (
                            <div key={idx} className={`relative rounded-3xl overflow-hidden shadow-xl hover-scale bg-white border border-neutral-100 flex flex-col h-full ${isMiddle ? 'md:-translate-y-4 md:shadow-2xl' : ''}`}>
                                {isMiddle && (
                                    <div className="absolute top-0 right-0 bg-[#F59E0B] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-bl-xl z-20">
                                        Most Popular
                                    </div>
                                )}
                                <div className="p-10 relative" style={{ background: `linear-gradient(135deg, var(--p-color), #4F46E5)` }}>
                                    <h3 className={`text-3xl font-bold text-white mb-2 ${poppins.className}`}>{course.name}</h3>
                                    <div className="w-16 h-1 bg-white/30 rounded-full mb-4"></div>
                                </div>
                                <div className="p-10 flex flex-col flex-grow bg-white">
                                    <p className="text-neutral-600 mb-8 flex-grow text-lg leading-relaxed">{course.description}</p>
                                    <div className="flex flex-col gap-6">
                                        <div className="inline-block px-5 py-3 rounded-xl bg-neutral-50 font-bold self-start text-neutral-900 border border-neutral-200 text-lg shadow-inner">
                                            {course.fee}
                                        </div>
                                        <a href={`#contact`} onClick={() => setFormState(prev => ({...prev, course_interest: course.name}))} className="w-full py-4 rounded-xl font-bold text-center transition btn-primary text-white text-lg" style={{ background: `linear-gradient(135deg, var(--p-color), #4F46E5)` }}>
                                            Enquire Now &rarr;
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Results Section */}
            <section id="results" className="py-32 bg-[#0B1120] relative overflow-hidden">
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--p-color)]/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <div className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">Proven Track Record</div>
                        <h2 className={`text-4xl md:text-5xl font-extrabold text-white section-title ${poppins.className}`}>Our Students&apos; Success Stories</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {data.results && data.results.map((result: any, idx: number) => (
                            <div key={idx} className="glass-card hover-scale p-10 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">🏆</div>
                                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-bold mb-6 tracking-wider">
                                    {result.year} • {result.exam}
                                </div>
                                <div className={`text-6xl font-black mb-6 text-gradient ${poppins.className}`}>{result.score}</div>
                                <div className="text-2xl font-bold text-white">{result.student_name}</div>
                                <div className="text-[var(--p-color)] font-medium mt-2">Top Performer 🎉</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-28 bg-[#FFF8F0] border-y border-orange-100 relative">
                <div className="absolute top-10 left-10 text-[200px] opacity-5 text-orange-500 font-serif leading-none mix-blend-multiply pointer-events-none">"</div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden relative z-10">
                    <div className="text-center mb-20">
                        <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600 mb-4">Testimonials</div>
                        <h2 className={`text-4xl md:text-5xl font-extrabold text-neutral-900 section-title ${poppins.className}`}>What Parents Say</h2>
                    </div>
                    
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-8 pb-10 snap-x">
                        {data.testimonials && data.testimonials.map((test: any, idx: number) => (
                            <div key={idx} className="min-w-[85vw] md:min-w-0 snap-center bg-white p-10 rounded-[2rem] shadow-xl hover-scale border border-orange-50 flex flex-col h-full">
                                <div className="flex gap-1 mb-6 text-[#F59E0B] text-xl">
                                    ★★★★★
                                </div>
                                <p className="text-neutral-700 italic mb-8 text-lg leading-relaxed font-medium flex-grow">&quot;{test.text}&quot;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                                        {test.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-neutral-900 text-lg">{test.name}</div>
                                        <div className="text-sm text-neutral-500 font-medium">{test.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Faculty */}
            <section id="faculty" className="py-28 bg-gradient-to-b from-white to-neutral-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <div className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">Learn from the Best</div>
                        <h2 className={`text-4xl md:text-5xl font-extrabold text-neutral-900 section-title ${poppins.className}`}>Expert Faculty</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        {data.faculty && data.faculty.map((member: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-8 bg-white p-6 rounded-3xl shadow-md border border-neutral-100 hover-scale">
                                <div className="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center text-white text-3xl font-black shadow-xl" style={{ background: `linear-gradient(135deg, var(--p-color), #4F46E5)` }}>
                                    {member.initials}
                                </div>
                                <div>
                                    <h4 className={`text-2xl font-bold mb-2 text-neutral-900 ${poppins.className}`}>{member.name}</h4>
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-100 text-sm font-bold text-neutral-800 mb-2 border border-neutral-200 shadow-sm transition-colors hover:bg-neutral-200">
                                        {member.subject}
                                    </div>
                                    <div className="text-neutral-500 font-medium">{member.experience}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-28 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Decorative blobs */}
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-[var(--p-color)]/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10 border border-neutral-100">
                        {/* Left Info */}
                        <div className="lg:w-[45%] p-14 text-white flex flex-col justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, var(--p-color), #3730A3)` }}>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative z-10">
                                <h3 className={`text-4xl font-extrabold mb-8 leading-tight ${poppins.className}`}>Secure Your Child's Future Today</h3>
                                <p className="text-white/80 mb-10 text-xl font-medium">Join thousands of students who have cracked their dream exams with our expert guidance.</p>
                                
                                <ul className="space-y-5 mb-12 text-lg font-medium text-white/90">
                                    <li className="flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span> Free Demo Class</li>
                                    <li className="flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span> Regular Mock Tests</li>
                                    <li className="flex items-center gap-4"><span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span> Personalized Mentoring</li>
                                </ul>

                                <div className="space-y-6 pt-10 border-t border-white/20">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">📍</div>
                                        <div>
                                            <div className="font-bold text-white/60 mb-1 text-xs uppercase tracking-widest">Visit Us</div>
                                            <div className="font-semibold text-lg">{data.address}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">📞</div>
                                        <div>
                                            <div className="font-bold text-white/60 mb-1 text-xs uppercase tracking-widest">Call Us</div>
                                            <div className="font-semibold text-lg">+91 {data.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Form */}
                        <div className="lg:w-[55%] p-14 bg-white/50 backdrop-blur-md">
                            <h3 className={`text-3xl font-extrabold mb-8 text-neutral-900 ${poppins.className}`}>Request a Callback</h3>
                            {formStatus === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16 animate-in slide-in-from-bottom">
                                    <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-5xl mb-6 shadow-lg shadow-green-100/50">
                                        ✓
                                    </div>
                                    <h4 className={`text-3xl font-extrabold text-neutral-900 ${poppins.className}`}>Thank you!</h4>
                                    <p className="text-neutral-600 max-w-md text-lg font-medium">Your inquiry has been registered. An expert counselor will contact you shortly.</p>
                                    <button onClick={() => setFormStatus('idle')} className="mt-8 px-8 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition font-bold text-neutral-800">Send another request</button>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Student Name</label>
                                            <input required type="text" className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border border-neutral-200 focus:ring-4 focus:ring-opacity-20 focus:bg-white focus:outline-none transition-all font-medium text-lg" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.student_name} onChange={e => setFormState({...formState, student_name: e.target.value})} placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Parent Phone</label>
                                            <input required type="tel" className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border border-neutral-200 focus:ring-4 focus:ring-opacity-20 focus:bg-white focus:outline-none transition-all font-medium text-lg" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.parent_phone} onChange={e => setFormState({...formState, parent_phone: e.target.value})} placeholder="+91 9999999999" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Class Level</label>
                                            <select required className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border border-neutral-200 focus:ring-4 focus:ring-opacity-20 focus:bg-white focus:outline-none transition-all appearance-none font-medium text-lg" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.class_level} onChange={e => setFormState({...formState, class_level: e.target.value})}>
                                                <option value="" disabled>Select Class</option>
                                                <option value="Class 8">Class 8</option>
                                                <option value="Class 9">Class 9</option>
                                                <option value="Class 10">Class 10</option>
                                                <option value="Class 11">Class 11</option>
                                                <option value="Class 12">Class 12</option>
                                                <option value="Dropper">Dropper</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Course Interest</label>
                                            <select required className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border border-neutral-200 focus:ring-4 focus:ring-opacity-20 focus:bg-white focus:outline-none transition-all appearance-none font-medium text-lg" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.course_interest} onChange={e => setFormState({...formState, course_interest: e.target.value})}>
                                                <option value="" disabled>Select Course</option>
                                                {data.courses && data.courses.map((c: any, i: number) => (
                                                    <option key={i} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Additional Message</label>
                                        <textarea rows={3} className="w-full px-5 py-4 rounded-2xl bg-neutral-50 border border-neutral-200 focus:ring-4 focus:ring-opacity-20 focus:bg-white focus:outline-none transition-all resize-none font-medium text-lg" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} placeholder="Any specific requirements..."></textarea>
                                    </div>
                                    
                                    <button disabled={formStatus === 'loading'} type="submit" className="w-full py-5 rounded-2xl text-white font-extrabold text-xl transition btn-primary disabled:opacity-50 mt-4" style={{ background: `linear-gradient(135deg, var(--p-color), #4F46E5)` }}>
                                        {formStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry Request'}
                                    </button>
                                    {formStatus === 'error' && <p className="text-red-500 font-medium text-center bg-red-50 p-3 rounded-lg">Connection error. Please try again or WhatsApp us.</p>}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#050A15] text-neutral-400 py-16 border-t border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <div className={`text-white font-extrabold text-3xl mb-3 tracking-tight ${poppins.className}`}>{data.institute_name}</div>
                        <p className="text-base font-medium max-w-sm text-neutral-500">{data.tagline}</p>
                    </div>
                    <div className="text-base font-medium space-y-3 text-center md:text-right">
                        <div className="flex items-center justify-center md:justify-end gap-3 text-white">
                            <span className="p-2 bg-white/10 rounded-lg">📞</span> +91 {data.phone}
                        </div>
                        <div className="max-w-xs ml-auto text-neutral-500">{data.address}</div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium">
                    <div>&copy; {new Date().getFullYear()} {data.institute_name}. All rights reserved.</div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                    </div>
                    <div className="font-bold text-white bg-white/5 px-4 py-2 rounded-lg">Powered by CoachFlow AI</div>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
                {isWhatsAppOpen && (
                    <div className="bg-white rounded-3xl shadow-2xl p-7 w-80 animate-in slide-in-from-bottom flex flex-col border border-neutral-100 mb-2 transform origin-bottom-right">
                        <div className="flex justify-between items-center mb-5">
                            <div className="font-extrabold text-neutral-900 text-lg flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">👋</span> 
                                Support
                            </div>
                            <button onClick={() => setIsWhatsAppOpen(false)} className="text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full w-8 h-8 flex items-center justify-center transition">✕</button>
                        </div>
                        <p className="text-neutral-600 font-medium mb-6">Hi there! Looking for admission details or fee structure?</p>
                        <a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online and want to know more`} target="_blank" rel="noreferrer" className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-center rounded-xl transition shadow-lg shadow-green-200">
                            Start Chat
                        </a>
                    </div>
                )}
                
                <div className="pulse-container w-16 h-16 cursor-pointer group" onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}>
                    <div className="pulse-ring"></div>
                    <button className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white text-3xl shadow-xl transition-transform duration-300 group-hover:scale-110 relative z-10">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .animate-in { animation: entrance 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes entrance { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}} />
        </div>
    );
}
