import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useHabit } from '@/contexts/HabitContext';
import { useRouter } from 'expo-router';
import { CategoryColors, CategoryIcons } from '@/constants/theme';
import ScreenHeader from '@/components/ui/screen-header';
import PrimaryButton from '@/components/ui/primary-button';
import FormField from '@/components/ui/form-field';

// screen for adding a new habit category, setting its name, icon, and color
export default function AddCategoryScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { addCategory } = useHabit();

    // form state with sensible defaults
    const [name, setName] = useState('');
    const [icon, setIcon] = useState(CategoryIcons[0]);
    const [color, setColor] = useState(CategoryColors[0]);

    const handleSave = async () => {
        if (!name.trim()) return Alert.alert('Validation Error', 'Category name cannot be empty.');
        await addCategory({ name: name.trim(), icon, color });
        router.back();
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Add New Category" subtitle="Organise your habits" />

                <FormField label="Category Name" value={name} onChangeText={setName} placeholder="e.g. Health" />

                {/* Colour Picker */}
                <Text style={[styles.label, { color: colors.textSecondary }]}>Choose Colour</Text>
                <View style={styles.colourGrid}>
                    {CategoryColors.map((c) => (
                        <Pressable 
                            key={c} 
                            onPress={() => setColor(c)}
                            style={[
                                styles.colourDot, 
                                { backgroundColor: c }, 
                                color === c && styles.colorSelected,
                            ]} 
                        />
                    ))}
                </View>

                {/* Icon Picker - a grid of preset emoji icons*/}
                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>Choose Icon</Text>
                <View style={styles.iconGrid}>
                    {CategoryIcons.map((ic) => (
                        <Pressable
                            key={ic}
                            onPress={() => setIcon(ic)}
                            style={[
                                styles.iconButton,
                                { backgroundColor: icon === ic ? color + '30' : colors.surfaceAlt },
                            ]}
                        >
                            <Text style={styles.iconEmoji}>{ic}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* Live preview of the category card */}
                    <View style={[styles.preview, { backgroundColor: color + '18' }]}>
                        <Text style={{ fontSize: 24 }}>{icon}</Text>
                        <Text style={[styles.previewName, { color }]}>{name || 'Category Name'}</Text>
                    </View>

                    <View style={styles.button}>
                        <PrimaryButton label="Save Category" onPress={handleSave} />
                        <View style={{ height: 10 }} />
                        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />                                    
                    </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, padding: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    colourGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    colourDot: { borderRadius: 999, height: 36, width: 36 },
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
    iconEmoji: { fontSize: 22 },
    preview: {
        alignItems: 'center',
        borderRadius: 14,
        flexDirection: 'row',
        marginTop: 20,
        padding: 16,
        gap: 10,
        },
    previewName: { fontSize: 16, fontWeight: '700' },
    button: { marginTop: 24 },
});
