import { useState, useEffect } from 'react';
import { Theme } from '@/types/theme';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('chrono-theme');
    return (stored as Theme) || 'anime';
  });

  useEffect(() => {
    localStorage.setItem('chrono-theme', currentTheme);
  }, [currentTheme]);

  const switchTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  return {
    currentTheme,
    switchTheme
  };
};