import '../styles/globals.css';
import { PageTransition } from '../components/Layout/PageTransition';
import { ResponsiveLayout } from '../components/Layout/ResponsiveLayout';
import { MobileBottomNav } from '../components/Layout/MobileBottomNav';
import { Space_Grotesk, Fredoka_One, Creepster, Orbitron, Playfair_Display } from 'next/font/google';

// --- Font Definitions for Dynamic Theming ---
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const fredokaOne = Fredoka_One({ subsets: ['latin'], weight: '400', variable: '--font-fredoka-one' });
const creepster = Creepster({ subsets: ['latin'], weight: '400', variable: '--font-creepster' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

export const metadata = {
  title: 'Luminaa2 - Next-Gen Streaming',
  description: 'An elite, high-performance media streaming platform.',
};

/**
 * The root layout. It orchestrates the Navbar, Page Transitions, and font loading.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${fredokaOne.variable} ${creepster.variable} ${orbitron.variable} ${playfairDisplay.variable}`}>
      <body className="bg-gray-950 text-white">
        <ResponsiveLayout>
          <PageTransition>
            {children}
          </PageTransition>
        </ResponsiveLayout>
        <MobileBottomNav />
      </body>
    </html>
  );
}
