import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — CoachFlow AI",
  description: "Terms of Service for CoachFlow AI WhatsApp lead management platform.",
};

export default function TermsOfServicePage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#e0e0e0', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Last updated: March 17, 2026</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>1. Acceptance of Terms</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          By accessing or using CoachFlow AI (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>2. Description of Service</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          CoachFlow AI is a SaaS platform that enables coaching institutes to capture and manage student leads through automated WhatsApp conversations. The service includes WhatsApp message automation, lead management dashboards, and analytics.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>3. User Accounts</h2>
        <ul style={{ lineHeight: 1.9, color: '#bbb', paddingLeft: 24 }}>
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You are responsible for all activities that occur under your account.</li>
          <li>You must notify us immediately of any unauthorized use of your account.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>4. Acceptable Use</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb', marginBottom: 12 }}>You agree not to:</p>
        <ul style={{ lineHeight: 1.9, color: '#bbb', paddingLeft: 24 }}>
          <li>Use the Service to send spam, unsolicited messages, or violate WhatsApp&apos;s policies.</li>
          <li>Collect personal information of users without their consent.</li>
          <li>Use the Service for any illegal or unauthorized purpose.</li>
          <li>Attempt to interfere with or disrupt the Service or its infrastructure.</li>
          <li>Misrepresent your identity or affiliation with any person or organization.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>5. WhatsApp Integration</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          Our Service uses Meta&apos;s WhatsApp Cloud API. By using the Service, you also agree to comply with <a href="https://www.whatsapp.com/legal/terms-of-service" style={{ color: '#4a9eff' }} target="_blank" rel="noopener noreferrer">WhatsApp&apos;s Terms of Service</a> and <a href="https://developers.facebook.com/terms/" style={{ color: '#4a9eff' }} target="_blank" rel="noopener noreferrer">Meta&apos;s Platform Terms</a>.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>6. Data and Privacy</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          Your use of the Service is also governed by our <a href="/privacy" style={{ color: '#4a9eff' }}>Privacy Policy</a>. You are responsible for ensuring that you have the necessary consent from individuals whose data you process through our platform.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>7. Intellectual Property</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          The Service and its original content, features, and functionality are owned by CoachFlow AI and are protected by applicable intellectual property laws. You retain ownership of any data you submit through the Service.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>8. Limitation of Liability</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          To the fullest extent permitted by law, CoachFlow AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities arising from your use of the Service.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>9. Termination</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service will immediately cease.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>10. Changes to Terms</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>11. Contact Us</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          If you have questions about these Terms, please contact us at: <a href="mailto:ayush799449@gmail.com" style={{ color: '#4a9eff' }}>ayush799449@gmail.com</a>
        </p>
      </section>
    </main>
  );
}
