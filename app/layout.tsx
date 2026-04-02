import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Mono, DM_Sans } from 'next/font/google';
import './globals.css';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap'
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
});

const monoFont = DM_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Atelier Arte Italiana',
    template: '%s | Atelier Arte Italiana'
  },
  description: "E-commerce d'arte originale, opere uniche vendute in Italia."
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="it">
      <body className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
