// ----- Iteration 4: Habits CRUD -----
// This index page displays: a search bar, filter options, a list of habits, and logout button for the user

// I learned how to create a search bar using the following tutorial:
// Search Filter React Native, Code with Beto, Available at:
// https://medium.com/@betomoedano01/search-filter-react-native-search-bar-tutorial-fe3069fa55b5

// I learned how to use useMemo from the following documentation:
// useMemo, React Official Docs, Available at:
// https://react.dev/reference/react/useMemo

import EmptyState from '@/components/ui/empty-state';
import HabitCard from '@/components/ui/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useAuth } from '@/contexts/AuthContext';
import { useHabit } from '@/contexts/HabitContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// home screen - shows welcome message and login/signup options for unauthenticated users
export default function HomeScreen() {
    const { user, logout } = useAuth();
    const { colors } = useTheme();
    const { habits, categories, getCategoryById } = useHabit();
    const router = useRouter();

    // Search and filter state
    const [search, setSearch] = useState('');
    const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(null);

    // filtering habits based on search query and selected category
    const filteredHabits = useMemo(() => {
        return habits.filter((h) => {
            const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategoryID === null || h.categoryID === selectedCategoryID;
            return matchesSearch && matchesCategory;
        });
    }, [habits, search, selectedCategoryID]);

    // logging out the user and redirecting to the login screen
    const handleLogout = () => {
        logout();
        setTimeout(() => router.replace('/'), 100);
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScreenHeader 
                title={`Welcome ${user?.username ?? 'to HabitTracker'}`}
                subtitle={`${habits.length} habit(s) being tracked.`}
            />

            {/* ----- Iteration 4: Habits CRUD ----- */}
            {/* Search input */}
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search habits..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.search, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border  }]}
            />

            {/* Category filter */}
            {categories.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pills} contentContainerStyle={styles.pillsContent}>
                    <FilterPill
                        label="All"
                        active={selectedCategoryID === null}
                        onPress={() => setSelectedCategoryID(null)}
                        color={colors.primary}
                    />
                    {categories.map((cat) => (
                        <FilterPill
                            key={cat.id}
                            label={`${cat.icon} ${cat.name}`}
                            active={selectedCategoryID === cat.id}
                            onPress={() => setSelectedCategoryID(cat.id)}
                            color={cat.color}
                        />
                    ))}
                </ScrollView>
            )}

            <PrimaryButton label="Create New Habit" onPress={() => router.push('/habit/add' as any)} />

            {/* Habit list */}
            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {filteredHabits.length === 0 ? (
                    <EmptyState
                        icon="🎯"
                        title="No habits yet..."
                        subtitle={
                            habits.length === 0
                                ? "Start by creating a new habit to track your progress!"
                                : "No habits match your search/filter criteria."
                        }
                    />
                ) : (
                    filteredHabits.map((h) => (
                        <HabitCard key={h.id} habit={h} category={getCategoryById(h.categoryID)} />
                    ))
                )}

                {/* Logout button at the bottom of the list */}
                <View style={{ marginTop: 20 }}>
                    <PrimaryButton label="Logout" variant="secondary" onPress={handleLogout} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// creating a reusable pill button function for the category filters
// I learned how to create this by following this GitHub tutorial:
// React Pill, Neha, GitHub, Available at:
// https://github.com/Neha/react-pill
function FilterPill({ label, active, onPress, color }: { label: string; active: boolean; onPress: () => void; color: string }) {
    const { colors } = useTheme();
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.pill,
                {
                    backgroundColor: active ? color + '25' : colors.surfaceAlt,
                    borderColor: active ? color : colors.border
                },
            ]}
        >
            <Text style={[styles.pillText, { color: active ? color : colors.textSecondary }]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
    search: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 15,
    },
    pills: { marginBottom: 12, maxHeight: 44 },
    pillsContent: { gap: 8, paddingRight: 10 },
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
    },
    pillText: { fontSize: 13, fontWeight: '600' },
    list: { paddingBottom: 24, paddingTop: 8 },
});
