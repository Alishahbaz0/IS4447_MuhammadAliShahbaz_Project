// ----- Iteration 4: Habits CRUD -----
// Screen for viewing and editing details of a specific habit. Accessed by tapping on a habit card on the home screen.

// Updated as of ----- Iteration 5: Habit Logging ----- to allow viewing today's completion, streak, recent log history, etc.

import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useHabits } from '@/contexts/HabitContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly'] as const;

export default function HabitDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useTheme();
    const { 
        habits, 
        categories, 
        getCategoryById, 
        updateHabit, 
        deleteHabit,
        toggleHabitToday,
        isCompletedToday,
        getStreak,
        getLogsForHabit, 
    } = useHabits();

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

    // Iteration 5: habit logging 
    const done = isCompletedToday(habit.id);
    const streak = getStreak(habit.id);
    const recentLogs = getLogsForHabit(habit.id).slice(0, 7);
    const color = category?.color ?? colors.primary

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

                {/* Today's progress - completion toggle + streak count */}
                {!editing && (
                    <View style={[styles.todayCard, {backgroundColor: color + '18', borderColor: color + '40' }]}>
                        <View style={styles.todayRow}>
                            <View style={styles.todayInfo}>
                                <Text style={[styles.todayLabel, { color: colors.textSecondary }]}>Today</Text>
                                <Text style={[styles.todayStatus, { color }]}>
                                    {done ? 'Completed ✓' : 'Not done yet'}
                                </Text>
                            </View>
                            <View style={styles.streakInfo}>
                                <Text style={[styles.streakNum, { color }]}>🔥 {streak}</Text>
                                <Text style={[styles.streakLabel, {color: colors.textSecondary }]}>
                                    day{streak !== 1 ? 's' : ''}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 12 }}>
                            <PrimaryButton
                                label={done ? 'Mark as Not Done' : 'Mark as Done'}
                                onPress={() => toggleHabitToday(habit.id)}
                                variant={done ? 'secondary' : 'primary'}
                            />
                        </View>
                    </View>
                )}
                
                {/* Recent log history - up to last 7 entries */}
                {!editing && recentLogs.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                            Recent Activity:
                        </Text>
                        {recentLogs.map((log) => (
                            <View
                                key={log.id}
                                style={[styles.logRow, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                            >
                                <Text style={[styles.logDate, { color: colors.text }]}>{log.date}</Text>
                                <Text style={[styles.logDone, { color }]}>✓ Completed</Text>
                            </View>
                        ))}
                    </View>
                )}

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

    // Today card styles
    todayCard: { borderRadius: 14, borderWidth: 1, marginBottom: 20, padding: 16 },
    todayRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    todayInfo: { flex: 1 },
    todayLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
    todayStatus: { fontSize: 20, fontWeight: '800', marginTop: 4 },
    streakInfo: { alignItems: 'center' },
    streakNum: { fontSize: 22, fontWeight: '800' },
    streakLabel: { fontSize: 11, marginTop: 2 },

    // Recent Activity styles
    sectionLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
    logRow: {
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    logDate: { fontSize: 14, fontWeight: '600' },
    logDone: { fontSize: 13, fontWeight: '700' },
});
