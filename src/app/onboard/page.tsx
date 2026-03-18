'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        <div className="auth-container">
            {success ? (
                <div className="auth-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    <div className="auth-logo">
                        <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>✓</div>
                        <h1>Account Created!</h1>
                        <p style={{ marginTop: '1rem', color: '#64748b' }}>
                            We have logged a mock verification email to your server console. 
                            Please check your terminal, click the link to verify your email, and then you can sign in.
                        </p>
                    </div>
                    <button onClick={() => router.push('/login')} className="btn btn-primary" style={{ marginTop: '2rem' }}>
                        Go to Login
                    </button>
                </div>
            ) : (
                <div className="auth-card" style={{ maxWidth: '500px' }}>
                    <div className="auth-logo">
                        <div className="auth-logo-icon">🎓</div>
                        <h1>CoachFlow AI Onboarding</h1>
                        <p>Create your institute account and connect WhatsApp</p>
                    </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="institute_name">Institute Name</label>
                        <input
                            id="institute_name"
                            type="text"
                            className="form-input"
                            placeholder="Excellence Coaching Academy"
                            value={form.institute_name}
                            onChange={(e) => updateField('institute_name', e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Owner Name</label>
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
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Minimum 6 characters"
                            value={form.password}
                            onChange={(e) => updateField('password', e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="section-header" style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>WhatsApp Meta Integration</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Connect your WhatsApp Business API</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="whatsapp_phone_number_id">WhatsApp Phone Number ID</label>
                        <input
                            id="whatsapp_phone_number_id"
                            type="text"
                            className="form-input"
                            placeholder="e.g. 112233445566778"
                            value={form.whatsapp_phone_number_id}
                            onChange={(e) => updateField('whatsapp_phone_number_id', e.target.value)}
                        />
                        <small className="form-helper">
                            Found in Meta Developer Dashboard &gt; WhatsApp &gt; API Setup
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="whatsapp_access_token">WhatsApp Access Token</label>
                        <input
                            id="whatsapp_access_token"
                            type="password"
                            className="form-input"
                            placeholder="EAAI..."
                            value={form.whatsapp_access_token}
                            onChange={(e) => updateField('whatsapp_access_token', e.target.value)}
                        />
                        <small className="form-helper">
                            Permanent token generated in Meta Business Settings
                        </small>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <a href="/login">Sign in</a>
                </div>
            </div>
            )}
        </div>
    );
}
