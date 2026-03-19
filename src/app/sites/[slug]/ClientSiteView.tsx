'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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

    // Stats state
    const [stats, setStats] = useState({ students: 0, success: 0, years: 0 });
    const statsRef = useRef<HTMLDivElement>(null);
    const observerRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Intersection Observer for fade/slide
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        observerRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        // Stats counter animation
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                statsObserver.disconnect();
                // Animate counters
                let start = 0;
                const duration = 2000;
                const interval = 20;
                const steps = duration / interval;
                
                const timer = setInterval(() => {
                    start++;
                    setStats({
                        students: Math.min(Math.round(500 * (start / steps)), 500),
                        success: Math.min(Math.round(95 * (start / steps)), 95),
                        years: Math.min(Math.round(10 * (start / steps)), 10)
                    });
                    if (start >= steps) clearInterval(timer);
                }, interval);
            }
        }, { threshold: 0.5 });

        if (statsRef.current) statsObserver.observe(statsRef.current);

        return () => {
            observer.disconnect();
            statsObserver.disconnect();
        };
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

    const addRef = (el: HTMLElement | null) => {
        if (el && !observerRefs.current.includes(el)) {
            observerRefs.current.push(el);
        }
    };

    return (
        <div className={`min-h-screen bg-neutral-50 ${inter.className} text-neutral-900 overflow-x-hidden`}>
            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: data.primary_color }}>
                            {data.logo_text}
                        </div>
                        <span className={`font-bold text-xl ${isScrolled ? 'text-neutral-900' : 'text-white drop-shadow-md'}`}>
                            {data.institute_name}
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className={`hidden md:flex gap-8 items-center ${isScrolled ? 'text-neutral-600' : 'text-white/90 font-medium drop-shadow-sm'}`}>
                        <a href="#home" className="hover:text-black transition">Home</a>
                        <a href="#courses" className="hover:text-black transition">Courses</a>
                        <a href="#results" className="hover:text-black transition">Results</a>
                        <a href="#faculty" className="hover:text-black transition">Faculty</a>
                        <a href="#contact" className="hover:text-black transition">Contact</a>
                    </div>
                    
                    <a href="#contact" className="hidden md:block px-6 py-2.5 rounded-full text-white font-medium hover:opacity-90 transition shadow-lg" style={{ backgroundColor: data.primary_color }}>
                        Enquire Now
                    </a>

                    {/* Mobile menu button */}
                    <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <div className={`space-y-1.5 p-2 ${isScrolled ? 'text-black' : 'text-white'}`}>
                            <div className="w-6 h-0.5 bg-current"></div>
                            <div className="w-6 h-0.5 bg-current"></div>
                            <div className="w-6 h-0.5 bg-current"></div>
                        </div>
                    </button>
                </div>
                
                {/* Mobile Menu Panel */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 flex flex-col px-6 gap-4">
                        <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                        <a href="#courses" onClick={() => setIsMobileMenuOpen(false)}>Courses</a>
                        <a href="#results" onClick={() => setIsMobileMenuOpen(false)}>Results</a>
                        <a href="#faculty" onClick={() => setIsMobileMenuOpen(false)}>Faculty</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-2.5 rounded-md text-white font-medium text-center mt-2" style={{ backgroundColor: data.primary_color }}>
                            Enquire Now
                        </a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 opacity-90" style={{ background: `linear-gradient(135deg, ${data.primary_color} 0%, #000000 100%)` }}></div>
                </div>
                
                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white backdrop-blur-md mb-6 border border-white/20 text-sm md:text-base">
                        ⚡ Instant Response on WhatsApp
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        {data.institute_name}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light">
                        {data.tagline || data.about_text}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="#contact" className="px-8 py-4 rounded-full bg-white font-bold text-lg hover:bg-gray-100 transition shadow-xl" style={{ color: data.primary_color }}>
                            Book Free Demo Class
                        </a>
                        <a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online and want to know more`} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition shadow-xl flex items-center gap-2">
                           WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="relative max-w-5xl mx-auto px-4 -mt-16 z-20" ref={statsRef}>
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row justify-around items-center gap-8 border border-neutral-100">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: data.primary_color }}>{stats.students}+</div>
                        <div className="text-neutral-500 font-medium uppercase tracking-wider text-sm">Students Enrolled</div>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-neutral-200"></div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: data.primary_color }}>{stats.success}%</div>
                        <div className="text-neutral-500 font-medium uppercase tracking-wider text-sm">Success Rate</div>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-neutral-200"></div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: data.primary_color }}>{stats.years}+</div>
                        <div className="text-neutral-500 font-medium uppercase tracking-wider text-sm">Years Experience</div>
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <section id="courses" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 opacity-0 translate-y-10 transition-all duration-700 ease-out" ref={addRef}>
                    <h2 className="text-4xl font-bold mb-4">Our Courses</h2>
                    <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: data.primary_color }}></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.courses && data.courses.map((course: any, idx: number) => (
                        <div key={idx} ref={addRef} className="bg-white rounded-2xl shadow-lg p-8 border-t-8 opacity-0 translate-y-10 transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full" style={{ borderColor: data.primary_color, transitionDelay: `${idx * 150}ms` }}>
                            <h3 className="text-2xl font-bold mb-4">{course.name}</h3>
                            <p className="text-neutral-600 mb-6 flex-grow">{course.description}</p>
                            <div className="inline-block px-4 py-2 rounded-lg bg-neutral-100 font-semibold mb-6 self-start text-neutral-800 border border-neutral-200">
                                {course.fee}
                            </div>
                            <a href={`#contact`} onClick={() => setFormState(prev => ({...prev, course_interest: course.name}))} className="w-full py-3 rounded-xl font-medium text-center border-2 hover:bg-neutral-50 transition" style={{ color: data.primary_color, borderColor: data.primary_color }}>
                                Enquire &rarr;
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Results Section */}
            <section id="results" className="py-24 bg-neutral-900 text-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 opacity-0 translate-y-10 transition-all duration-700 ease-out" ref={addRef}>
                        <h2 className="text-4xl font-bold mb-4">Our Students' Success Stories</h2>
                        <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: data.primary_color }}></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.results && data.results.map((result: any, idx: number) => (
                            <div key={idx} ref={addRef} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 opacity-0 translate-y-10 transition-all duration-700 ease-out" style={{ transitionDelay: `${idx * 150}ms` }}>
                                <div className="text-neutral-300 text-sm mb-2">{result.year} • {result.exam}</div>
                                <div className="text-4xl font-black mb-4 text-white">{result.score}</div>
                                <div className="text-xl font-semibold">{result.student_name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="text-center mb-16 opacity-0 translate-y-10 transition-all duration-700 ease-out" ref={addRef}>
                        <h2 className="text-4xl font-bold mb-4">What Parents Say</h2>
                        <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: data.primary_color }}></div>
                    </div>
                    
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-8 snap-x">
                        {data.testimonials && data.testimonials.map((test: any, idx: number) => (
                            <div key={idx} ref={addRef} className="min-w-[85vw] md:min-w-0 snap-center bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 opacity-0 translate-y-10 transition-all duration-700 ease-out" style={{ transitionDelay: `${idx * 100}ms` }}>
                                <div className="text-4xl opacity-20 mb-4" style={{ color: data.primary_color }}>&quot;</div>
                                <p className="text-neutral-700 italic mb-6 text-lg">{test.text}</p>
                                <div>
                                    <div className="font-bold text-neutral-900">{test.name}</div>
                                    <div className="text-sm text-neutral-500">{test.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Faculty */}
            <section id="faculty" className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 opacity-0 translate-y-10 transition-all duration-700 ease-out" ref={addRef}>
                        <h2 className="text-4xl font-bold mb-4">Expert Faculty</h2>
                        <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: data.primary_color }}></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl mx-auto">
                        {data.faculty && data.faculty.map((member: any, idx: number) => (
                            <div key={idx} ref={addRef} className="flex items-center gap-6 opacity-0 translate-y-10 transition-all duration-700 ease-out" style={{ transitionDelay: `${idx * 150}ms` }}>
                                <div className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: data.primary_color }}>
                                    {member.initials}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1 text-neutral-900">{member.name}</h4>
                                    <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-sm font-medium text-neutral-700 mb-1">
                                        {member.subject}
                                    </div>
                                    <div className="text-sm text-neutral-500">{member.experience}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row opacity-0 translate-y-10 transition-all duration-700 ease-out" ref={addRef}>
                        {/* Left Info */}
                        <div className="lg:w-2/5 p-12 text-white flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-90" style={{ backgroundColor: data.primary_color }}></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-8">Get in Touch</h3>
                                <p className="text-white/80 mb-12 text-lg">Have questions about our courses or admissions? Drop your details and our team will get back to you.</p>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/20 p-3 rounded-full">📍</div>
                                        <div>
                                            <div className="font-semibold text-white/60 mb-1 text-sm uppercase tracking-wider">Address</div>
                                            <div className="font-medium">{data.address}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/20 p-3 rounded-full">📞</div>
                                        <div>
                                            <div className="font-semibold text-white/60 mb-1 text-sm uppercase tracking-wider">Phone</div>
                                            <div className="font-medium">+91 {data.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Form */}
                        <div className="lg:w-3/5 p-12 bg-white">
                            {formStatus === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-4xl mb-4">
                                        ✓
                                    </div>
                                    <h4 className="text-2xl font-bold text-neutral-900">Thank you!</h4>
                                    <p className="text-neutral-600 max-w-md">We have received your inquiry. Our team will contact you within 24 hours.</p>
                                    <button onClick={() => setFormStatus('idle')} className="mt-8 px-6 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition font-medium">Send another message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-neutral-700">Student Name</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.student_name} onChange={e => setFormState({...formState, student_name: e.target.value})} placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-neutral-700">Parent Phone</label>
                                            <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.parent_phone} onChange={e => setFormState({...formState, parent_phone: e.target.value})} placeholder="+91 9999999999" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-neutral-700">Class Level</label>
                                            <select required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition appearance-none bg-white" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.class_level} onChange={e => setFormState({...formState, class_level: e.target.value})}>
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
                                            <label className="text-sm font-semibold text-neutral-700">Course Interest</label>
                                            <select required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition appearance-none bg-white" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.course_interest} onChange={e => setFormState({...formState, course_interest: e.target.value})}>
                                                <option value="" disabled>Select Course</option>
                                                {data.courses && data.courses.map((c: any, i: number) => (
                                                    <option key={i} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-700">Message (Optional)</label>
                                        <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition resize-none" style={{ '--tw-ring-color': data.primary_color } as React.CSSProperties} value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} placeholder="Any specific requirements..."></textarea>
                                    </div>
                                    
                                    <button disabled={formStatus === 'loading'} type="submit" className="w-full py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition shadow-lg disabled:opacity-50" style={{ backgroundColor: data.primary_color }}>
                                        {formStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
                                    </button>
                                    {formStatus === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="text-white font-bold text-2xl mb-2">{data.institute_name}</div>
                        <p className="text-sm max-w-xs">{data.tagline}</p>
                    </div>
                    <div className="text-sm space-y-2 text-center md:text-right">
                        <div>+91 {data.phone}</div>
                        <div className="max-w-xs">{data.address}</div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <div>&copy; {new Date().getFullYear()} {data.institute_name}. All rights reserved.</div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                    </div>
                    <div className="font-semibold text-white">Powered by CoachFlow AI</div>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                {isWhatsAppOpen && (
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 animate-in slide-in-from-bottom flex flex-col border border-neutral-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-bold text-neutral-900">{data.institute_name} Support</div>
                            <button onClick={() => setIsWhatsAppOpen(false)} className="text-neutral-400 hover:text-black">✕</button>
                        </div>
                        <p className="text-neutral-600 text-sm mb-5">Hi there! How can we help you today?</p>
                        <a href={`https://wa.me/91${data.phone}?text=Hi, I found ${data.institute_name} online and want to know more`} target="_blank" rel="noreferrer" className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-center rounded-xl transition">
                            Start Chat
                        </a>
                    </div>
                )}
                
                <button 
                    onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110 transition-transform relative group">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                    </svg>
                </button>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .animate-in { animation: entrance 0.3s ease-out; }
                @keyframes entrance { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}} />
        </div>
    );
}
