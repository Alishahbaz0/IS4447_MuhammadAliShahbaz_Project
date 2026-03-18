import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    icon: string;       // displays emoji as a large visual cue
    title: string;
    subtitle?: string;
};

// the empty state component used when there are no logs to show, gives the user guidance on what to do next.
export default function EmptyState({ icon, title, subtitle }: Props) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 },
    icon: { fontSize: 40, marginBottom: 12 },
    title: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
    subtitle: { fontSize: 14, marginTop: 6, textAlign: 'center' },
});