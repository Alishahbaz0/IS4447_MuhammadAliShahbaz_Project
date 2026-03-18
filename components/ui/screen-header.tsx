import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    title: string;
    subtitle?: string;  // optional smaller text below the title
};

// consistent header component for all screens, using theme colours
export default function ScreenHeader({ title, subtitle }: Props) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    title: { fontSize: 28, fontWeight: '700' },
    subtitle: { fontSize: 14, marginTop: 4 },
});