'use client';

import { useState } from 'react';

export default function WebhookSetupPage() {
    const [copied, setCopied] = useState<string | null>(null);

    function copyToClipboard(text: string, label: string) {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    }

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/webhook`
        : '/api/webhook';

    return (
        <>
            <div className="page-header">
                <h1>🔗 Webhook Setup</h1>
                <p>Connect your WhatsApp Business Account to start capturing leads automatically</p>
            </div>

            {/* Step 1 */}
            <div className="chart-card">
                <div className="chart-title">Step 1: Get your Webhook URL</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                    Use this URL as your WhatsApp webhook callback URL in the Meta Developer Dashboard.
                </p>
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                    }}
                >
                    <code style={{ flex: 1, color: 'var(--accent-primary-hover)', fontSize: '14px', wordBreak: 'break-all' }}>
                        {webhookUrl}
                    </code>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => copyToClipboard(webhookUrl, 'url')}
                    >
                        {copied === 'url' ? '✓ Copied' : '📋 Copy'}
                    </button>
                </div>
            </div>

            {/* Step 2 */}
            <div className="chart-card">
                <div className="chart-title">Step 2: Configure Environment Variables</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                    Add these variables to your <code style={{ color: 'var(--accent-primary-hover)' }}>.env.local</code> file:
                </p>
                <div
                    style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        fontFamily: "'SF Mono', Consolas, monospace",
                        fontSize: '13px',
                        lineHeight: '2',
                        color: 'var(--text-secondary)',
                    }}
                >
                    <div><span style={{ color: 'var(--status-new)' }}>WHATSAPP_VERIFY_TOKEN</span>=<span style={{ color: 'var(--text-muted)' }}>your-verify-token</span></div>
                    <div><span style={{ color: 'var(--status-new)' }}>WHATSAPP_API_TOKEN</span>=<span style={{ color: 'var(--text-muted)' }}>your-whatsapp-api-token</span></div>
                    <div><span style={{ color: 'var(--status-new)' }}>WHATSAPP_PHONE_NUMBER_ID</span>=<span style={{ color: 'var(--text-muted)' }}>your-phone-number-id</span></div>
                </div>
            </div>

            {/* Step 3 */}
            <div className="chart-card">
                <div className="chart-title">Step 3: Set Up Meta Developer Dashboard</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.8' }}>
                    <ol style={{ paddingLeft: '20px' }}>
                        <li style={{ marginBottom: '12px' }}>
                            Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary-hover)' }}>Meta Developer Dashboard</a> and create/select your app
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            Add the <strong style={{ color: 'var(--text-primary)' }}>WhatsApp</strong> product to your app
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            Go to <strong style={{ color: 'var(--text-primary)' }}>WhatsApp → Configuration</strong>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            Set the <strong style={{ color: 'var(--text-primary)' }}>Callback URL</strong> to your webhook URL above
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            Set the <strong style={{ color: 'var(--text-primary)' }}>Verify Token</strong> to match your <code style={{ color: 'var(--accent-primary-hover)' }}>WHATSAPP_VERIFY_TOKEN</code>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            Subscribe to the <strong style={{ color: 'var(--text-primary)' }}>messages</strong> webhook field
                        </li>
                        <li>
                            Copy your <strong style={{ color: 'var(--text-primary)' }}>Permanent Token</strong> and <strong style={{ color: 'var(--text-primary)' }}>Phone Number ID</strong> into your env variables
                        </li>
                    </ol>
                </div>
            </div>

            {/* Bot Flow Preview */}
            <div className="chart-card">
                <div className="chart-title">💬 Bot Conversation Flow</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                    This is how the automated bot will interact with incoming WhatsApp messages:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        {
                            step: '1',
                            bot: '🎓 Welcome to our coaching institute!\n\nWhich class are you interested in?\n1️⃣ Class 9  2️⃣ Class 10  3️⃣ Class 11  4️⃣ Class 12',
                            user: 'User replies: "Class 10"',
                        },
                        {
                            step: '2',
                            bot: '📝 Great choice! Please share the student\'s full name:',
                            user: 'User replies: "Rahul Sharma"',
                        },
                        {
                            step: '3',
                            bot: '📚 Almost done! Which course or subject are you interested in?',
                            user: 'User replies: "Mathematics"',
                        },
                        {
                            step: '4',
                            bot: '✅ Thank you, Rahul Sharma!\n\nYour inquiry has been registered. Our team will reach out shortly!',
                            user: '→ Lead created in dashboard',
                        },
                    ].map((item) => (
                        <div
                            key={item.step}
                            style={{
                                display: 'flex',
                                gap: '16px',
                                padding: '16px',
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'var(--accent-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: 'white',
                                    flexShrink: 0,
                                }}
                            >
                                {item.step}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        color: 'var(--text-primary)',
                                        fontSize: '13px',
                                        whiteSpace: 'pre-line',
                                        marginBottom: '8px',
                                        padding: '10px 14px',
                                        background: 'var(--bg-glass-hover)',
                                        borderRadius: 'var(--radius-sm)',
                                        lineHeight: '1.6',
                                    }}
                                >
                                    {item.bot}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    {item.user}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
