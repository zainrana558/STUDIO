import '../styles/globals.css';
import { Navbar } from '../components/Navbar';
import { headers } from 'next/headers';
import { ThemeProvider } from '../components/ThemeProvider';
import { getThemeById, Theme } from '../lib/themes';
import { Inter, Space_Grotesk, Fredoka_One, Creepster, Orbitron, Playfair_Display } from 'next/font/google';

// Font definitions to match the theme requirements
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const fredokaOne = Fredoka_One({ subsets: ['latin'], weight: '400', variable: '--font-fredoka-one' });
const creepster = Creepster({ subsets: ['latin'], weight: '400', variable: '--font-creepster' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });

export const metadata = {
  title: "Luminaa2 - Next-Generation Streaming",
  description: "A high-performance media streaming platform with a dynamic, genre-aware interface.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const heads = headers();
  // Using 'x-invoke-path' as it's more reliable for the initial path.
  const pathname = heads.get('x-invoke-path') || '/'; 
  
  // Server-side theme detection for initial render
  const pathSegments = pathname.split('/').filter(Boolean);
  let initialTheme: Theme;
  if (pathSegments[0] === 'genre' && pathSegments[1]) {
    initialTheme = getThemeById(pathSegments[1]);
  } else {
    initialTheme = getThemeById('default');
  }

  return (
    <html lang="en">
      {/* 
        The body tag is now correctly populated with server-side determined font classes.
        This prevents any flash of unstyled text (FOUT).
        The font variables are then available for the tailwind.config.ts
      */}
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${fredokaOne.variable} ${creepster.variable} ${orbitron.variable} ${playfairDisplay.variable} ${initialTheme.fonts.display}`}>
        <ThemeProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
