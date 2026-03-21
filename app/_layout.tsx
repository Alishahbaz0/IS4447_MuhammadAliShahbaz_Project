import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { initDatabase } from '@/db/client';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// Keep splash screen visible until the database is ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => {
        setDbReady(true);
        SplashScreen.hideAsync();
      })
      .catch((err) => {
        console.error('Database init failed:', err);
        SplashScreen.hideAsync();
      });
  }, []);

  // Always render the Stack — never return a plain View
  // The splash screen covers the app until the DB is ready
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}