// ----- Iteration 7: Charts + Insights -----
// this tab allows users to view chart visualisations for their habits.
// I learned how to create and use charts using the following YouTube tutorial:
// React Native Charts for Beginners, CodewithBeto, YouTube, Available at:
// https://www.youtube.com/watch?v=AkujZtOz9c4

import EmptyState from '@/components/ui/empty-state';
import ScreenHeader from '@/components/ui/screen-header';
import { useHabits } from '@/contexts/HabitContext';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';


// Insights tab - showing completion trends and per-category breakdowns
export default function InsightsScreen() {
    const { colors } = useTheme();
    const { habits, categories, logs } = useHabits();
    const screenWidth = Dimensions.get('window').width - 36;

    // build data for the last 7 days completion line chart
    const last7Days = useMemo(() => {
        const labels: string[] = [];
        const values: number[] = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const key = `${y}-${m}-${day}`;

            // a short label for days of the week
            labels.push(['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]);

            // count completions for that date
            const count = logs.filter((log) => log.date === key && log.completed === 1).length;
            values.push(count);
        }

        return { labels, values };
    }, [logs]);

    // build data for completions per category bar chart
    // I used the following GitHub Documentation for react-native-chart kit to understand how to use Charts:
    // react-native-chart-kit, indiespirit, GitHub, Available at:
    // https://github.com/indiespirit/react-native-chart-kit
    const perCategory = useMemo(() => {
        const labels: string[] = [];
        const values: number[] = [];
        const categoryColors: string[] = [];

        categories.forEach((cat) => {
            const habitsInCat = habits.filter((h) => h.categoryID === cat.id).map((h) => h.id);
            const count = logs.filter((log) => habitsInCat.includes(log.habitID) && log.completed === 1).length;
            labels.push(cat.name.slice(0, 8));
            values.push(count);
            categoryColors.push(cat.color);
        });

        return { labels, values, categoryColors };
    }, [categories, habits, logs]);

    // Overall stats: total completions, active habits, total streak days
    const stats = useMemo(() => {
        const totalCompletions = logs.filter((log) => log.completed === 1).length;
        const activeHabits = habits.length;
        const completionRate = 
            activeHabits > 0 ? Math.round((last7Days.values.reduce((a, b) => a + b, 0) / (activeHabits * 7))* 100) : 0;
        return { totalCompletions, activeHabits, completionRate };
    }, [logs, habits, last7Days]);

    const chartConfig = {
        backgroundGradientFrom: colors.card,
        backgroundGradientto: colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => colors.primary,
        labelColor: (opacity = 1) => colors.textSecondary,
        propsForDots: { r: '5', strokeWidth: '2', stroke: colors.primary },
    };

    return (
        <SafeAreaView style={[styles.safe, {backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="Insights" subtitle="Your habit trends" />

                {habits.length === 0 ? (
                    <EmptyState icon="📊" title="No data yet" subtitle="Create habits and start logging to see insights" />
                ) :(
                    <>
                        {/* Summary stats */}
                        <View style={styles.statsRow}>
                            <StatCard label="Habits" value={stats.activeHabits} color={colors.primary} />
                            <StatCard label="Completions" value={stats.totalCompletions} color={colors.success ?? '#22C55E'} />
                            <StatCard label="7-day Rate" value={`${stats.completionRate}%`} color={colors.warning ?? '#F59E0B'} />
                        </View>

                        {/* Last 7 days line chart */}
                        <Text style={[styles.chartTitle, { color: colors.text }]}>Last 7 Days</Text>
                        <LineChart
                            data={{ labels: last7Days.labels, datasets: [{ data: last7Days.values }] }}
                            width={screenWidth}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                            fromZero
                    />

                    {/* Per category bar chart */}
                    {categories.length > 0 && (
                        <>
                            <Text style={[styles.chartTitle, { color: colors.text, marginTop: 20 }]}>By Category</Text>
                            <BarChart
                                data={{ labels: perCategory.labels, datasets: [{ data: perCategory.values }] }}
                                width={screenWidth}
                                height={220}
                                chartConfig={chartConfig}
                                style={styles.chart}
                                fromZero
                                yAxisLabel=""
                                yAxisSuffix=""
                                showValuesOnTopOfBars
                            />
                        </>
                    )}
                </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// reusable stat summary card
function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
    const { colors } = useTheme();
    return (
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    statCard: { alignItems: 'center', borderRadius: 12, borderWidth: 1, flex: 1, padding: 14 },
    statValue: { fontSize: 22, fontWeight: '800' },
    statLabel: { fontSize: 11, fontWeight: '600', marginTop: 4, textTransform: 'uppercase' },
    chartTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
    chart: { borderRadius: 12 },
});