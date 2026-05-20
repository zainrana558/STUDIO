import { Variants } from "framer-motion";

export interface Theme {
  id: 'anime' | 'cartoon' | 'horror' | 'scifi' | 'cinematic_classic' | 'default';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    display: string; // Tailwind font class e.g., 'font-sans'
    body: string;
  };
  motion: {
    spring: { mass: number; tension: number; friction: number; };
    bezier: [number, number, number, number];
  };
}

export const themes: Record<Theme['id'], Theme> = {
  default: {
    id: 'default',
    colors: { primary: '#E5E7EB', secondary: '#1F2937', accent: '#3B82F6' },
    fonts: { display: 'font-sans', body: 'font-sans' },
    motion: { spring: { mass: 0.6, tension: 250, friction: 15 }, bezier: [0.4, 0, 0.2, 1] },
  },
  anime: {
    id: 'anime',
    colors: { primary: '#FF5C00', secondary: '#1A1A2E', accent: '#00F0FF' },
    fonts: { display: 'font-space-grotesk', body: 'font-sans' },
    motion: { spring: { mass: 0.4, tension: 400, friction: 12 }, bezier: [0.6, -0.28, 0.73, 0.045] },
  },
  cartoon: {
    id: 'cartoon',
    colors: { primary: '#FF007A', secondary: '#FFE600', accent: '#00E5FF' },
    fonts: { display: 'font-fredoka-one', body: 'font-sans' },
    motion: { spring: { mass: 0.8, tension: 200, friction: 10 }, bezier: [0.34, 1.56, 0.64, 1] },
  },
  horror: {
    id: 'horror',
    colors: { primary: '#990000', secondary: '#0A0A0A', accent: '#4A5D4E' },
    fonts: { display: 'font-creepster', body: 'font-serif' },
    motion: { spring: { mass: 1, tension: 150, friction: 25 }, bezier: [0.32, 0, 0.67, 0] },
  },
  scifi: {
    id: 'scifi',
    colors: { primary: '#00FF66', secondary: '#0F172A', accent: '#7000FF' },
    fonts: { display: 'font-orbitron', body: 'font-mono' },
    motion: { spring: { mass: 0.5, tension: 500, friction: 20 }, bezier: [0.5, 0.5, 0.5, 0.5] },
  },
  cinematic_classic: {
    id: 'cinematic_classic',
    colors: { primary: '#D4AF37', secondary: '#1C1917', accent: '#E7E5E4' },
    fonts: { display: 'font-playfair-display', body: 'font-serif' },
    motion: { spring: { mass: 0.8, tension: 200, friction: 18 }, bezier: [0.16, 1, 0.3, 1] },
  },
};

export const getThemeById = (id: string | undefined | null): Theme => {
    if (id && Object.keys(themes).includes(id)) {
        return themes[id as Theme['id']];
    }
    return themes.default;
}
