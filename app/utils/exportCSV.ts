{/* 
----- Iteration 9: Dark Mode, CSV Export, Final Iteration -----
This utility file allows generating a CSV file with user's habit logs with their habit and category names
I learned how to add this functionality using the following online resources:
- Share API, React Native Docs, Available at:
https://reactnative.dev/docs/share
- Generate and Share Excel Styled Spreadsheets Using React Native, Victor Sanchez, Medium Blogpost, Available at:
https://medium.com/better-programming/generate-and-share-excel-styled-spreadsheets-using-react-native-e2034492c234
*/}

import { Category, Habit, HabitLog } from '@/contexts/HabitContext';
import { Alert, Share } from 'react-native';

// Generating a CSV String from the user's habit logs
export function generateCSV(
    logs: HabitLog[],
    habits: Habit[],
    categories: Category[]
) : string {
    // setting CSV Header Row
    const header = 'Date,Habit,Category,Frequency,Completed,Notes';

    // building a lookup map for Habit ID -> Habit Object
    const habitMap = new Map(habits.map((h) => [h.id, h]));

    // building a lookup map for Category ID -> Category object
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // one row per log entry, sorting it by date descending
    const rows = logs
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((log) => {
        const habit = habitMap.get(log.habitID);
        const category = habit ? categoryMap.get(habit.categoryID) : undefined;

        // escape commas and quotes in text fields
        const escapeCsv = (s: string) => `"${s.replace(/"/g, '""')}"`;

        return [
            log.date,
            escapeCsv(habit?.name ?? 'Unknown'),
            escapeCsv(category?.name ?? 'Uncategorised'),
            habit?.frequency ?? '',
            log.completed ? 'Yes' : 'No',
            escapeCsv(log.notes ?? ''),
        ].join(',');
    });

    return [header, ...rows].join('\n');
}

// Sharing the CSV using the native share options
export async function shareCSV(csv: string) {
    try {
        await Share.share({
            message: csv,
            title: 'Habit Tracker Export',
        });
    } catch (err: any) {
        Alert.alert('Export Error', err.message ?? 'Failed to export data');
    }
}