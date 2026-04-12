import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';

export const metadata: Metadata = {
  title: 'Smart ATS CV Optimizer — Beat the Bots, Land the Job',
  description:
    'AI-powered CV optimization. Get an instant ATS match score, discover missing keywords, and receive tailored suggestions to land more interviews.',
  keywords: ['ATS', 'CV optimizer', 'resume checker', 'job application', 'keyword analysis'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-base text-text-primary antialiased overflow-x-hidden">
        <div className="noise-overlay" aria-hidden="true" />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
