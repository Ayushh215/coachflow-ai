import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoachFlow AI — Smart Lead Management for Coaching Institutes",
  description: "Automate WhatsApp inquiries and capture student leads with AI-powered lead management for coaching institutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <div style={{ flex: 1 }}>{children}</div>
        <footer style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '14px', background: '#f8fafc' }}>
            <p>© {new Date().getFullYear()} CoachFlow AI. All rights reserved.</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <a href="/privacy" style={{ color: '#3b82f6', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="/terms" style={{ color: '#3b82f6', textDecoration: 'none' }}>Terms of Service</a>
            </div>
        </footer>
      </body>
    </html>
  );
}
