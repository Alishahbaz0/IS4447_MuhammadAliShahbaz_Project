// ----- Iteration 8: Seed data -----
// this seed.ts file populates the db with realistic sample habits, logs, and targets
// the user will be able to use a "Load Sample Data" button on the profile screen to access this sample account.
// I used the following online resource to understand how to structure seed.ts files:
// react_native-restate/.../seed.ts, Adrian Hajdin, GitHub, Available at:
// https://github.com/adrianhajdin/react_native-restate/blob/main/lib/seed.ts

import { db } from './client';
import { categories, habitLogs, habits, targets } from './schema';

// sample data generator
export async function seedSampleData(userId: number) {
    // 1. creating 4 sample categories
    const categoryData = [
        { name: 'Fitness', color: '#EF4444', icon: '💪' },
        { name: 'Mindfulness', color: '#8B5CF6', icon: '🧘' },
        { name: 'College', color: '#3B82F6', icon: '📚' },
        { name: 'Health', color: '#22C55E', icon: '🥗' },
    ];

    const insertedCategoryIds: number[] = [];
    for (const cat of categoryData) {
        const result = await db.insert(categories).values({ ...cat, userID: userId }).returning({ id: categories.id });
        insertedCategoryIds.push(result[0].id);
    }

    // 2. creating sample habits for the categories.
    const habitData = [
        { name: 'Morning workout', categoryIdx: 0, frequency: 'daily', notes: 'Push, Pull, Legs, Cardio + Abs' },
        { name: 'Evening walk', categoryIdx: 0, frequency: 'weekly', notes: '' },
        { name: 'Meditate', categoryIdx: 1, frequency: 'daily', notes: '10 minute session' },
        { name: 'IS4447: Mobile app project', categoryIdx: 2, frequency: 'daily', notes: 'Complete next iteration of project' },
        { name: 'IS4438: Exam Revision', categoryIdx: 2, frequency: 'weekly', notes: 'study for exam' },
        { name: 'Drink 2L Water', categoryIdx: 3, frequency: 'daily', notes: '' },
    ];

    const insertedHabitIds: number[] = [];
    for (const h of habitData) {
        const result = await db
        .insert(habits)
        .values({
            name: h.name,
            categoryID: insertedCategoryIds[h.categoryIdx],
            frequency: h.frequency,
            notes: h.notes,
            userID: userId,
        })
        .returning({ id: habits.id });
        insertedHabitIds.push(result[0].id);
    }

    // 3. Generating 30 days of log history
    // this log history would populate the charts in the insight page
    // providing completion rates for each habit
    const completionRates = [0.9, 0.6, 0.85, 0.75, 0.5, 0.95];
    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
        const d = new Date();
        d.setDate(d.getDate() - dayOffset);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;

        for (let i = 0; i < insertedHabitIds.length; i++) {
            // randomly logging based on the habit's completion rate.
            if (Math.random() < completionRates[i]) {
                await db.insert(habitLogs).values({
                    habitID: insertedHabitIds[i],
                    date: dateStr,
                    count: 1,
                    completed: 1,
                    notes: '',
                })
            }
        }
    }

    // 4. setting sample targets for habits - two weekly, one monthly.
    await db.insert(targets).values({
        userID: userId,
        habitID: insertedHabitIds[0],
        categoryID: null,
        type: 'weekly',
        goalValue: 5,
    });
    await db.insert(targets).values({
        userID: userId,
        habitID: insertedHabitIds[2],
        categoryID: null,
        type: 'weekly',
        goalValue: 7,
    });
    await db.insert(targets).values({
        userID: userId,
        habitID: insertedHabitIds[3],
        categoryID: null,
        type: 'monthly',
        goalValue: 20,
    });
}

// wipe all of the user's data - useful for resetting before reseeding
export async function wipeUserData(userId: number) {
    // the cascade delete in the user's table FK lets us delete the category/habit, rows and their children follow
    const { eq } = await import('drizzle-orm');
    await db.delete(targets).where(eq(targets.userID, userId));
    await db.delete(categories).where(eq(categories.userID, userId));
    await db.delete(habits).where(eq(habits.userID, userId));
}