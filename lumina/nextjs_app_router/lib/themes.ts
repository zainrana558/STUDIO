
/**
 * =================================================================
 * LUMINAA2 DYNAMIC AESTHETIC MORPHING SYSTEM
 * =================================================================
 * This file is the heart of the theme engine. It defines the complete
 * visual and motion language for each genre context.
 *
 * It is imported by Server Components and injected as CSS variables,
 * ensuring zero client-side overhead for theme switching.
 */

export interface Theme {
  id: 'anime' | 'cartoon' | 'horror' | 'scifi' | 'cinematic_classic' | 'default';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    display: string; // Tailwind font class e.g., 'font-orbitron'
    body: string;
  };
  motion: {
    // Framer Motion spring physics
    spring: { mass: number; tension: number; friction: number; };
    // Framer Motion cubic-bezier easing
    bezier: [number, number, number, number];
  };
  styles: {
    card: {
      borderRadius: string; // e.g., 'rounded-none', 'rounded-2xl'
    }
  };
}

// Type assertion for the themes object
export const themes: Record<Theme['id'], Theme> = {
  anime: {
    id: 'anime',
    colors: {
      primary: '#00F0FF', // Cyan Shock
      secondary: '#0d1117', // Deep Slate
      accent: '#FF5C00', // Neon Orange
    },
    fonts: { display: 'font-orbitron', body: 'font-space-grotesk' },
    motion: {
      spring: { mass: 0.4, tension: 400, friction: 12 }, // Snappy, elastic
      bezier: [0.16, 1, 0.3, 1],
    },
    styles: { card: { borderRadius: 'rounded-sm' } },
  },
  cartoon: {
    id: 'cartoon',
    colors: {
      primary: '#FF007A', // Bubblegum Pink
      secondary: '#1a1a2e', // Deep Navy Blue
      accent: '#00E5FF', // Vibrant Teal
    },
    fonts: { display: 'font-fredoka-one', body: 'font-fredoka-one' },
    motion: {
      spring: { mass: 0.6, tension: 300, friction: 10 }, // Bouncy
      bezier: [0.34, 1.56, 0.64, 1],
    },
    styles: { card: { borderRadius: 'rounded-2xl' } },
  },
  horror: {
    id: 'horror',
    colors: {
      primary: '#990000', // Crimson Blood
      secondary: '#050505', // Obsidian Dark
      accent: '#4A5D4E', // Desaturated Moss
    },
    fonts: { display: 'font-creepster', body: 'font-playfair-display' },
    motion: {
      spring: { mass: 1.2, tension: 100, friction: 30 }, // Sluggish, heavy
      bezier: [0.33, 1, 0.68, 1],
    },
    styles: { card: { borderRadius: 'rounded-none' } },
  },
  scifi: {
    id: 'scifi',
    colors: {
      primary: '#00FF66', // Matrix Green
      secondary: '#0F172A', // Slate Dark
      accent: '#7000FF', // Hyper Neon Purple
    },
    fonts: { display: 'font-orbitron', body: 'font-space-grotesk' },
    motion: {
      spring: { mass: 0.8, tension: 250, friction: 20 }, // Mechanical, precise
      bezier: [0.4, 0, 0.2, 1],
    },
    styles: { card: { borderRadius: 'rounded-md' } },
  },
  cinematic_classic: {
    id: 'cinematic_classic',
    colors: {
      primary: '#D4AF37', // Metallic Gold
      secondary: '#1C1917', // Warm Stone Dark
      accent: '#E7E5E4', // Muted Cream
    },
    fonts: { display: 'font-playfair-display', body: 'font-sans' },
    motion: {
      spring: { mass: 1, tension: 170, friction: 26 }, // Elegant, smooth
      bezier: [0.16, 1, 0.3, 1],
    },
    styles: { card: { borderRadius: 'rounded-lg' } },
  },
  default: {
    id: 'default',
    colors: {
      primary: '#0070f3',
      secondary: '#000000',
      accent: '#ffffff',
    },
    fonts: { display: 'font-sans', body: 'font-sans' },
    motion: {
      spring: { mass: 1, tension: 170, friction: 26 },
      bezier: [0.4, 0, 0.2, 1],
    },
    styles: { card: { borderRadius: 'rounded-lg' } },
  }
};
