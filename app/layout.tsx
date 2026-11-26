import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { BoardTransition } from '@/components/motion/BoardTransition';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Consent } from '@/components/Consent';
import { site } from '@/lib/content';

const hertloom = localFont({
  src: './fonts/Hertloom-Regular.woff2',
  variable: '--font-hertloom',
  weight: '400',
  display: 'swap',
});

const helvena = localFont({
  src: [
    { path: './fonts/Helvena-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Helvena-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

const GA_ID = 'G-JZLKXHF15M';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Chessboard Strategy | Growth, planned like a game of chess', template: '%s | Chessboard Strategy' },
  description: site.description,
  openGraph: { type: 'website', siteName: site.name, locale: 'en_IN', url: site.url },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#0b0b0b' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  description: site.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address[0],
    addressLocality: 'Surat',
    postalCode: '395007',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  founder: { '@type': 'Person', name: 'Ankesh Prasad' },
  sameAs: [site.instagram, site.facebook].filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${hertloom.variable} ${helvena.variable}`}>
      <body>
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ebony focus:p-3 focus:text-chalk">Skip to content</a>
        <SmoothScroll>
          <BoardTransition>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <Consent />
          </BoardTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
