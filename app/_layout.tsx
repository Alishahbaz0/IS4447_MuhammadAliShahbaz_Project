import { ThemeProvider } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

// the root layout that wraps the entire app, providing theme context and consistent screen structure
// stack navigator from expo-router to handle screen transitions and header configuration
export default function RootLayout() {
    return (
        <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
    );
}