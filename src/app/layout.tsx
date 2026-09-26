import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.akashdipmahapatra.in'),
  title: {
    default: 'Akashdip | Engineering Notes',
    template: '%s · Akashdip',
  },
  description:
    'Deep-dive technical essays on event-driven streaming, AWS MSK architectures, SRE operations, distributed database CDC, and incident post-mortems.',
  keywords: [
    'Akashdip Mahapatra',
    'System Architecture',
    'Kafka',
    'AWS MSK',
    'Site Reliability Engineering',
    'Data Engineering',
    'Event-Driven Architecture',
    'DevOps',
    'Cloud Infrastructure',
  ],
  authors: [{ name: 'Akashdip Mahapatra', url: 'https://akashdipmahapatra.in' }],
  creator: 'Akashdip Mahapatra',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://blog.akashdipmahapatra.in',
    title: 'Akashdip Mahapatra | Engineering Blog & Architecture Notes',
    description:
      'Deep-dive technical essays on event-driven streaming, AWS MSK architectures, SRE operations, distributed database CDC, and incident post-mortems.',
    siteName: 'Akashdip Mahapatra Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akashdip Mahapatra | Engineering Blog & Architecture Notes',
    description:
      'Deep-dive technical essays on event-driven streaming, AWS MSK architectures, SRE operations, distributed database CDC, and incident post-mortems.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  if (stored === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Header />
        <main style={{ flex: '1 0 auto' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
