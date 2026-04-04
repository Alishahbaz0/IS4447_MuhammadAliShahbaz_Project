import EmptyState from '@/components/ui/empty-state';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// home screen - shows welcome message and login/signup options for unauthenticated users
export default function HomeScreen() {
    const { user, logout } = useAuth();
    const { colors } = useTheme();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        setTimeout(() => router.replace('/'), 100);
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScreenHeader 
                title={`Welcome ${user?.username ?? 'to HabitTracker'}`}
                subtitle="Track your habits and stay productive!"
            />

            <EmptyState
                icon="🎯"
                title="No habits yet..."
                subtitle="Start by creating categories and adding your habits!"
            />

            <PrimaryButton label="Sign out" variant="secondary" onPress={handleLogout} />
        </SafeAreaView>
    );
}  

const styles = StyleSheet.create({
    safe: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
});
