// screen for editing an existing habit category, allowing changes to name, icon, and color
// allows category deletion with confirmation
// I learned how to create this dynamic route using the following online resources:

// Using UseLocalSearchParams with dynamic routes, Expo Documentation, Available at:
// https://docs.expo.dev/router/reference/url-parameters/

// Expo Router Tab Navigation, Aaron Saunders, YouTube Tutorial, Available at:
// https://www.youtube.com/watch?v=ZCj85YJZF04

import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { CategoryColors, CategoryIcons } from '@/constants/theme';
import { useHabit } from '@/contexts/HabitContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CategoryDetailScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { categories, updateCategory, deleteCategory } = useHabit();
    const { id } = useLocalSearchParams();

    // find the category from the cached list
    const category = categories.find((c) => c.id === Number(id));

    // toggling between edit and view mode
    const [editing, setEditing] = useState(false);

    // edit form state 
    const [name, setName ] = useState('');
    const [icon, setIcon] = useState('');
    const [color, setColor] = useState('');

    // pre-fill form when category loads or updates
    useEffect(() => {
        if (!category) return;
        setName(category.name);
        setIcon(category.icon);
        setColor(category.color);
    }, [category]);

    // handling missing category (e.g. deleted or invalid id)
    if (!category) return null;

    // save changes to category
    const handleSave = async () => {
        if (!name.trim()) return Alert.alert('Validation Error', 'Category name cannot be empty.');
        await updateCategory(category.id, { name: name.trim(), icon, color });
        setEditing(false);
    };

    // confirm and delete category
    const handleDelete = () => {
        Alert.alert('Delete Category', 'Are you sure you want to delete this category? This action cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                await deleteCategory(category.id);
                router.back();
            } },
        ]);
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScreenHeader
                    title={`${category.icon} ${category.name}`}
                    subtitle={"Edit your category details"}
                />

                {editing ? (
                    // edit mode
                    <View style={{ marginBottom: 20 }}>
                        <FormField label="Category Name" value={name} onChangeText={setName} />

                        <Text style={[styles.label, { color: colors.textSecondary }]}>Choose Colour</Text>
                        <View style={styles.colourGrid}>
                            {CategoryColors.map((c) => (
                                <Pressable
                                    key={c}
                                    onPress={() => setColor(c)}
                                    style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorSelected]}
                                />
                            ))}
                        </View>

                        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Choose Icon</Text>
                        <View style={styles.iconGrid}>
                            {CategoryIcons.map((ic) => (
                                <Pressable
                                    key={ic}
                                    onPress={() => setIcon(ic)}
                                    style={[styles.iconButton, { backgroundColor: icon === ic ? color + '30' : colors.surfaceAlt }]}
                                >
                                    <Text style={{ fontSize: 24 }}>{ic}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <View style={{ marginTop: 16 }}>
                            <PrimaryButton label="Save Changes" onPress={handleSave} />
                            <View style={{ height: 10 }} />
                            <PrimaryButton label="Cancel" variant="secondary" onPress={() => setEditing(false)} />
                            </View>
                        </View>
                        ) : (
                            // view mode
                            <View style={styles.actions}>
                                <PrimaryButton label="Edit Category" onPress={() => setEditing(true)} />
                                <View style={{ height: 10 }} />
                                <PrimaryButton label="Delete Category" variant="danger" onPress={handleDelete} />
                            </View>
                        )}

                        <View style={{ marginTop: 16 }}>
                            <PrimaryButton label="Back to Categories" variant="secondary" onPress={() => router.back()} />
                        </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, padding: 20},
    label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
    colourGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    colorDot: { borderRadius: 999, height: 36, width: 36 },
    colorSelected: { 
        borderWidth: 3, 
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        },
    iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    iconButton: {
        alignItems: 'center',
        borderRadius: 12,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    actions: { marginTop: 8 },
});