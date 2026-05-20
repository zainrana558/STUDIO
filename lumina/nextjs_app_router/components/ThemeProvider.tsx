
"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { themes, Theme } from '../lib/themes';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const activeTheme = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments[0] === 'genre' && pathSegments[1]) {
        return themes[pathSegments[1] as keyof typeof themes] || themes.default;
    }
    return themes.default;
  }, [pathname]);
  
  const themeCSS = useMemo(() => {
    if (!activeTheme) return '';
    const cssVars = {
        '--color-primary': activeTheme.colors.primary,
        '--color-secondary': activeTheme.colors.secondary,
        '--color-accent': activeTheme.colors.accent,
        '--font-display': activeTheme.fonts.display,
        '--font-body': activeTheme.fonts.body,
    };
    return `:root { ${Object.entries(cssVars).map(([key, value]) => `${key}: ${value};`).join(' ')} }`;
  }, [activeTheme]);


  return (
    <ThemeContext.Provider value={{ theme: activeTheme }}>
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      {children}
    </ThemeContext.Provider>
  );
};
