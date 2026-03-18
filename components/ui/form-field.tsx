import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;                                            // taller input field for longer text, like notes
    keyboardType?: 'default' | 'email-address' | 'numeric';
    secureTextEntry?: boolean;                                      // hiding sensitive info like passwords
    autoCapitilize?: 'none' | 'sentences' | 'words';
};

// labelled text input field used across all the forms in the app
export default function FormField({
    label, value, onChangeText, placeholder, multiline, keyboardType, secureTextEntry, autoCapitilize,
}: Props) {
    const { colors } = useTheme();

    return (
        <View style={styles.wrapper}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            <TextInput
                placeholder={placeholder ?? label}
                placeholderTextColor={colors.textMuted}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitilize}
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                    },
                    multiline && styles.multiline,
                    ]}
                />
            </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: 14 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
    input: { 
        borderWidth: 1, 
        borderRadius: 12, 
        fontSize: 15,
        paddingHorizontal: 14,
        paddingVertical: 12, 
    },
    multiline: { minHeight: 80, textAlignVertical: 'top' },     // align multiline text to the top of the input field
});