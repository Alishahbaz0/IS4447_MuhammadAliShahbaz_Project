// importing all necessary modules and components
import EmptyState from '@/components/ui/empty-state';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// temporary home screen for app
export default function HomeScreen() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <ScreenHeader title="Welcome to Habit Tracker!" subtitle="Your journey to better habits starts here." />

            <EmptyState
                icon="📈"
                title="Welcome User!"
            />

            {/* previewing three button variants */}
            <View style={styles.buttons}>
                <PrimaryButton label="Primary Button" onPress={() => {}} />
                <view style={{ height: 10 }} />

                <PrimaryButton label="Secondary Button" onPress={() => {}} variant="secondary" />
                <view style={{ height: 10 }} />

                <PrimaryButton label="Danger Button" onPress={() => {}} variant="danger" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
    buttons: { marginTop: 20 },
});