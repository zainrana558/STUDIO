import React from "react";
import { Metadata } from "next";

export type ThemeMode = "classic" | "anime" | "playful" | "abyss" | "cosmic";

interface ThemeConfig {
  bgColor: string;
  accentColor: string;
  logoGlow: string;
  fontFamily: string;
  cardRadius: string;
}

const NEXT_THEME_SPECS: Record<string, ThemeConfig> = {
  anime: {
    bgColor: "#0d1117",
    accentColor: "#00f0ff",
    logoGlow: "rgba(0, 240, 255, 0.4)",
    fontFamily: "var(--font-space-grotesk)",
    cardRadius: "rounded-none",
  },
  cartoons: {
    bgColor: "#0e0b16",
    accentColor: "#ff007f",
    logoGlow: "rgba(255, 0, 127, 0.4)",
    fontFamily: "var(--font-fredoka)",
    cardRadius: "rounded-2xl",
  },
  horror: {
    bgColor: "#050505",
    accentColor: "#be0000",
    logoGlow: "rgba(190, 0, 0, 0.3)",
    fontFamily: "var(--font-cinzel)",
    cardRadius: "rounded-none",
  },
  scifi: {
    bgColor: "#020210",
    accentColor: "#bf00ff",
    logoGlow: "rgba(191, 0, 255, 0.5)",
    fontFamily: "var(--font-orbitron)",
    cardRadius: "rounded-xl",
  },
  movies: {
    bgColor: "#0B0E11",
    accentColor: "#d4af37",
    logoGlow: "rgba(212, 175, 55, 0.4)",
    fontFamily: "var(--font-playfair)",
    cardRadius: "rounded-2xl",
  },
};

export const generateMetadata = ({ params }: { params: Promise<{ slug: string }> }): Metadata => {
  return {
    title: "Lumina - Premium Cyberpunk Streaming",
    description: "Experience high-fidelity streaming with glassmorphism design",
  };
};

export default async function GenreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "scifi";
  const theme = NEXT_THEME_SPECS[slug] || NEXT_THEME_SPECS.scifi;

  return (
    <div style={{ backgroundColor: theme.bgColor }} className="min-h-screen w-full">
      <style>{`
        :root {
          --accent-color: ${theme.accentColor};
          --logo-glow: ${theme.logoGlow};
        }
      `}</style>
      {children}
    </div>
  );
}