import { AuthProvider } from '@/contexts/AuthContext';
import { HabitProvider } from '@/contexts/HabitContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { initDatabase } from '@/db/client';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep splash screen visible until the database is ready
SplashScreen.preventAutoHideAsync();

// root layout - initialising database and wrapping the app with all context providers
export default function RootLayout() {
  useEffect(() => {
    initDatabase()
    .then(() => SplashScreen.hideAsync()
  .catch((err) => {
    console.error('Error initializing database:', err);
    SplashScreen.hideAsync();
  }));
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <HabitProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}