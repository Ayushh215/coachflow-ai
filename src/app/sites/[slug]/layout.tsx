import Script from 'next/script';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 
        The main application uses bespoke raw CSS classes without Tailwind.
        We inject the Tailwind CDN specifically for the auto-generated institute sites
        so that the premium Tailwind-heavy layout works perfectly without polluting the main app!
      */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      {children}
    </>
  );
}
