import { useTheme } from "@/contexts/ThemeContext";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
    label: string;
    onPress: () => void;
    compact?: boolean;                                // smaller size for inline use
    variant?: 'primary' | 'secondary' | 'danger';     // different colour styles
    disabled?: boolean;
};

export default function PrimaryButton({ label, onPress, compact = false, variant = 'primary', disabled = false }: Props) {
    const { colors } = useTheme();

    // determine background colour based on variant and disabled state
    const bgColor = variant === 'primary' ? colors.primary :
                    variant === 'danger' ? colors.danger :
                    colors.surface;

    // secondary variant uses a darker text colour
    const textColor = variant === 'secondary' ? colors.text : '#FFFFFF';

    // only secondary variant uses a border colour
    const borderColor = variant === 'secondary' ? colors.border : 'transparent';

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: bgColor, borderColor, borderWidth: variant === 'secondary' ? 1 : 0 },
                compact && styles.compact,
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}
        >
            <Text style={[styles.label, { color: textColor }, compact && styles.compactLabel]}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 16,
    },
    compact: {
        alignSelf: 'flex-start',
        paddingVertical: 9,
        paddingHorizontal: 14,
    },
    pressed: {opacity: 0.85},
    disabled: {opacity: 0.5},
    label: {fontSize: 15, fontWeight: '600'},
    compactLabel: {fontSize: 13},
});


