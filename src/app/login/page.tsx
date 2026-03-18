'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            router.push('/dashboard');
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
                    
                    <h2 className="split-title">Welcome back</h2>
                    <p className="split-subtitle">
                        Manage your institute, automate your lead capture, and boost conversions with WhatsApp.
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

            <div className="split-right">
                <div className="split-form-container">
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Sign in to your account</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Please enter your details.</p>
                    </div>

                    {error && <div className="auth-error" style={{ color: 'red', textAlign: 'center', marginBottom: '1.5rem', marginTop: 0 }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="name@institute.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
                                <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 0, cursor: 'pointer', fontWeight: 400 }}>Remember me</label>
                            </div>
                            <a href="#" style={{ fontSize: '13px', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Don&apos;t have an account?{' '}
                        <a href="/onboard" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sign up</a>
                    </div>
                </div>
                
                <div style={{ position: 'absolute', bottom: '24px', display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    <Link href="/privacy" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>Privacy Policy</Link>
                    <Link href="/terms" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}
