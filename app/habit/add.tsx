// ----- Iteration 4: Habits CRUD -----
// Screen for adding a new habit. Accessed by tapping the "Create New Habit" button on the home screen.

import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useHabit } from '@/contexts/HabitContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// setting frequency options for the habit form
const FREQUENCIES = ['Daily', 'Weekly', 'Monthly'] as const;

// screen for adding a new habit.
export default function AddHabitScreen() {
    const { addHabit, categories } = useHabit();
    const { colors } = useTheme();
    const router = useRouter();

    // form state
    const [name, setName] = useState('');
    const [categoryID, setCategoryID] = useState<number | null>(categories[0]?.id ?? null);
    const [frequency, setFrequency] = useState<string>('daily');
    const [notes, setNotes] = useState('');

    // handling form submission by validating inputs, adding the habit to the database, and navigating to the home screen on success
    const handleSave = async () => {
        if (!name.trim()) return Alert.alert('Error', 'Please enter a habit name.');
        if (!categoryID) return Alert.alert('Error', 'Please select a category.');
        await addHabit({ name: name.trim(), categoryID, frequency, notes: notes.trim() || null });
        router.back();
        };

    // if no categories exist, prompt the user to create one first since a habit must belong to a category
    if (categories.length === 0) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
                <ScreenHeader title="Add New Habit" subtitle="Please create a category before adding habits." />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    You need to have at least one category to create a habit. Categories help you organize your habits.
                </Text>
                <PrimaryButton label="+ Create Category" onPress={() => router.replace('/(tabs)/categories' as any)} />
                <View style={{ height: 10 }} />
                <PrimaryButton label="Cancel" onPress={() => router.back()} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Add New Habit" subtitle="Start tracking a new habit!" />

                <FormField label="Habit Name" value={name} onChangeText={setName} placeholder="e.g. Exercise, Assignment, etc." />

                {/* Category picker */}
                <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
                <View style={styles.pillGrid}>
                    {categories.map((cat) => (
                        <Pressable
                            key={cat.id}
                            onPress={() => setCategoryID(cat.id)}
                            style={[
                                styles.pill,
                                { 
                                    backgroundColor: categoryID === cat.id ? cat.color + '25' : colors.surfaceAlt,
                                    borderColor: categoryID === cat.id ? cat.color : colors.border,
                                },
                            ]}
                        >
                            <Text style={[styles.pillText, { color: categoryID === cat.id ? cat.color : colors.textSecondary }]}>
                                {cat.icon} {cat.name}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Frequency picker, using three pills */}
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>Frequency</Text>
                <View style={styles.pillGrid}>
                    {FREQUENCIES.map((f) => (
                        <Pressable
                            key={f}
                            onPress={() => setFrequency(f)}
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: frequency === f ? colors.primary + '25' : colors.surfaceAlt,
                                    borderColor: frequency === f ? colors.primary : colors.border,
                                },
                            ]}
                        >
                            <Text style={[styles.pillText, { color: frequency === f ? colors.primary : colors.textSecondary, textTransform: 'capitalize' }]}>
                                {f}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <View style={{ marginTop: 16}}>
                    <FormField label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Additional details about the habit..." />
                </View>

                <View style={styles.buttons}>
                    <PrimaryButton label="Save Habit" onPress={handleSave} />
                    <View style={{ height: 10 }} />
                    <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
                </View>
            </ScrollView>
         </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, padding: 20 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
    pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    pill: {
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    pillText: { fontSize: 13, fontWeight: '600' },
    buttons: { marginTop: 24 },
    emptyText: { fontSize: 15, marginVertical: 20, textAlign: 'center' },
});