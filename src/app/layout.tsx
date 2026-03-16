import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoachIQ — Smart Lead Management for Coaching Institutes",
  description: "Automate WhatsApp inquiries and capture student leads with AI-powered lead management for coaching institutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
