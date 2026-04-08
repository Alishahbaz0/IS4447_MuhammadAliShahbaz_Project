// ----- Iteration 4: Habits CRUD -----
// Screen for viewing and editing details of a specific habit. Accessed by tapping on a habit card on the home screen.

import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Pressable, StyleSheet, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabit } from '@/contexts/HabitContext';
import { useTheme } from '@/contexts/ThemeContext';
import ScreenHeader from '@/components/ui/screen-header';
import PrimaryButton from '@/components/ui/primary-button';
import FormField from '@/components/ui/form-field';

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly'] as const;

export default function HabitDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useTheme();
    const { habits, categories, getCategoryById, updateHabit, deleteHabit } = useHabit();

    // find the habit based on the ID passed in the route params
    const habit = habits.find((h) => h.id === Number(id));

    // toggling between view and edit mode
    const [editing, setEditing ] = useState(false);

    // form state for editing the habit
    const [name, setName] = useState('');
    const [categoryID, setCategoryID] = useState<number | null>(null);
    const [frequency, setFrequency] = useState<string>('Daily');
    const [notes, setNotes] = useState('');

    // when the habit loads, populate the form fields with the existing habit data
    useEffect(() => {
        if (!habit) return;
        setName(habit.name);
        setCategoryID(habit.categoryID);
        setFrequency(habit.frequency);
        setNotes(habit.notes ?? '');
    }, [habit]);

    // if the habit doesn't exist (e.g. invalid ID), show an error message and navigate back to the home screen
    if (!habit) return null;

    const category = getCategoryById(habit.categoryID);

    // saving the edited habit by validating inputs, updating the habit in the database, and toggling back to view mode on success
    const handleSave = async () => {
        if (!name.trim()) return Alert.alert('Error', 'Please enter a habit name.');
        if (!categoryID) return Alert.alert('Error', 'Please select a category.');
        await updateHabit(habit.id, { name: name.trim(), categoryID, frequency, notes: notes.trim() });
        setEditing(false);
    };

    // confirm with user before deleting the habit, then delete it from the database and navigate back to the home screen on success
    const handleDelete = () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this habit?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteHabit(habit.id);
                    router.back();
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScreenHeader
                    title={`${category?.icon ?? '🎯 '} ${habit.name}`}
                    subtitle={`${habit.frequency} • ${category?.name ?? 'Uncategorized'}`}
                />

                {/* Editing mode */}
                {editing ? (
                    <View style={{ marginBottom: 20 }}>
                        <FormField label="Habit Name" value={name} onChangeText={setName} />

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

                        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Frequency</Text>
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

                        <View style={{ marginTop: 14 }}>
                            <FormField label="Notes (optional)" value={notes} onChangeText={setNotes} />
                        </View>

                        <View style={{ marginTop: 16 }}>
                            <PrimaryButton label="Save Changes" onPress={handleSave} />
                            <View style={{ height: 10 }} />
                                <PrimaryButton label="Cancel" variant="secondary" onPress={() => setEditing(false)} />
                            </View>
                        </View>
                    ) : (
                        // View mode - display habit details with edit and delete buttons
                        <View>
                            {habit.notes ? (
                                <View style={[styles.notesBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.border  }]}>
                                    <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>Notes:</Text>
                                    <Text style={[styles.notesText, { color: colors.text }]}>{habit.notes}</Text>
                                </View>
                            ) : null}

                            <View style={styles.actions}>
                                <PrimaryButton label="Edit Habit" onPress={() => setEditing(true)} />
                                <View style={{ height: 10 }} />
                                <PrimaryButton label="Delete Habit" variant="danger" onPress={handleDelete} />
                            </View>
                        </View>
                    )}

                    <View style={{ marginTop: 16}}>
                        <PrimaryButton label="Back to Home" variant="secondary" onPress={() => router.back()} />
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
    notesBox: { borderRadius: 12, borderWidth: 1, marginBottom: 20, padding: 14 },
    notesLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase'},
    notesText: { fontSize: 15 },
    actions: { marginTop: 8 },
});
