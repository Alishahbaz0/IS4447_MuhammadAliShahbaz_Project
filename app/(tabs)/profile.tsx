
{/*
----- Iteration 8: Seed Data -----
this profile tab allows users to:
- view their account details,
- load seed data from ./db/seed.ts into their account to view sample usage data,
- delete their account, and
- log out 
*/}

import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/contexts/HabitContext';
import { useTheme } from '@/contexts/ThemeContext';
import { seedSampleData, wipeUserData } from '@/db/seed';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Profile / settings tab
export default function ProfileScreen() {
    const { user, logout, deleteAccount } = useAuth();
    const { colors } = useTheme();
    const { refreshAll, habits, categories } = useHabits();
    const router = useRouter();

    // Load sample data - confirms first since it replaces existing data
    const handleLoadSampleData = () => {
        if (!user) return;
        Alert.alert(
            'Load Sample Data.',
            'This will replace all your current habits, categories, and logs with sample data. Would you like to continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Load Sample Data',
                    onPress: async () => {
                        try {
                            await wipeUserData(user.id);
                            await seedSampleData(user.id);
                            await refreshAll();
                            Alert.alert('Success', 'Sample data loaded and ready to view.');
                        } catch (err: any) {
                            Alert.alert('Error', err.message ?? 'Failed to load sample data.');
                        }
                    },
                },
            ]
        );
    };

    // Wiping all data for the current user. 
    const handleClearData = () => {
        if (!user) return;
        Alert.alert('Clear All Data', 'Delete all habits, categories, logs, and targets?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear All',
                style: 'destructive',
                onPress: async () => {
                    await wipeUserData(user.id);
                    await refreshAll();
                    Alert.alert('Done', 'All your data has been cleared.');
                },
            },
        ]);
    };

    // Logout button
    const handleLogout = () => {
        logout();
        setTimeout(() => router.replace('/login'), 100);
    };

    // delete account option
    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This will permanently delete your account and all data. This is irreversible.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Account',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteAccount();
                        setTimeout(() => router.replace('/login'), 100);
                    },
                },
            ]
        );
    };

    // page layout
    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Profile" subtitle="Account and app settings" />

                {/* account info card */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Signed in as </Text>
                    <Text style={[styles.userName, { color: colors.text }]}>{user?.username}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNum, { color: colors.primary }]}>{habits.length}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Habits</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNum, { color: colors.primary }]}>{categories.length}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Categories</Text>
                        </View>
                    </View>
                </View>

                {/* Data management section */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Data</Text>
                <PrimaryButton label="Load Sample Data" onPress={handleLoadSampleData} />
                <View style={{ height: 10 }} />
                <PrimaryButton label="Clear All Data" variant="secondary" onPress={handleClearData} />

                {/* Account section */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 20 }]}>Account</Text>
                <PrimaryButton label="Sign Out" variant="secondary" onPress={handleLogout} />
                <View style={{ height: 10 }} />
                <PrimaryButton label="Delete Account" variant="danger" onPress={handleDeleteAccount} />

                {/* About Section */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 20 }]}>About</Text>
                <View style={{ marginTop: 30, alignItems: 'center' }}>
                    <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
                        Habit Tracker
                    </Text>
                    <Text style={[styles.aboutSub, { color: colors.textSecondary }]}>
                        IS4447: Mobile App Development Project by Muhammad Ali Shahbaz.
                    </Text>
                    <Text style={[styles.aboutSub, { color: colors.textSecondary }]}>
                        This app is designed to help users keep track of their habits and monitor their progress in various areas.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
    card: { borderRadius: 14, borderWidth: 1, marginBottom: 20, padding: 16 },
    label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
    userName: { fontSize: 22, fontWeight: '800', marginTop: 4 },
    userEmail: { fontSize: 14, marginTop: 2 },
    statsRow: { flexDirection: 'row', gap: 30, marginTop: 16 },
    statItem: { alignItems: 'flex-start' },
    statNum: { fontSize: 22, fontWeight: '800' },
    statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2, textTransform: 'uppercase' },
    sectionLabel: { fontSize: 12, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase' },
    aboutText: { fontSize: 14, fontWeight: '700' },
    aboutSub: { fontSize: 12, marginTop: 2 },
});