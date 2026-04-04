import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useHabit } from '@/contexts/HabitContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ui/screen-header';
import CategoryCard from '@/components/ui/CategoryCard';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/ui/primary-button';
import EmptyState from '@/components/ui/empty-state';

// categories screen - lists all habit categories with their habit counts
export default function CategoriesScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { categories } = useHabit();

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScreenHeader title="Your Categories" subtitle={'${categories.length} categories'} />

            <PrimaryButton label="+ Add Category" onPress={() => router.push('/category/add' as any)} />

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {categories.length === 0 ? (
                    <EmptyState
                        icon="📂"
                        title="No categories yet"
                        subtitle="Start by creating a category to organize your habits!"
                    />
                ) : (
                    categories.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            category={cat}
                            habitCount={0}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
    list: { paddingBottom: 24, paddingTop: 14 },
});