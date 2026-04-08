// ----- Iteration 4: Habits CRUD -----
// A card component for displaying habit details on the home screen.

import { Category, Habit } from '@/contexts/HabitContext';
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

    // setting a default colour if there's no set category
    const color = category?.color ?? colors.primary;
    const icon = category?.icon ?? "🎯";

    return (
        <Pressable
            onPress={() => router.push({ pathname: '/habit/[id]' as any, params: { id: habit.id.toString() } })}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
            {/* Icon circle with the category colour */}
            <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                <Text style={[styles.icon]}>{icon}</Text>
            </View>

            {/* Habit name with frequency and category */}
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {habit.name}
                </Text>
                <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
                    {habit.frequency} • {category?.name ?? 'Uncategorized'}
                </Text>
            </View>

            {/* Category colour indicator */}
            <View style={[styles.colorDot, { backgroundColor: color }]} />
        </Pressable>
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
    iconCircle: {
        alignItems: 'center',
        borderRadius: 12,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    icon: { fontSize: 22 },
    info: { flex: 1, marginLeft: 12 },
    name: { fontSize: 16, fontWeight: '700' },
    meta: { fontSize: 13, marginTop: 2, textTransform: 'capitalize' },
    colorDot: { borderRadius: 999, height: 12, width: 12 },
});
