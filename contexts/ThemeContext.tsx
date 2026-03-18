import { Colors, ThemeColors } from '@/constants/theme';
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// three possible theme modes: light, dark, or device system
type ThemeMode = 'light' | 'dark' | 'system';

// context type definition
type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

// the provider component that wraps the app and provides theme values
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // detecting the system's current colour scheme (light or dark)
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  // resolve whether we're in dark mode based on user preference and system setting
  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  // select the appropriate colour palette based on the current theme
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// custom hook to easily access theme values in any component
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be inside ThemeProvider');
  return context;
}