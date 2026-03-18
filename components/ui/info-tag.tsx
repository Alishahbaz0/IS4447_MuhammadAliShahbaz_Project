import { StyleSheet, Text, View } from 'react-native';

type Props = {
    label: string;
    value: string;
    color?: string;   // tint colour for pill backgroung, defaulting to theme primary colour
};

// small pill-shaped tag used to display log category and other info in a compact way
export default function InfoTag({ label, value, color = '#0D9488' }: Props) {
    return (
        // background colour is a lighter version (-9% opacity) of the provided colour for a subtle look
        <View style={[styles.tag, { backgroundColor: color + '18' }]}>
            <Text style={[styles.label, { color }]}>{label}: </Text>
            <Text style={[styles.value, { color }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        borderRadius: 999,          // fully rounded pill shape
        flexDirection: 'row',
        marginRight: 8,
        marginBottom: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    label: { fontSize: 12, fontWeight: '600', marginRight: 4 },
    value: { fontSize: 12, fontWeight: '500' },
});