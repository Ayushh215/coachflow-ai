import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CoachFlow AI",
  description: "Privacy Policy for CoachFlow AI WhatsApp lead management platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#e0e0e0', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Last updated: March 17, 2026</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>1. Introduction</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          CoachFlow AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a WhatsApp-based lead capture and management platform for coaching institutes. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>2. Information We Collect</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb', marginBottom: 12 }}>We may collect the following types of information:</p>
        <ul style={{ lineHeight: 1.9, color: '#bbb', paddingLeft: 24 }}>
          <li><strong>Contact Information:</strong> Phone numbers and names provided via WhatsApp conversations.</li>
          <li><strong>Inquiry Details:</strong> Messages you send related to course inquiries, class preferences, and student information.</li>
          <li><strong>Account Information:</strong> Name, email, and institute details provided by coaching institute owners during sign-up.</li>
          <li><strong>Usage Data:</strong> Log data such as access times, pages viewed, and interactions with the platform.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>3. How We Use Your Information</h2>
        <ul style={{ lineHeight: 1.9, color: '#bbb', paddingLeft: 24 }}>
          <li>To facilitate communication between coaching institutes and prospective students via WhatsApp.</li>
          <li>To capture and manage leads for coaching institute owners.</li>
          <li>To send automated responses and follow-up messages.</li>
          <li>To improve our platform and develop new features.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>4. Data Sharing</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          We do not sell your personal information. We may share data with:
        </p>
        <ul style={{ lineHeight: 1.9, color: '#bbb', paddingLeft: 24 }}>
          <li><strong>Coaching Institute Owners:</strong> Lead information is shared with the institute that received your inquiry.</li>
          <li><strong>Service Providers:</strong> We use Meta (WhatsApp Cloud API) and hosting providers (Vercel) to operate our service.</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>5. Data Retention</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          We retain your information for as long as necessary to provide our services. Coaching institute owners can delete lead records at any time through their dashboard. You may also request deletion of your data by contacting us.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>6. Data Security</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          We implement appropriate technical and organizational security measures to protect your personal information, including encrypted database connections and secure API communications.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>7. Your Rights</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>You have the right to:</p>
        <ul style={{ lineHeight: 1.9, color: '#bbb', paddingLeft: 24 }}>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your data.</li>
          <li>Withdraw consent for data processing.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>8. Third-Party Services</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          Our service integrates with Meta&apos;s WhatsApp Cloud API. Your use of WhatsApp is also subject to <a href="https://www.whatsapp.com/legal/privacy-policy" style={{ color: '#4a9eff' }} target="_blank" rel="noopener noreferrer">WhatsApp&apos;s Privacy Policy</a>.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>9. Contact Us</h2>
        <p style={{ lineHeight: 1.7, color: '#bbb' }}>
          If you have questions about this Privacy Policy, please contact us at: <a href="mailto:ayush799449@gmail.com" style={{ color: '#4a9eff' }}>ayush799449@gmail.com</a>
        </p>
      </section>
    </main>
  );
}
