
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  motion: {
    spring: { mass: number; tension: number; friction: number; };
    bezier: [number, number, number, number];
  };
  styles: {
    card: {
      borderRadius: string;
    }
  };
}

export const themes: Record<string, Theme> = {
  anime: {
    colors: {
      primary: '#00F0FF',
      secondary: '#0d1117',
      accent: '#FF5C00',
    },
    fonts: { display: 'font-orbitron', body: 'font-space-grotesk' },
    motion: {
      spring: { mass: 0.4, tension: 400, friction: 12 },
      bezier: [0.16, 1, 0.3, 1],
    },
    styles: { card: { borderRadius: 'rounded-sm' } },
  },
  cartoon: {
    colors: {
      primary: '#FF007A',
      secondary: '#1a1a2e',
      accent: '#00E5FF',
    },
    fonts: { display: 'font-fredoka-one', body: 'font-fredoka-one' },
    motion: {
      spring: { mass: 0.6, tension: 300, friction: 10 },
      bezier: [0.34, 1.56, 0.64, 1],
    },
    styles: { card: { borderRadius: 'rounded-2xl' } },
  },
  horror: {
    colors: {
      primary: '#990000',
      secondary: '#050505',
      accent: '#4A5D4E',
    },
    fonts: { display: 'font-creepster', body: 'font-playfair-display' },
    motion: {
      spring: { mass: 1.2, tension: 100, friction: 30 },
      bezier: [0.33, 1, 0.68, 1],
    },
    styles: { card: { borderRadius: 'rounded-none' } },
  },
  scifi: {
    colors: {
      primary: '#00FF66',
      secondary: '#0F172A',
      accent: '#7000FF',
    },
    fonts: { display: 'font-orbitron', body: 'font-space-grotesk' },
    motion: {
      spring: { mass: 0.8, tension: 250, friction: 20 },
      bezier: [0.4, 0, 0.2, 1],
    },
    styles: { card: { borderRadius: 'rounded-md' } },
  },
  cinematic_classic: {
    colors: {
      primary: '#D4AF37',
      secondary: '#1C1917',
      accent: '#E7E5E4',
    },
    fonts: { display: 'font-playfair-display', body: 'font-sans' },
    motion: {
      spring: { mass: 1, tension: 170, friction: 26 },
      bezier: [0.16, 1, 0.3, 1],
    },
    styles: { card: { borderRadius: 'rounded-lg' } },
  },
  default: {
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
