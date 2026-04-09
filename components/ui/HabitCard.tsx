// ----- Iteration 4: Habits CRUD -----
// A card component for displaying habit details on the home screen.

import { Category, Habit, useHabits } from '@/contexts/HabitContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    habit: Habit;
    category: Category | undefined;
};

// A card component for displaying habit details on the home screen.
// Tapping on the card navigates to the habit details screen.
export default function HabitCard({ habit, category }: Props) {
    const router = useRouter();
    const { colors } = useTheme();
    // ----- Iteration 5: Habit Logging -----
    const { isCompletedToday, toggleHabitToday, getStreak } = useHabits();

    // setting a default colour if there's no set category
    const color = category?.color ?? colors.primary;
    const icon = category?.icon ?? "🎯";
    // ----- Iteration 5: Habit Logging -----
    const done = isCompletedToday(habit.id);
    const streak = getStreak(habit.id);

    // toggling completion
    const handleToggle = async () => {
        await toggleHabitToday(habit.id);
    }

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {/* Tappable completion circle on left-side */}
            <Pressable onPress={handleToggle} style={styles.checkWrap}>
                <View 
                    style={[
                        styles.check,
                        {
                            backgroundColor: done ? color: 'transparent',
                            borderColor: color,
                        },
                    ]}
                >
                    {done && <Text style={styles.checkMark}>✓</Text>}
                </View>
            </Pressable>

            {/* Tapping the body directs to habit detail screen */}
            <Pressable
                onPress={() => router.push({ pathname: '/habit/[id]', params: { id: habit.id.toString() } })}
                style={styles.body}
            >
                <View style={styles.info}>
                    <Text 
                        style={[
                            styles.name,
                            { color: colors.text },
                            done && styles.nameDone,
                        ]}
                        numberOfLines={1}
                    >
                        {icon} {habit.name}
                    </Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
                        {habit.frequency} · {category?.name ?? 'Uncategorised'}
                    </Text>
                </View>

                {/* Streak Badge - only shown when the user has built up a streak */}
                {streak > 0 && (
                    <View style={[styles.meta, { backgroundColor: color + '20' }]}>
                        <Text style={[styles.streakText, {color}]}>🔥 {streak}</Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 14,
        marginBottom: 10,
    },
    checkWrap: { marginRight: 12},
    check: { 
        alignItems: 'center',
        borderRadius: 999,
        borderWidth: 2,
        height: 32,
        justifyContent: 'center',
        width: 32,
    },
    checkMark: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    body: { alignItems: 'center', flex: 1, flexDirection: 'row' },
    icon: { fontSize: 22 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '700' },
    nameDone: { opacity: 0.55, textDecorationLine: 'line-through' },
    meta: { fontSize: 13, marginTop: 2, textTransform: 'capitalize' },
    streakBadge: { 
        borderRadius: 999,
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
     },
     streakText: { fontSize: 13, fontWeight: '700' },
});
