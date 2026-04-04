import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Category } from '@/contexts/HabitContext';
import { useRouter } from 'expo-router';

type Props = {
    category: Category;
    habitCount: number;
};

// displaying a category card with its name, icon, and habit count. Navigates to the category details on press.
export default function CategoryCard({ category, habitCount }: Props) {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <Pressable
            onPress={() => router.push(`/category/${category.id}` as any)}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
            {/* Icon circle and background */}
            <View style={[styles.iconCircle, {backgroundColor: category.color + '20'}]}>
                <Text style={styles.icon}>{category.icon}</Text>
            </View>

            {/* Category name and habit count */}
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{category.name}</Text>
                <Text style={[styles.count, { color: colors.textSecondary }]}>{habitCount} {habitCount === 1 ? 's' : ''}</Text>
            </View>

            {/* Colour indicator dot */}
            <View style={[styles.colorDot, { backgroundColor: category.color }]} />
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
    count: { fontSize: 13, marginTop: 2 },
    colorDot: { borderRadius: 999, height: 12, width: 12 },
});