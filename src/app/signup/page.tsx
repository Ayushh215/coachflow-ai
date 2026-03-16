'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        institute_name: '',
        whatsapp_phone_number_id: '',
        admin_phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

            router.push('/dashboard');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-icon">🎓</div>
                    <h1>CoachIQ</h1>
                    <p>Create your institute account</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            id="name"
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

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
                            minLength={6}
                        />
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
                        <small className="form-helper">Found in Meta Developer Dashboard</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="admin_phone">Your WhatsApp number for notifications</label>
                        <input
                            id="admin_phone"
                            type="text"
                            className="form-input"
                            placeholder="919876543210 (country code, no +)"
                            value={form.admin_phone}
                            onChange={(e) => updateField('admin_phone', e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <a href="/login">Sign in</a>
                </div>
            </div>
        </div>
    );
}
