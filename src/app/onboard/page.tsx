'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        institute_name: '',
        whatsapp_phone_number_id: '',
        whatsapp_access_token: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function updateField(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Signup failed');
                return;
            }

            setSuccess(true);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="split-layout">
            <div className="split-left">
                <div className="split-left-content">
                    <div className="split-brand">
                        <div className="split-brand-icon">🎓</div>
                        <h1>CoachFlow AI</h1>
                    </div>
                    
                    <h2 className="split-title">Start automating today</h2>
                    <p className="split-subtitle">
                        Create your institute profile and connect WhatsApp to instantly capture and organize leads 24/7.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="feature-icon">✨</div>
                            <div className="feature-text">
                                <h3>Smart NLP Assistant</h3>
                                <p>Automated Hinglish intent extraction built for Indian institutes.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">📊</div>
                            <div className="feature-text">
                                <h3>Actionable Insights</h3>
                                <p>Track conversion rates, team performance, and lead volume easily.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">⚡</div>
                            <div className="feature-text">
                                <h3>Zero Drop-offs</h3>
                                <p>Instant automated responses ensure you never miss a student inquiry.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="split-right" style={{ padding: '48px 24px', overflowY: 'auto' }}>
                <div className="split-form-container" style={{ maxWidth: '440px' }}>
                    
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 1.5rem', boxShadow: '0 0 24px var(--success-bg)' }}>✓</div>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Account Created!</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
                                We have logged a mock verification email to your server console. 
                                Please check your terminal, click the link to verify your email, and then you can sign in.
                            </p>
                            <button onClick={() => router.push('/login')} className="btn btn-primary" style={{ width: '100%' }}>
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Create your account</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>Welcome! Fill in your details to get started.</p>
                            </div>

                            {error && <div className="auth-error" style={{ color: 'red', textAlign: 'center', marginBottom: '1.5rem', marginTop: 0 }}>{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                                        <label htmlFor="institute_name">Institute Name</label>
                                        <input
                                            id="institute_name"
                                            type="text"
                                            className="form-input"
                                            placeholder="Excellence Academy"
                                            value={form.institute_name}
                                            onChange={(e) => updateField('institute_name', e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                                        <label htmlFor="name">Your Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            className="form-input"
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="form-input"
                                        placeholder="you@institute.com"
                                        value={form.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="form-input"
                                            placeholder="Minimum 8 characters"
                                            value={form.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>WhatsApp Intergration</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Connect your Meta API to enable bot.</p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="whatsapp_phone_number_id" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        Phone Number ID
                                        <span title="Find this in your Meta Developer Dashboard → WhatsApp → API Setup" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--bg-glass-hover)', border: '1px solid var(--border-color)', fontSize: '10px', color: 'var(--text-secondary)', cursor: 'help' }}>?</span>
                                    </label>
                                    <input
                                        id="whatsapp_phone_number_id"
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. 112233445566778"
                                        value={form.whatsapp_phone_number_id}
                                        onChange={(e) => updateField('whatsapp_phone_number_id', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="whatsapp_access_token" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        Access Token
                                        <span title="Permanent token generated in Meta Business Settings" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--bg-glass-hover)', border: '1px solid var(--border-color)', fontSize: '10px', color: 'var(--text-secondary)', cursor: 'help' }}>?</span>
                                    </label>
                                    <input
                                        id="whatsapp_access_token"
                                        type="password"
                                        className="form-input"
                                        placeholder="EAAI..."
                                        value={form.whatsapp_access_token}
                                        onChange={(e) => updateField('whatsapp_access_token', e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </button>
                            </form>

                            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                Already have an account?{' '}
                                <Link href="/login" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sign in</Link>
                            </div>
                        </>
                    )}
                </div>
                
                <div style={{ position: 'absolute', bottom: '24px', display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    <Link href="/privacy" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>Privacy Policy</Link>
                    <Link href="/terms" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}
