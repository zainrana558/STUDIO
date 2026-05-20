"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { themes, getThemeById, Theme } from '../lib/themes';

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
      return getThemeById(pathSegments[1]);
    }
    // Here you could add more logic to determine theme from media details on [type]/[id] pages
    return themes.default;
  }, [pathname]);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
